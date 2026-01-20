import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import {
  getProducts,
  createProduct,
  deleteProduct,
} from "../api/productApi";
import { toast } from "react-toastify";
import swal from "sweetalert";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const [form, setForm] = useState<Product>({
    name: "",
    description: "",
    attachment: "",
  });

  const isImage = (file?: string) =>
    file?.match(/\.(jpg|jpeg|png|webp)$/i);

  const isPdf = (file?: string) =>
    file?.match(/\.pdf$/i);

  const openPreview = (filename?: string) => {
    if (!filename) return;
    setPreviewFile(filename);
    setPreviewOpen(true);
  };

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "product",
        new Blob([JSON.stringify(form)], { type: "application/json" })
      );

      if (file) {
        formData.append("file", file);
      }

      await createProduct(formData);

      toast.success(isEdit ? "Product updated" : "Product added");
      setShowModal(false);
      setForm({ name: "", description: "", attachment: "" });
      setFile(null);
      loadProducts();

    } catch (err) {
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      attachment: product.attachment,
    });

    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;

    const willDelete = await swal({
      title: "Are you sure?",
      text: "This will delete the product.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });

    if (!willDelete) return;

    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      loadProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0, color: "#2c2c2c" }}>Products</h3>

        <button
          onClick={() => {
            setShowModal(true);
            setIsEdit(false);
            setForm({ name: "", description: "", attachment: "" });
          }}
          style={{
            padding: "8px 14px",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            {["Name", "Description", "Attachment", "Action"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "1px solid #e0e0e0",
                  color: "#333",
                  fontWeight: 600,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={cellStyle}>{product.name}</td>
              <td style={cellStyle}>{product.description}</td>
              <td style={cellStyle}>
                {product.attachment ? (
                  <span
                    onClick={() => openPreview(product.attachment)}
                    style={{
                      cursor: "pointer",
                      color: "#1976d2",
                      textDecoration: "underline",
                    }}
                  >
                    {product.attachment}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td style={cellStyle}>
                <button
                  onClick={() => handleEdit(product)}
                  style={{
                    marginRight: "8px",
                    padding: "6px 10px",
                    border: "1px solid #1976d2",
                    backgroundColor: "#ffffff",
                    color: "#1976d2",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  style={{
                    padding: "6px 10px",
                    border: "1px solid #d32f2f",
                    backgroundColor: "#ffffff",
                    color: "#d32f2f",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "16px", textAlign: "center" }}>
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{ textAlign: "center" }}>
              {isEdit ? "Edit Product" : "Add Product"}
            </h3>

            <form onSubmit={handleCreate}>
              <input
                placeholder="Product Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                style={inputStyle}
              />

              <input
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                style={inputStyle}
              />

              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={inputStyle}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={cancelBtn}
                >
                  Cancel
                </button>

                <button type="submit" style={saveBtn}>
                  {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewOpen && previewFile && (
        <div style={modalOverlay}>
          <div
            style={{
              ...modalCard,
              width: "600px",
              maxHeight: "80vh",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: "12px" }}>
              Attachment Preview
            </h3>

            {isImage(previewFile) ? (
              <img
                src={`http://localhost:8080/api/products/download/${previewFile}`}
                style={{
                  width: "100%",
                  maxHeight: "60vh",
                  objectFit: "contain",
                }}
              />
            ) : isPdf(previewFile) ? (
              <iframe
                src={`http://localhost:8080/api/products/preview/${previewFile}#toolbar=0&navpanes=0&scrollbar=0`}
                style={{
                  width: "100%",
                  height: "60vh",
                  border: "none",
                }}
              />
            ) : (
              <p>Preview not supported</p>
            )}

            <div style={{ textAlign: "right", marginTop: "12px" }}>
              <button
                onClick={() => setPreviewOpen(false)}
                style={cancelBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

const cellStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #e0e0e0",
  color: "#444",
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalCard: React.CSSProperties = {
  width: "380px",
  backgroundColor: "#ffffff",
  padding: "24px 32px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "4px",
  border: "1px solid #cfcfcf",
  backgroundColor: "#f2f2f2",
  color: "#000000",
  colorScheme: "light",
};

const cancelBtn: React.CSSProperties = {
  padding: "8px 14px",
  border: "none",
  backgroundColor: "#d32f2f",
  color: "#ffffff",
  borderRadius: "4px",
  cursor: "pointer",
};

const saveBtn: React.CSSProperties = {
  padding: "8px 14px",
  border: "none",
  backgroundColor: "#1976d2",
  color: "#ffffff",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Products;
