import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/layout/ProtectedRoute';

import LoginPage from '../pages/LoginPage'; 
import MapPage from '../pages/MapPage';
import MainLayout from '../layouts/MainLayout';

function AppRouter() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" /> : <LoginPage />} 
      />
      
      <Route path="/" element={
        <ProtectedRoute>
            <MainLayout />
        </ProtectedRoute>
      }>
          <Route index element={<div>Listado de Cafeterías</div>} />
          <Route path="map" element={<MapPage />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}

export default AppRouter;