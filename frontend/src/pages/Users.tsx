import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { getUsers, createUser, deleteUser, updateUser } from "../api/userApi";
import { toast } from "react-toastify";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);


  const [form, setForm] = useState<User>({
    username: "",
    password: "",
    role: "USER",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch {
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(form.username ?? "").trim() || !form.role) {
      toast.error("Username and role are required");
      return;
    }

    try {
      if (isEdit && editingUserId) {
        // 🔁 UPDATE USER (NO PASSWORD)
        await updateUser(editingUserId, {
          username: form.username,
          role: form.role,
        });

        toast.success("User updated successfully");
      } else {
        // ➕ CREATE USER
        if (!(form.password ?? "").trim()) {
          toast.error("Password is required");
          return;
        }

        await createUser(form);
        toast.success("User created successfully");
      }

      setShowModal(false);
      setIsEdit(false);
      setEditingUserId(null);
      setForm({ username: "", password: "", role: "USER" });
      loadUsers();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Operation failed");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleEdit = (user: User) => {
    setIsEdit(true);
    setEditingUserId(user.id!);

    setForm({
      username: user.username,
      password: "",
      role: user.role,
    });

    setShowModal(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;

    const willDelete = await swal({
      title: "Are you sure?",
      text: "This will delete the user.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    });

    if (!willDelete) return;

    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      loadUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0, color: "#2c2c2c" }}>Users</h3>

        <button
          onClick={() => {
            setShowModal(true);
            setIsEdit(false);
            setForm({ username: "", password: "", role: "USER" });
          }}
          style={addBtn}
        >
          + Add User
        </button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            {["Username", "Role", "Action"].map((h) => (
              <th key={h} style={thStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={tdStyle}>{user.username}</td>
              <td style={tdStyle}>{user.role}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleEdit(user)}
                  title="Edit User"
                  style={{
                    marginRight: "8px",
                    padding: "6px 8px",
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
                  onClick={() => handleDelete(user.id)}
                  style={deleteBtn}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan={3} style={emptyRow}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <h3 style={{ marginBottom: "16px", color: "#2c2c2c" }}>
              {isEdit ? "Edit User" : "Add User"}
            </h3>

            <form onSubmit={handleCreate}>
              <input
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                style={inputStyle}
              />

              {!isEdit && (
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  style={inputStyle}
                />
              )}

              <select
                value={form.role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setForm({ ...form, role: e.target.value as User["role"] })
                }
                style={inputStyle}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <div style={btnRow}>
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

const addBtn: React.CSSProperties = {
  padding: "8px 14px",
  backgroundColor: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
};

const thStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #e0e0e0",
  textAlign: "left",
  color: "#000000",
  fontWeight: 600,
  backgroundColor: "#f5f5f5",
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #e0e0e0",
  color: "#000000",
};

const deleteBtn: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid #d32f2f",
  backgroundColor: "#ffffff",
  color: "#d32f2f",
  borderRadius: "4px",
  cursor: "pointer",
};

const emptyRow: React.CSSProperties = {
  padding: "16px",
  textAlign: "center",
  color: "#666",
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

const btnRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
};

const cancelBtn: React.CSSProperties = {
  backgroundColor: "#d32f2f",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "4px",
};

const saveBtn: React.CSSProperties = {
  backgroundColor: "#1976d2",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "4px",
};

export default Users;
