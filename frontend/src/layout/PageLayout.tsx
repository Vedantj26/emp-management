import type { ReactNode } from "react";
import TopNav from "../components/TopNav";

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <TopNav />

      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
};

export default PageLayout;
