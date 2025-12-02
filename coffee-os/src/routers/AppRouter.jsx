import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import MapPage from "../pages/MapPage";
import MainLayout from "../layouts/MainLayout";
import BeanOriginsPage from "../pages/BeanOriginsPage";

function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MapPage />} />
        <Route path="bean-origins" element={<BeanOriginsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}

export default AppRouter;
