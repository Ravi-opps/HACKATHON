# HACKATHON – Environment Setup

This repo has two apps:
- `backend` (FastAPI + PostgreSQL)
- `frontend` (Vite + React)

## 1) Backend env setup

1. Copy env file:
   - `backend\.env.example` -> `backend\.env`
2. Update values in `backend\.env`:
   - `DATABASE_URL`
   - `JWT_SECRET_KEY`
   - `JWT_ALGORITHM`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`
   - `REMEMBER_SESSION_EXPIRE_DAYS`
   - `CORS_ALLOW_ORIGINS`
   - `ALLOWED_ZONES`
   - `ALLOWED_PROFESSIONS`

Example DB URL:
`postgresql+psycopg2://postgres:postgres@localhost:5432/hackathon`

If your DB password contains special characters (like `@`), URL-encode them.
Example: `Kittu@123` -> `Kittu%40123`

### Backend install + run

```powershell
cd backend
python -m venv dev
.\dev\Scripts\python.exe -m pip install -r requirements.txt
.\dev\Scripts\python.exe -m alembic upgrade head
.\dev\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

## 2) Frontend env setup

1. Copy env file:
   - `frontend\.env.example` -> `frontend\.env`
2. Update values in `frontend\.env`:
   - `VITE_API_BASE_URL` (typically `http://localhost:8000`)
   - `GEMINI_API_KEY` (if used in your flow)
   - `APP_URL` (if required by your deployment/runtime)

### Frontend install + run

```powershell
cd frontend
npm install
npm run dev
```

## Notes

- Keep `.env` files private. They are gitignored.
- Run backend before frontend so API calls succeed.
