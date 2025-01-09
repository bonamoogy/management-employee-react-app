import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import EmployeeList from "./pages/employee/EmployeeList";

import UnitList from "./pages/master-data/unit/UnitList";
import PositionList from "./pages/master-data/position/PositionList";

import PageNotFound from "./components/PageNotFound";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth/*" element={<Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/employees" element={<EmployeeList />} />
                    <Route path="/units" element={<UnitList />} />
                    <Route path="/positions" element={<PositionList />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>

      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
