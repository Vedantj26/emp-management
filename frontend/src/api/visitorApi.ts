import api from "./axios";
import type { Visitor } from "../types/Visitor";

export const createVisitor = (data: Visitor) =>
  api.post("/api/visitors", data);

export const getVisitorsByExhibition = (exhibitionId: number) =>
  api.get(`/api/visitors/exhibition/${exhibitionId}`);

export const getAllVisitors = () =>
  api.get("/api/visitors/all");
