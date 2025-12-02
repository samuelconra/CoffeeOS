import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignupPage";
import MapPage from "../pages/MapPage";
import MainLayout from "../layouts/MainLayout";
import BeanOriginsPage from "../pages/BeanOriginsPage";

function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUpPage />} />

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
