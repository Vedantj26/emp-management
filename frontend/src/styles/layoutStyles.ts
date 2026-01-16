import type { CSSProperties } from "react";

export const sidebarStyle: CSSProperties = {
  width: 220,
  minWidth: 220,
  height: "100vh",
  backgroundColor: "#ffffff",
  borderRight: "1px solid #e0e0e0",
  padding: "16px",
};

export const sidebarItem: CSSProperties = {
  padding: "10px 12px",
  cursor: "pointer",
  borderRadius: "4px",
  marginBottom: "6px",
  color: "#333",
};

export const sidebarItemActive: CSSProperties = {
  ...sidebarItem,
  backgroundColor: "#f1f3f5",
  fontWeight: 500,
};

export const topbarStyle: CSSProperties = {
  height: 56,
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #e0e0e0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
};

export const contentStyle: CSSProperties = {
  flex: 1,
  padding: "16px",
  backgroundColor: "#ffffff",
  overflowY: "auto",
  overflowX: "hidden",
};
