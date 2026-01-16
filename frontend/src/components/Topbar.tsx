import { useNavigate } from "react-router-dom";
import { topbarStyle } from "../styles/layoutStyles";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={topbarStyle}>
      {/* Logo */}
      <div
        style={{
          fontWeight: 600,
          fontSize: "18px",
          color: "#1976d2",
        }}
      >
        🏢 MyCompany
      </div>

      {/* Profile */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <span>👤 Admin</span>
        <button
          onClick={handleLogout}
          style={{
            padding: "6px 10px",
            border: "1px solid #d32f2f",
            background: "#ffffff",
            color: "#d32f2f",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
