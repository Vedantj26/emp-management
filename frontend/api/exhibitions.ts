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

export const getExhibitions = () => api.get("/exhibitions");

export const createExhibition = (data: ExhibitionPayload) =>
    api.post("/exhibitions", data);

export const updateExhibition = (id: number, data: ExhibitionPayload) =>
    api.put(`/exhibitions/${id}`, data);

export const deleteExhibition = (id: number) =>
    api.delete(`/exhibitions/${id}`);
