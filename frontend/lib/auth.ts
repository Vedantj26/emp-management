export type UserRole = "ADMIN" | "USER";

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
}

const TOKEN_KEY = "tech_expo_token";
const USER_KEY = "tech_expo_user";

export function saveAuthData(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
