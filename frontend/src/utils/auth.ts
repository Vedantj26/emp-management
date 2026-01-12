const TOKEN_KEY = "token";
const ROLE_KEY = "role";

export const setSession = (token: string, role: string) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ROLE_KEY, role);
};

export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const getRole = () => {
  return sessionStorage.getItem(ROLE_KEY);
};

export const clearSession = () => {
  sessionStorage.clear();
};
