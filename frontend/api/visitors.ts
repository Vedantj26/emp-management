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
    designation?: string;
    cityState?: string;
    companyType?: string[];
    companyTypeOther?: string;
    industry?: string[];
    industryOther?: string;
    companySize?: string[];
    interestAreas?: string[];
    solutions?: string[];
    solutionsOther?: string;
    timeline?: string[];
    budget?: string[];
    followUpMode?: string[];
    bestTimeToContact?: string[];
    additionalNotes?: string;
    consent?: boolean;
    exhibitionId: number;
    productIds: number[];
    exhibition?: ExhibitionPayload;
    visitorProducts?: { id: number; product: Product }[];
}

export interface VisitorCreateResponse {
    visitor: Visitor;
    emailSent: boolean;
    emailError?: string;
}

export const createVisitor = (data: Visitor) =>
    api.post<VisitorCreateResponse>("/visitors", data);

export const getAllVisitors = () =>
    api.get("/visitors/all");

export const getVisitorsByExhibition = (exhibitionId: number) =>
    api.get(`/visitors/exhibition/${exhibitionId}`);
