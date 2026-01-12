import api from "./axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: "ADMIN" | "USER";
}

export const login = (data: LoginRequest) =>
  api.post<LoginResponse>("/auth/login", data);
