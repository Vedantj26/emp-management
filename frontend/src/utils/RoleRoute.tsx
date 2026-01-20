import { Navigate } from "react-router-dom";
import { getRole } from "./auth";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const RoleRoute = ({ children, allowedRoles }: Props) => {
  const role = getRole();
  console.debug("🚀 RoleRoute role:", role);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/exhibition" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
