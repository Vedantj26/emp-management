import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import React from "react";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  return getToken() ? <>{children}</> : <Navigate to="/" />;
};

export default PrivateRoute;
