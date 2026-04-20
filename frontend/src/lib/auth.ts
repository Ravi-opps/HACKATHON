export type Role = 'admin' | 'coordinator' | 'field' | 'volunteer';

export interface UserIdentity {
  uid: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  username?: string | null;
  zone?: string | null;
  role: Role;
  profession?: string | null;
  route: string;
}

export interface AuthResponse {
  user: UserIdentity;
  accessToken: string;
  refreshToken?: string | null;
  expiresIn?: number | null;
  sessionCookie?: string | null;
}

interface LoginPayload {
  identifier: string;
  password: string;
  role: Role;
  rememberSession: boolean;
}

interface SignupPayload {
  fullName: string;
  email: string;
  phone: string;
  zone: string;
  password: string;
  confirmPassword: string;
  role: 'field' | 'volunteer';
  profession?: string;
}

const STORAGE_KEY = 'authSession';
const LEGACY_ROLE_KEY = 'userRole';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

function getErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object' && 'detail' in data) {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === 'string') return detail;
  }
  return fallback;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(getErrorMessage(data, `${response.status} ${response.statusText}`));
  }

  return data as T;
}

export function saveAuthSession(session: AuthResponse): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem(LEGACY_ROLE_KEY, session.user.role);
}

export function getAuthSession(): AuthResponse | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_ROLE_KEY);
}

export function getAuthRole(): Role | null {
  const session = getAuthSession();
  return session?.user.role || null;
}

export function getAuthToken(): string | null {
  return getAuthSession()?.accessToken || null;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  saveAuthSession(response);
  return response;
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  const response = await request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  saveAuthSession(response);
  return response;
}

export async function logout(): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    clearAuthSession();
    return;
  }

  try {
    await request('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ revokeAllSessions: true }),
    });
  } finally {
    clearAuthSession();
  }
}
