import { useNavigate } from "react-router-dom";
import { clearSession, getRole } from "../utils/auth";

const TopNav = () => {
  const navigate = useNavigate();
  const role = getRole();

  const logout = () => {
    clearSession();
    navigate("/");
  };

  return (
    <div
      style={{
        height: "60px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "32px",
          margin: "0 auto",
        }}
      >
        <span
          style={{
            cursor: "pointer",
            fontWeight: 500,
            color: "#2c2c2c",
          }}
          onClick={() => navigate("/employees")}
        >
          Employees
        </span>

        {role === "ADMIN" && (
          <span
            style={{
              cursor: "pointer",
              fontWeight: 500,
              color: "#2c2c2c",
            }}
            onClick={() => navigate("/users")}
          >
            Users
          </span>
        )}
      </div>

      <button
        onClick={logout}
        style={{
          padding: "6px 14px",
          border: "1px solid #d32f2f",
          borderRadius: "4px",
          backgroundColor: "#ffffff",
          color: "#d32f2f",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default TopNav;
