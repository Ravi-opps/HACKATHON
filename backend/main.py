import os
import re
import uuid
from datetime import UTC, datetime, timedelta
from typing import Generator, Literal

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator
from sqlalchemy import Boolean, DateTime, String, create_engine, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

load_dotenv()

Role = Literal["admin", "coordinator", "field", "volunteer"]
SignupRole = Literal["field", "volunteer"]

ROLE_ROUTE_MAP: dict[Role, str] = {
    "admin": "/admin",
    "field": "/fieldworker",
    "volunteer": "/volunteer",
    "coordinator": "/map",
}

PASSWORD_PATTERN = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$")
PHONE_PATTERN = re.compile(r"^\+[1-9]\d{7,14}$")
bearer_scheme = HTTPBearer(auto_error=True)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _read_env_enum(name: str, fallback: tuple[str, ...]) -> tuple[str, ...]:
    raw = os.getenv(name, "").strip()
    if not raw:
        return fallback
    return tuple(item.strip().lower() for item in raw.split(",") if item.strip())


DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/hackathon"
).strip()
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-production").strip()
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256").strip()
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
REMEMBER_SESSION_EXPIRE_DAYS = int(os.getenv("REMEMBER_SESSION_EXPIRE_DAYS", "14"))
ALLOWED_ZONES = _read_env_enum("ALLOWED_ZONES", ("north", "south", "east", "west", "central"))
ALLOWED_PROFESSIONS = _read_env_enum(
    "ALLOWED_PROFESSIONS", ("student", "engineer", "teacher", "doctor", "other")
)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True, index=True)
    username: Mapped[str] = mapped_column(String(64), nullable=False, unique=True, index=True)
    phone: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    zone: Mapped[str] = mapped_column(String(40), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    profession: Mapped[str | None] = mapped_column(String(40), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )


engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

app = FastAPI(title="HACKATHON Auth API", version="2.0.0")
origins = [origin.strip() for origin in os.getenv("CORS_ALLOW_ORIGINS", "*").split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SignupRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    fullName: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str
    zone: str
    password: str
    confirmPassword: str
    role: SignupRole
    profession: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        if not PHONE_PATTERN.match(value):
            raise ValueError("phone must be in E.164 format (e.g., +919876543210)")
        return value

    @field_validator("zone")
    @classmethod
    def validate_zone(cls, value: str) -> str:
        normalized = value.lower()
        if normalized not in ALLOWED_ZONES:
            raise ValueError(f"zone must be one of: {', '.join(ALLOWED_ZONES)}")
        return normalized

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        if not PASSWORD_PATTERN.match(value):
            raise ValueError(
                "password must be 8+ chars with upper, lower, number, and special character"
            )
        return value

    @model_validator(mode="after")
    def validate_cross_fields(self) -> "SignupRequest":
        if self.password != self.confirmPassword:
            raise ValueError("password and confirmPassword must match")
        if self.role == "volunteer":
            if not self.profession:
                raise ValueError("profession is required when role is volunteer")
            profession = self.profession.lower()
            if profession not in ALLOWED_PROFESSIONS:
                raise ValueError(f"profession must be one of: {', '.join(ALLOWED_PROFESSIONS)}")
            self.profession = profession
        else:
            self.profession = None
        return self


class LoginRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    identifier: str = Field(min_length=3)
    password: str = Field(min_length=1)
    role: Role
    rememberSession: bool = False


class LogoutRequest(BaseModel):
    revokeAllSessions: bool = True


class UserIdentity(BaseModel):
    id: str
    fullName: str
    email: EmailStr
    phone: str
    username: str
    zone: str
    role: Role
    profession: str | None = None
    route: str


class AuthResponse(BaseModel):
    user: UserIdentity
    accessToken: str
    refreshToken: str | None = None
    expiresIn: int | None = None
    sessionCookie: str | None = None


class OAuth2TokenRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    username: str
    password: str
    role: Role


class OAuth2TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class FrontendAuthConfig(BaseModel):
    googleClientId: str | None = None
    googleSignInEnabled: bool = False


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _hash_password(password: str) -> str:
    return pwd_context.hash(password)


def _verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def _sanitize_username_base(email: str) -> str:
    base = re.sub(r"[^a-z0-9._]", "", email.split("@", maxsplit=1)[0].lower())[:30]
    return base or "user"


def _username_exists(db: Session, username: str) -> bool:
    return db.scalar(select(User.id).where(User.username == username).limit(1)) is not None


def _generate_unique_username(db: Session, email: str) -> str:
    base = _sanitize_username_base(email)
    if not _username_exists(db, base):
        return base
    idx = 1
    while True:
        candidate = f"{base}{idx}"
        if not _username_exists(db, candidate):
            return candidate
        idx += 1


def _lookup_user_from_identifier(db: Session, identifier: str) -> User:
    normalized = identifier.lower()
    statement = select(User).where(or_(User.email == normalized, User.username == normalized))
    user = db.scalar(statement)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="INVALID_IDENTIFIER")
    return user


def _build_identity(user: User) -> UserIdentity:
    role = user.role.lower()
    if role not in ROLE_ROUTE_MAP:
        role = "volunteer"
    return UserIdentity(
        id=user.id,
        fullName=user.full_name,
        email=user.email,
        phone=user.phone,
        username=user.username,
        zone=user.zone,
        role=role,  # type: ignore[arg-type]
        profession=user.profession,
        route=ROLE_ROUTE_MAP[role],  # type: ignore[index]
    )


def _create_access_token(user: User, remember_session: bool = False) -> tuple[str, int]:
    expires_delta = (
        timedelta(days=REMEMBER_SESSION_EXPIRE_DAYS)
        if remember_session
        else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    expire_at = datetime.now(UTC) + expires_delta
    payload = {
        "sub": user.id,
        "role": user.role,
        "exp": expire_at,
        "type": "access",
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token, int(expires_delta.total_seconds())


def _decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="INVALID_TOKEN") from exc
    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="INVALID_TOKEN_TYPE")
    return payload


def _verify_bearer_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    return _decode_access_token(credentials.credentials)


def _get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    payload = _decode_access_token(token)
    user_id = str(payload.get("sub", "")).strip()
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="INVALID_TOKEN_SUBJECT")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="USER_NOT_FOUND")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="USER_INACTIVE")
    return user


