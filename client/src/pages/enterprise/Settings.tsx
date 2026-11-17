import MainLayout from "@/layouts/Layout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "@/lib/api";
import { getAuthUser, logout } from "@/services/auth.service";
import InputField from "@/components/InputField";
import type { AuthUser } from "@/types/auth";

export default function EnterpriseSettings() {
  const navigate = useNavigate();
  const user = getAuthUser();

  const [formData, setFormData] = useState({
    razon_social: user?.razonSocial || "",
    cif: user?.cif || "",
    persona: "",
    telefono: "",
    correo: user?.email || "",
    domicilio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<
    typeof formData | null
  >(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    const fetchEnterpriseData = async () => {
      try {
        const result = await api.get(`/enterprise/${user?.id}`);
        const enterpriseData = result.data.data;
        setFormData({
          razon_social: enterpriseData.razon_social || "",
          cif: enterpriseData.cif || "",
          persona: enterpriseData.persona || "",
          telefono: enterpriseData.telefono || "",
          correo: enterpriseData.correo || "",
          domicilio: enterpriseData.domicilio || "",
        });
      } catch (err) {
        console.error("Error fetching enterprise data:", err);
      }
    };

    if (user?.id) {
      fetchEnterpriseData();
    }
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Show password verification modal
      setPendingFormData(formData);
      setShowPasswordModal(true);
      setPasswordInput("");
      setPasswordError(null);
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar el perfil";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleVerifyPassword = async () => {
    setPasswordError(null);
    setVerifyingPassword(true);

    try {
      if (!passwordInput) {
        setPasswordError("Por favor ingresa tu contraseña");
        setVerifyingPassword(false);
        return;
      }

      // Verificar contraseña con Sign In
      try {
        await api.post("/auth/enterprise/signin", {
          cif: user?.cif,
          password: passwordInput,
        });
        // Si el signin es exitoso, la contraseña es correcta
      } catch (signinError) {
        // Si el signin falla, la contraseña es incorrecta
        setPasswordError("La contraseña es incorrecta");
        setVerifyingPassword(false);
        return;
      }

      // Si contraseña es correcta, proceder con la actualización
      if (pendingFormData) {
        const response = await api.post("/enterprise/update", {
          id: user?.id,
          razonSocial: pendingFormData.razon_social,
          cif: pendingFormData.cif,
          persona: pendingFormData.persona,
          telefono: pendingFormData.telefono,
          correo: pendingFormData.correo,
          domicilio: pendingFormData.domicilio,
          contrasena: passwordInput,
        });

        setSuccess("Perfil actualizado exitosamente");

        // Update the user in localStorage
        const updatedUser: AuthUser = {
          ...user!,
          razonSocial: pendingFormData.razon_social,
          cif: pendingFormData.cif,
          email: pendingFormData.correo,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Cerrar modal
        setShowPasswordModal(false);
        setPasswordInput("");
        setPendingFormData(null);

        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar el perfil";
      setPasswordError(errorMessage);
    } finally {
      setVerifyingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setDeletingAccount(true);

    try {
      if (!deletePassword) {
        setDeleteError("Por favor ingresa tu contraseña para confirmar");
        setDeletingAccount(false);
        return;
      }

      // Primero verificar la contraseña haciendo un signin
      try {
        await api.post("/auth/enterprise/signin", {
          cif: user?.cif,
          password: deletePassword,
        });
        // Si el signin es exitoso, la contraseña es correcta
      } catch (signinError) {
        // Si el signin falla, la contraseña es incorrecta
        setDeleteError("La contraseña es incorrecta");
        setDeletingAccount(false);
        return;
      }

      // Si llegamos aquí, la contraseña es correcta, proceder con la eliminación
      await api.delete("/enterprise/delete", {});

      setSuccess("Empresa eliminada. Redirigiendo...");
      setTimeout(() => {
        logout();
        navigate("/enterprise/login");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar la empresa";
      setDeleteError(errorMessage);
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Configuración de Empresa
        </h1>
        <p className="text-slate-500 mb-8">
          Gestiona los datos de tu empresa y configuración de seguridad
        </p>

        {/* Edit Profile Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 32 32"
              className="w-6 h-6 text-blue-600"
            >
              <path d="M0 0h32v32H0z" fill="none" />
              <path
                fill="currentColor"
                d="M8 8h2v4H8zm0 6h2v4H8zm6-6h2v4h-2zm0 6h2v4h-2zm-6 6h2v4H8zm6 0h2v4h-2z"
              />
              <path
                fill="currentColor"
                d="M30 14a2 2 0 0 0-2-2h-6V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v26h28ZM4 4h16v24H4Zm18 24V14h6v14Z"
              />
            </svg>
            Datos de la Empresa
          </h2>

          {error && (
            <div className="mb-6 flex gap-3 rounded-lg bg-rose-200/80 px-4 py-4 text-sm text-rose-800">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-rose-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 flex gap-3 rounded-lg bg-green-200/80 px-4 py-4 text-sm text-green-800">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-green-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Razón Social"
                name="razon_social"
                type="text"
                placeholder="Nombre de tu empresa"
                value={formData.razon_social}
                onChange={handleInputChange}
                color="blue"
              />
              <InputField
                label="CIF"
                name="cif"
                type="text"
                placeholder="A12345678"
                value={formData.cif}
                onChange={handleInputChange}
                color="blue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Persona de Contacto"
                name="persona"
                type="text"
                placeholder="Nombre del contacto"
                value={formData.persona}
                onChange={handleInputChange}
                color="blue"
              />
              <InputField
                label="Teléfono"
                name="telefono"
                type="tel"
                placeholder="+34 000 000 000"
                value={formData.telefono}
                onChange={handleInputChange}
                maxLength={15}
                inputFilter={(value) => value.replace(/[^\d\s+\-()]/g, "")}
                color="blue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Correo Electrónico"
                name="correo"
                type="email"
                placeholder="empresa@email.com"
                value={formData.correo}
                onChange={handleInputChange}
                color="blue"
              />
              <InputField
                label="Domicilio"
                name="domicilio"
                type="text"
                placeholder="Calle, número, ciudad"
                value={formData.domicilio}
                onChange={handleInputChange}
                color="blue"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full  mt-6 px-8 py-3 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>

        {/* Danger Zone - Delete Account */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <g fill="currentColor">
                <path d="M12 6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1m0 10a1 1 0 1 0 0 2a1 1 0 0 0 0-2" />
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 0 16 0a8 8 0 0 0-16 0"
                  clip-rule="evenodd"
                />
              </g>
            </svg>
            Zona de Peligro
          </h2>

          <p className="text-slate-600 mb-6">
            Una vez que elimines tu empresa, no hay forma de recuperarla. Por
            favor, sé absolutamente seguro.
          </p>

          <button
            onClick={() => {
              setShowDeleteModal(true);
              setDeleteError(null);
              setDeletePassword("");
            }}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Eliminar Empresa
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                className="w-6 h-6 text-blue-600"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3m0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Verificar Contraseña
            </h3>

            <p className="text-sm text-slate-600 text-center mb-6">
              Por seguridad, ingresa tu contraseña para actualizar tu empresa
            </p>

            {passwordError && (
              <div className="mb-4 flex gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800">
                <svg
                  className="h-4 w-4 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{passwordError}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordInput("");
                  setPasswordError(null);
                  setPendingFormData(null);
                }}
                disabled={verifyingPassword}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-colors duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleVerifyPassword}
                disabled={verifyingPassword}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyingPassword ? "Verificando..." : "Verificar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7a2 2 0 012-2h.5a2 2 0 012 2v2m0 0V5a2 2 0 012 2v.5a2 2 0 012 2v10a2 2 0 01-2 2h-2.5a2 2 0 01-2-2m0 0V7"
                />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              ¿Eliminar empresa?
            </h3>

            <p className="text-sm text-slate-600 text-center mb-6">
              Esta acción no se puede deshacer. Se eliminarán todos los datos de
              tu empresa de forma permanente.
            </p>

            {deleteError && (
              <div className="mb-4 flex gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800">
                <svg
                  className="h-4 w-4 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{deleteError}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Ingresa tu contraseña para confirmar
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteError(null);
                }}
                disabled={deletingAccount}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-colors duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingAccount ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
