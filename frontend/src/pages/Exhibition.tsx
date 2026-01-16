import { useEffect, useState } from "react";
import type { Exhibition } from "../types/Exhibition";
import {
  getExhibitions,
  createExhibition,
  deleteExhibition,
  updateExhibition,
} from "../api/exhibitionApi";
import { toast } from "react-toastify";
import axios from "axios";
import swal from "sweetalert";

const Exhibition = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<Exhibition>({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    timing: "",
    active: true,
  });

  const loadExhibitions = async () => {
    try {
      const res = await getExhibitions();
      setExhibitions(res.data);
    } catch {
      toast.error("Failed to load exhibitions");
    }
  };

  useEffect(() => {
    loadExhibitions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.location.trim() ||
      !form.startDate ||
      !form.endDate ||
      !form.timing
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (isEdit && form.id) {
        await updateExhibition(form.id, form);
        toast.success("Exhibition updated successfully");
      } else {
        await createExhibition(form);
        toast.success("Exhibition added successfully");
      }

      setShowModal(false);
      setIsEdit(false);
      setForm({
        name: "",
        location: "",
        startDate: "",
        endDate: "",
        timing: "",
        active: true,
      });

      loadExhibitions();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to save exhibition");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleEdit = (ex: Exhibition) => {
    setForm(ex);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;

    const willDelete = await swal({
      title: "Are you sure?",
      text: "This will delete the exhibition.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });

    if (!willDelete) return;

    try {
      await deleteExhibition(id);
      toast.success("Exhibition deleted");
      loadExhibitions();
    } catch {
      toast.error("Failed to delete exhibition");
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
        <h3 style={{ margin: 0, color: "#2c2c2c" }}>Exhibitions</h3>

        <button
          onClick={() => {
            setShowModal(true);
            setIsEdit(false);
            setForm({
              name: "",
              location: "",
              startDate: "",
              endDate: "",
              timing: "",
              active: true,
            });
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
          + Add Exhibition
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
            {["Name", "Location", "Dates", "Timing", "Active", "Action"].map(
              (h) => (
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
              )
            )}
          </tr>
        </thead>

        <tbody>
          {exhibitions.map((ex) => (
            <tr key={ex.id}>
              <td style={cellStyle}>{ex.name}</td>
              <td style={cellStyle}>{ex.location}</td>
              <td style={cellStyle}>
                {ex.startDate} → {ex.endDate}
              </td>
              <td style={cellStyle}>{ex.timing}</td>
              <td style={cellStyle}>{ex.active ? "Yes" : "No"}</td>
              <td style={cellStyle}>
                <button
                  onClick={() => handleEdit(ex)}
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
                  onClick={() => handleDelete(ex.id)}
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

          {exhibitions.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "16px", textAlign: "center" }}>
                No exhibitions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{ marginBottom: "20px", textAlign: "center" }}>
              {isEdit ? "Edit Exhibition" : "Add Exhibition"}
            </h3>

            <form onSubmit={handleCreate}>
              <input
                placeholder="Exhibition Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />

              <input
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                style={inputStyle}
              />

              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                style={inputStyle}
              />

              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
                style={inputStyle}
              />

              {/* Start Time */}
              <input
                type="time"
                value={form.timing.split(" - ")[0] || ""}
                onChange={(e) => {
                  const end = form.timing.split(" - ")[1] || "";
                  setForm({
                    ...form,
                    timing: `${e.target.value}${end ? " - " + end : ""}`,
                  });
                }}
                style={inputStyle}
              />

              {/* End Time */}
              <input
                type="time"
                value={form.timing.split(" - ")[1] || ""}
                onChange={(e) => {
                  const start = form.timing.split(" - ")[0] || "";
                  setForm({
                    ...form,
                    timing: `${start}${start ? " - " : ""}${e.target.value}`,
                  });
                }}
                style={inputStyle}
              />

              <div style={{ display: "flex", gap: "10px" }}>
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
    </>
  );
};

/* ===== STYLES (UNCHANGED) ===== */

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

export default Exhibition;
