import { useLocation, useNavigate } from "react-router-dom";
import {
  sidebarStyle,
  sidebarItem,
  sidebarItemActive,
} from "../styles/layoutStyles";
import { getRole } from "../utils/auth";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();

  const menu = [
    { label: "Employees", path: "/employees", roles: ["ADMIN"] },
    { label: "Users", path: "/users", roles: ["ADMIN"] },
    { label: "Products", path: "/products", roles: ["ADMIN"] },
    { label: "Exhibition", path: "/exhibition", roles: ["ADMIN", "USER"] },
    { label: "Visitors", path: "/visitors", roles: ["ADMIN", "USER"] },
  ];

  return (
    <div style={sidebarStyle}>
      <h3 style={{ marginBottom: "20px", color: "#1976d2" }}>
        Admin Panel
      </h3>

      {menu
        .filter((item) => item.roles.includes(role || ""))
        .map((item) => (
          <div
            key={item.path}
            style={
              location.pathname === item.path
                ? sidebarItemActive
                : sidebarItem
            }
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
