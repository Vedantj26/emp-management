import api from "./axios";
import type { User } from "../types/User";

export const getUsers = () => api.get("/api/users");

export const createUser = (data: User) =>
  api.post("/api/users", data);

export const deleteUser = (id: number) =>
  api.delete(`/api/users/${id}`);
