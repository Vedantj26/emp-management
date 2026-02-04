import api from "./axios";

export interface UserPayload {
    id?: number;
    username: string;
    password?: string;
    role: string;
}

export const getUsers = () => api.get("/users");

export const createUser = (data: UserPayload) =>
    api.post("/users", data);

export const updateUser = (id: number, data: Omit<UserPayload, "password">) =>
    api.put(`/users/${id}`, data);

export const deleteUser = (id: number) =>
    api.delete(`/users/${id}`);
