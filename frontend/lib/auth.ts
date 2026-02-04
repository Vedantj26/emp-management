export type UserRole = "ADMIN" | "USER";

export interface AuthUser {
  id?: number;
  email?: string;
  username: string;
  role: UserRole;
}

const USER_KEY = "tech_expo_user";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function saveAuthData(user: AuthUser) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(USER_KEY, JSON.stringify(user));
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
  storage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAuthUser();
}
