import { useEffect, useState } from "react";
import type { Employee } from "../types/Employee";
import {
    getEmployees,
    createEmployee,
    deleteEmployee,
} from "../api/employeeApi";
import { toast } from "react-toastify";
import axios from "axios";

const Employees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [form, setForm] = useState<Employee>({
        name: "",
        email: "",
        department: "",
        salary: 0,
    });

    const loadEmployees = async () => {
        try {
            const res = await getEmployees();
            setEmployees(res.data);
        } catch {
            toast.error("Failed to load employees");
        }
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            const res = await getEmployees();
            setEmployees(res.data);
        };

        fetchEmployees();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.department.trim() ||
            form.salary <= 0
        ) {
            toast.error("All fields are required");
            return;
        }

        try {
            await createEmployee(form);
            toast.success(
                isEdit
                    ? "Employee updated successfully"
                    : "Employee added successfully"
            );
            setShowModal(false);
            setForm({ name: "", email: "", department: "", salary: 0 });
            loadEmployees();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Failed to add employee");
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    const handleEdit = (emp: Employee) => {
        setForm({
            id: emp.id,
            name: emp.name,
            email: emp.email,
            department: emp.department,
            salary: emp.salary,
        });

        setIsEdit(true);
        setShowModal(true);
    };


    const handleDelete = async (id?: number) => {
        if (!id) return;

        try {
            await deleteEmployee(id);
            toast.success("Employee deleted");
            loadEmployees();
        } catch {
            toast.error("Failed to delete employee");
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
                <h3 style={{ margin: 0, color: "#2c2c2c" }}>Employees</h3>

                <button
                    onClick={() => {
                        setShowModal(true);
                        setIsEdit(false);
                        setForm({ name: "", email: "", department: "", salary: 0 });
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
                    + Add Employee
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
                        {["Name", "Email", "Department", "Salary", "Action"].map((h) => (
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
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td style={cellStyle}>{emp.name}</td>
                            <td style={cellStyle}>{emp.email}</td>
                            <td style={cellStyle}>{emp.department}</td>
                            <td style={cellStyle}>{emp.salary}</td>
                            <td style={cellStyle}>
                                <button
                                    onClick={() => handleEdit(emp)}
                                    title="Edit Employee"
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
                                    onClick={() => handleDelete(emp.id)}
                                    title="Delete Employee"
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

                    {employees.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                style={{
                                    padding: "16px",
                                    textAlign: "center",
                                    color: "#666",
                                }}
                            >
                                No employees found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* MODAL */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalCard}>
                        <h3 style={{ marginBottom: "20px", color: "#2c2c2c", textAlign: "center" }}>
                            {isEdit ? "Edit Employee" : "Add Employee"}
                        </h3>

                        <form onSubmit={handleCreate}>
                            <input
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                style={inputStyle}
                            />

                            <input
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                style={inputStyle}
                            />

                            <input
                                placeholder="Department"
                                value={form.department}
                                onChange={(e) =>
                                    setForm({ ...form, department: e.target.value })
                                }
                                style={inputStyle}
                            />

                            <input
                                type="number"
                                placeholder="Salary"
                                value={form.salary}
                                onChange={(e) =>
                                    setForm({ ...form, salary: Number(e.target.value) })
                                }
                                style={inputStyle}
                            />

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "10px",
                                }}
                            >
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

export default Employees;
