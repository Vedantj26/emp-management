import api from "./axios";

export const getProducts = () => api.get("/api/products");

export const createProduct = (data: FormData) =>
  api.post("/api/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteProduct = (id: number) =>
  api.delete(`/api/products/${id}`);
