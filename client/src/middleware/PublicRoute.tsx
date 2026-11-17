import { Navigate, Outlet } from "react-router";
import type { Role } from "@/types/auth";

const dashboardByRole: Record<Role, string> = {
  ADMIN: "/admin/",
  EMPRESA: "/enterprise/",
  CLIENTE: "/client/",
};

function getStoredUserRole(): Role | null {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return null;
  }

  try {
    const user = JSON.parse(userData) as { role?: Role };

    if (
      user.role === "ADMIN" ||
      user.role === "EMPRESA" ||
      user.role === "CLIENTE"
    ) {
      return user.role;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
}

export function PublicRoute() {
  const role = getStoredUserRole();

  if (!role) {
    return <Outlet />;
  }

  return <Navigate to={dashboardByRole[role]} replace />;
}
