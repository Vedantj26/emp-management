import { useLocation, useNavigate } from "react-router-dom";
import {
  sidebarStyle,
  sidebarItem,
  sidebarItemActive,
} from "../styles/layoutStyles";

const menu = [
  { label: "Employees", path: "/employees" },
  { label: "Users", path: "/users" },
  { label: "Products", path: "/products" },
  { label: "Exhibition", path: "/exhibition" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={sidebarStyle}>
      <h3 style={{ marginBottom: "20px", color: "#1976d2" }}>
        Admin Panel
      </h3>

      {menu.map((item) => (
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
