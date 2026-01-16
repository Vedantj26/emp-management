import api from "./axios";
import type { Exhibition } from "../types/Exhibition";

export const getExhibitions = () => api.get("/api/exhibitions");

export const createExhibition = (data: Exhibition) =>
  api.post("/api/exhibitions", data);

export const updateExhibition = (id: number, data: Exhibition) =>
  api.put(`/api/exhibitions/${id}`, data);

export const deleteExhibition = (id: number) =>
  api.delete(`/api/exhibitions/${id}`);