def _require_role(role: Role):
    def dependency(
        decoded_token: dict = Depends(_verify_bearer_token),
    ) -> dict:
        token_role = str(decoded_token.get("role", "")).lower()
        if token_role != role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"{role.upper()} role required",
            )
        return decoded_token

    return dependency


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/auth/config", response_model=FrontendAuthConfig)
def auth_config() -> FrontendAuthConfig:
    return FrontendAuthConfig()


@app.post("/auth/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)) -> AuthResponse:
    email = payload.email.lower()
    if db.scalar(select(User.id).where(User.email == email).limit(1)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="EMAIL_ALREADY_EXISTS")
    username = _generate_unique_username(db, email)
    user = User(
        full_name=payload.fullName,
        email=email,
        username=username,
        phone=payload.phone,
        zone=payload.zone.lower(),
        role=payload.role,
        profession=payload.profession,
        hashed_password=_hash_password(payload.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="USER_ALREADY_EXISTS") from exc
    db.refresh(user)
    access_token, expires_in = _create_access_token(user)
    return AuthResponse(
        user=_build_identity(user),
        accessToken=access_token,
        refreshToken=None,
        expiresIn=expires_in,
    )


@app.post("/auth/login", response_model=AuthResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)) -> AuthResponse:
    user = _lookup_user_from_identifier(db, payload.identifier)
    if not _verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="INVALID_CREDENTIALS")
    identity = _build_identity(user)
    if identity.role != payload.role:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="ROLE_MISMATCH")
    access_token, expires_in = _create_access_token(user, payload.rememberSession)
    response.delete_cookie("session")
    return AuthResponse(
        user=identity,
        accessToken=access_token,
        refreshToken=None,
        expiresIn=expires_in,
        sessionCookie=None,
    )


@app.post("/auth/token", response_model=OAuth2TokenResponse)
def issue_token(payload: OAuth2TokenRequest, db: Session = Depends(get_db)) -> OAuth2TokenResponse:
    user = _lookup_user_from_identifier(db, payload.username)
    if not _verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="INVALID_CREDENTIALS")
    if user.role.lower() != payload.role:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="ROLE_MISMATCH")
    token, expires_in = _create_access_token(user)
    return OAuth2TokenResponse(access_token=token, expires_in=expires_in)


@app.post("/auth/google")
def google_signin_disabled() -> dict[str, str]:
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="GOOGLE_AUTH_DISABLED",
    )


@app.get("/auth/google")
def google_signin_disabled_get() -> dict[str, str]:
    return {"status": "disabled", "message": "Google auth is disabled for local auth mode."}


@app.get("/auth/me", response_model=UserIdentity)
def me(current_user: User = Depends(_get_current_user)) -> UserIdentity:
    return _build_identity(current_user)


@app.post("/auth/logout")
def logout(payload: LogoutRequest, response: Response) -> dict[str, str]:
    response.delete_cookie("session")
    return {"message": "Logged out"}


@app.get("/admin")
def admin_home(_: dict = Depends(_require_role("admin"))) -> dict[str, str]:
    return {"route": "/admin", "message": "Admin access granted"}


@app.get("/fieldworker")
def field_home(_: dict = Depends(_require_role("field"))) -> dict[str, str]:
    return {"route": "/fieldworker", "message": "Field access granted"}


@app.get("/volunteer")
def volunteer_home(_: dict = Depends(_require_role("volunteer"))) -> dict[str, str]:
    return {"route": "/volunteer", "message": "Volunteer access granted"}


@app.get("/map")
def coordinator_home(_: dict = Depends(_require_role("coordinator"))) -> dict[str, str]:
    return {"route": "/map", "message": "Coordinator access granted"}


@app.get("/favicon.ico")
def favicon() -> Response:
    return Response(status_code=status.HTTP_204_NO_CONTENT)
