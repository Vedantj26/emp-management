import api from "./axios";

export const getProducts = () => api.get("/products");

export const createProduct = (data: FormData) =>
    api.post("/products", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const updateProduct = (id: number, data: FormData) =>
    api.put(`/products/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const deleteProduct = (id: number) =>
    api.delete(`/products/${id}`);
