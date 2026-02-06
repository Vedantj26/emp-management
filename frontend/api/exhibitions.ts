import api from "./axios";

export interface ExhibitionPayload {
    id?: number;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    timing?: string;
    active?: boolean;
    // startTime: string;
    // endTime: string;
}

export const getExhibitions = () => api.get("/api/exhibitions");

export const createExhibition = (data: ExhibitionPayload) =>
    api.post("/api/exhibitions", data);

export const updateExhibition = (id: number, data: ExhibitionPayload) =>
    api.put(`/api/exhibitions/${id}`, data);

export const deleteExhibition = (id: number) =>
    api.delete(`/api/exhibitions/${id}`);
