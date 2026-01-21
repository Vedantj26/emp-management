import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import type { Visitor } from "../types/Visitor";
import type { Exhibition } from "../types/Exhibition";
import type { Product } from "../types/Product";

import {
  createVisitor,
  getVisitorsByExhibition,
} from "../api/visitorApi";
import { getExhibitions } from "../api/exhibitionApi";
import { getProducts } from "../api/productApi";

const Visitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [viewVisitor, setViewVisitor] = useState<Visitor | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    exhibitionId: 0,
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

  const loadInitialData = async () => {
    try {
      const [exRes, prRes] = await Promise.all([
        getExhibitions(),
        getProducts(),
      ]);
      setExhibitions(exRes.data);
      setProducts(prRes.data);
    } catch {
      toast.error("Failed to load data");
    }
  };

  const loadVisitors = async (exhibitionId: number) => {
    if (!exhibitionId) return;
    const res = await getVisitorsByExhibition(exhibitionId);
    setVisitors(res.data);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.companyName.trim() ||
      !form.exhibitionId ||
      selectedProducts.length === 0
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      await createVisitor({
        ...form,
        productIds: selectedProducts,
      });

      toast.success("Visitor registered successfully");
      setShowModal(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        companyName: "",
        exhibitionId: 0,
      });
      setSelectedProducts([]);
      loadVisitors(form.exhibitionId);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to register visitor");
      }
    }
  };

  const toggleProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      {/* HEADER (unchanged structure) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0, color: "#2c2c2c" }}>Visitors</h3>

        <button
          onClick={() => {
            // if (!selectedExhibitionId) {
            //   toast.error("Please select an exhibition first");
            //   return;
            // }

            setForm((prev) => ({
              ...prev,
              exhibitionId: selectedExhibitionId,
            }));

            setShowModal(true);
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
          + Add Visitor
        </button>
      </div>

      {/* EXHIBITION FILTER */}
      <select
        value={selectedExhibitionId}
        onChange={(e) => {
          const id = Number(e.target.value);
          setSelectedExhibitionId(id);
          loadVisitors(id);
        }}
        style={{
          marginBottom: "16px",
          padding: "8px",
          width: "250px",
        }}
      >
        <option value={0}>Select Exhibition</option>
        {exhibitions.filter((ex) => ex.active).map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>

      {/* TABLE — SAME AS EMPLOYEE */}
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
            {["Name", "Email", "Phone", "Company", "Action"].map((h) => (
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
          {visitors.map((v) => (
            <tr key={v.id}>
              <td style={cellStyle}>{v.name}</td>
              <td style={cellStyle}>{v.email}</td>
              <td style={cellStyle}>{v.phone}</td>
              <td style={cellStyle}>{v.companyName}</td>
              <td style={cellStyle}>
                <button
                  onClick={() => setViewVisitor(v)}
                  style={{
                    padding: "6px 10px",
                    border: "1px solid #1976d2",
                    backgroundColor: "#ffffff",
                    color: "#1976d2",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}

          {visitors.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: "16px", textAlign: "center" }}>
                No visitors found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL — SAME STRUCTURE AS EMPLOYEE */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{ marginBottom: "20px", textAlign: "center" }}>
              Add Visitor
            </h3>

            <form onSubmit={handleCreate}>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
              />

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={inputStyle}
              />

              <input
                placeholder="Company Name"
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
                style={inputStyle}
              />

              <select
                value={form.exhibitionId}
                onChange={(e) =>
                  setForm({ ...form, exhibitionId: Number(e.target.value) })
                }
                style={inputStyle}
              >
                <option value={0}>Select Exhibition</option>
                {exhibitions.filter((ex) => ex.active).map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>

              <div style={{ marginBottom: "12px" }}>
                <strong>Interested Products</strong>

                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    marginTop: "8px",
                    paddingRight: "4px",
                  }}
                >
                  {products.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id!)}
                        onChange={() => toggleProduct(product.id!)}
                      />

                      <span style={{ flex: 1 }}>{product.name}</span>

                      {product.attachment && (
                        <div
                          onClick={() => openPreview(product.attachment)}
                          style={{
                            width: "80px",
                            height: "60px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fafafa",
                          }}
                        >
                          {isImage(product.attachment) ? (
                            <img
                              src={`http://localhost:8080/api/products/download/${product.attachment}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : isPdf(product.attachment) ? (
                            <span style={{ fontSize: "12px", color: "#1976d2" }}>
                              PDF
                            </span>
                          ) : (
                            <span>FILE</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>


              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={cancelBtn}
                >
                  Cancel
                </button>

                <button type="submit" style={saveBtn}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewOpen && previewFile && (
        <div style={{ ...modalOverlay, zIndex: 2000 }}>
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

      {viewVisitor && (
        <div style={modalOverlay}>
          <div style={{ ...modalCard, width: "600px" }}>
            <h3 style={{ textAlign: "center", marginBottom: "16px" }}>
              Visitor Details
            </h3>

            <p><strong>Name:</strong> {viewVisitor.name}</p>
            <p><strong>Email:</strong> {viewVisitor.email}</p>
            <p><strong>Phone:</strong> {viewVisitor.phone}</p>
            <p><strong>Company:</strong> {viewVisitor.companyName}</p>
            <p><strong>Exhibition:</strong> {viewVisitor.exhibition?.name}</p>

            <hr style={{ margin: "12px 0" }} />

            <strong>Interested Products</strong>

            {viewVisitor.visitorProducts?.length === 0 && (
              <p style={{ marginTop: "8px", color: "#777" }}>
                No products selected
              </p>
            )}

            <div
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                marginTop: "8px",
                paddingRight: "4px",
              }}
            >
              {viewVisitor.visitorProducts?.map((vp) => {
                const product = vp.product;

                return (
                  <div
                    key={vp.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ flex: 1 }}>{product.name}</span>

                    {product.attachment && (
                      <div
                        onClick={() => openPreview(product.attachment)}
                        style={{
                          width: "80px",
                          height: "60px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#fafafa",
                        }}
                      >
                        {isImage(product.attachment) ? (
                          <img
                            src={`http://localhost:8080/api/products/download/${product.attachment}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : isPdf(product.attachment) ? (
                          <span style={{ fontSize: "12px", color: "#1976d2" }}>
                            PDF
                          </span>
                        ) : (
                          <span>FILE</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>


            <div style={{ textAlign: "right", marginTop: "16px" }}>
              <button
                onClick={() => setViewVisitor(null)}
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

/* ---------- STYLES (COPIED FROM EMPLOYEE) ---------- */

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
  maxHeight: "80vh",
  overflowY: "auto",
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
};

const cancelBtn: React.CSSProperties = {
  padding: "8px 14px",
  backgroundColor: "#d32f2f",
  color: "#ffffff",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};

const saveBtn: React.CSSProperties = {
  padding: "8px 14px",
  backgroundColor: "#1976d2",
  color: "#ffffff",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};

export default Visitors;
