import api from "./axios";
import { ExhibitionPayload } from "./exhibitions";

export type Product = {
    id?: number;
    name: string;
    description: string;
    attachment?: string;
};

export interface Visitor {
    id?: number;
    name: string;
    email: string;
    phone: string;
    companyName: string;
    exhibitionId: number;
    productIds: number[];
    exhibition?: ExhibitionPayload;
    visitorProducts?: { id: number; product: Product }[];
}

export const createVisitor = (data: Visitor) =>
    api.post("/api/visitors", data);

export const getAllVisitors = () =>
    api.get("/api/visitors/all");

export const getVisitorsByExhibition = (exhibitionId: number) =>
    api.get(`/api/visitors/exhibition/${exhibitionId}`);
