import {useAuth} from "./AuthContext.tsx";
import {Navigate} from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    console.log('ProtectedRoute check:', { isAuthenticated, isAdmin, adminOnly });

    if (!isAuthenticated) {
        console.log('Redirecting to login');
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin) {
        console.log('Redirecting to home (not admin)');
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};