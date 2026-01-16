import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import Users from "./pages/Users";
import PrivateRoute from "./components/PrivateRoute";
import PageLayout from "./layout/PageLayout";
import { ToastContainer } from "react-toastify";
import Products from "./pages/Products";
import Exhibition from "./pages/Exhibition";

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
              <PageLayout>
                <Employees />
              </PageLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/users"
          element={
            <PrivateRoute>
              <PageLayout>
                <Users />
              </PageLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <PageLayout>
                <Products />
              </PageLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/exhibition"
          element={
            <PrivateRoute>
              <PageLayout>
                <Exhibition />
              </PageLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
