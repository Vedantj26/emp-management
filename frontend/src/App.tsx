import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import Users from "./pages/Users";
import PrivateRoute from "./components/PrivateRoute";
import PageLayout from "./layout/PageLayout";
import { ToastContainer } from "react-toastify";
import Products from "./pages/Products";
import Exhibitions from "./pages/Exhibitions";
import Visitors from "./pages/Visitors";
import RoleRoute from "./utils/RoleRoute";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ADMIN"]}>
                <PageLayout>
                  <Employees />
                </PageLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/users"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ADMIN"]}>
                <PageLayout>
                  <Users />
                </PageLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ADMIN"]}>
                <PageLayout>
                  <Products />
                </PageLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/exhibition"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ADMIN", "USER"]}>
                <PageLayout>
                  <Exhibitions />
                </PageLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/visitors"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["ADMIN", "USER"]}>
                <PageLayout>
                  <Visitors />
                </PageLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
