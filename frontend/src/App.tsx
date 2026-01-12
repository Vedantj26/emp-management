import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import Users from "./pages/Users";
import PrivateRoute from "./components/PrivateRoute";
import PageLayout from "./layout/PageLayout";

const App = () => {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
