import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { contentStyle } from "../styles/layoutStyles";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Topbar />
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
