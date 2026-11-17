import type { AuthUser } from "../types/auth";

export function getAuthUser(): AuthUser | null {
  const data = localStorage.getItem("user");

  if (!data) return null;

  try {
    const jdata = JSON.parse(data) as AuthUser;
    if (!jdata.role) {
      localStorage.removeItem("user");
      return null;
    }
    if (jdata.role === "CLIENTE")
      jdata.nombre = jdata.nombre || jdata.correo || "fest.IO";
    if (jdata.role === "EMPRESA")
      jdata.nombre = jdata.razonSocial || jdata.correo || "fest.IO";
    if (jdata.role === "ADMIN") jdata.nombre = "Administrador";
    return jdata;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function logout() {
  localStorage.removeItem("user");
  window.location.href = "/login";
}
