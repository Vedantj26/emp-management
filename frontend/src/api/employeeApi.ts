import api from "./axios";
import type { Employee } from "../types/Employee";

export const getEmployees = () =>
  api.get<Employee[]>("/api/employees");

export const createEmployee = (employee: Employee) =>
  api.post<Employee>("/api/employees", employee);

export const updateEmployee = (id: number, employee: Employee) =>
  api.put<Employee>(`/api/employees/${id}`, employee);

export const deleteEmployee = (id: number) =>
  api.delete(`/api/employees/${id}`);