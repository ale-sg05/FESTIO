import { Navigate, Outlet } from "react-router";
import { getAuthUser } from "../lib/auth";
import type { Role } from "../types/auth";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  redirectTo: string;
}

export function ProtectedRoute({
  allowedRoles,
  redirectTo,
}: ProtectedRouteProps) {
  const user = getAuthUser();

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
