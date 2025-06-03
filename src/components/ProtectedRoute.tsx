import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, loading, user } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If this is an admin route but the user is not an admin
  if (isAdminRoute && user?.role !== "ADMIN") {
    return <Navigate to="/slots" replace />;
  }

  // If this is a customer route but the user is an admin (and they didn't come directly here)
  if (!isAdminRoute && user?.role === "ADMIN" && location.key === "default") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
