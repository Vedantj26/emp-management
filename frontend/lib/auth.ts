export type UserRole = "ADMIN" | "USER";

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
}

const TOKEN_KEY = "tech_expo_token";
const USER_KEY = "tech_expo_user";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function saveAuthData(token: string, user: AuthUser) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  const storage = getStorage();
  if (!storage) return null;
  return storage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  const storage = getStorage();
  if (!storage) return null;
  const data = storage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearAuthData() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(TOKEN_KEY);
  storage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
