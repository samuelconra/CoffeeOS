import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <h1>Cargando...</h1>; // Puedes poner un Spinner aquí

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;