import { UserRole } from "@/lib/auth";
import api from "./axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  email: string;
  username: string;
  role: UserRole;
}

export const login = (data: LoginRequest) =>
  api.post<LoginResponse>("/auth/login", data);
