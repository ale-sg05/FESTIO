import MainLayout from "@/layouts/Layout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "@/lib/api";
import { getAuthUser, logout } from "@/services/auth.service";
import InputField from "@/components/InputField";
import { validateDni } from "@/utils/";
import type { AuthUser } from "@/types/auth";

export default function ClientSettings() {
  const navigate = useNavigate();
  const user = getAuthUser();

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    dni: "",
    fecha_nacimiento: "",
  });

  const [loadingData, setLoadingData] = useState(true);
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
    const fetchUserData = async () => {
      try {
        const result = await api.post("/client/get", {});
        const userData = result.data.data;
        setFormData({
          nombre: userData.nombre || "",
          apellidos: userData.apellidos || "",
          correo: userData.correo || "",
          telefono: userData.telefono || "",
          dni: userData.dni || "",
          fecha_nacimiento: userData.fecha_nacimiento
            ? new Date(userData.fecha_nacimiento).toISOString().split("T")[0]
            : "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, []);

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
      // Validar DNI si está rellenado
      if (formData.dni) {
        const dniValidation = validateDni(formData.dni);
        if (dniValidation !== undefined) {
          setError(dniValidation || "DNI inválido");
          setLoading(false);
          return;
        }
      }

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
        await api.post("/auth/client/signin", {
          correo: user?.correo,
          contraseña: passwordInput,
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
        const response = await api.post("/client/update", {
          nombre: pendingFormData.nombre,
          apellidos: pendingFormData.apellidos,
          correo: pendingFormData.correo,
          telefono: pendingFormData.telefono,
          dni: pendingFormData.dni,
          fecha_nacimiento: pendingFormData.fecha_nacimiento,
          contraseña: passwordInput,
        });

        setSuccess("Perfil actualizado exitosamente");

        // Update the user in localStorage
        const updatedUser: AuthUser = {
          ...user!,
          ...pendingFormData,
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
        await api.post("/auth/client/signin", {
          correo: user?.correo,
          contraseña: deletePassword,
        });
        // Si el signin es exitoso, la contraseña es correcta
      } catch (signinError) {
        // Si el signin falla, la contraseña es incorrecta
        setDeleteError("La contraseña es incorrecta");
        setDeletingAccount(false);
        return;
      }

      // Si llegamos aquí, la contraseña es correcta, proceder con la eliminación
      await api.delete("/client/delete", {});

      setSuccess("Cuenta eliminada. Redirigiendo...");
      setTimeout(() => {
        logout();
        navigate("/client/login");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar la cuenta";
      setDeleteError(errorMessage);
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Configuración de Cuenta
        </h1>
        <p className="text-slate-500 mb-8">
          Gestiona tu perfil y configuración de seguridad
        </p>

        {/* Edit Profile Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              className="w-6 h-6 text-purple-600"
              viewBox="0 0 24 24"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="M11 17h2v-6h-2zm1.713-8.287Q13 8.425 13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9t.713-.288M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"
              />
            </svg>
            Información Personal
          </h2>

          {loadingData ? (
            <div className="space-y-5 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="h-16 bg-slate-100 rounded-lg" />
                <div className="h-16 bg-slate-100 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="h-16 bg-slate-100 rounded-lg" />
                <div className="h-16 bg-slate-100 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="h-16 bg-slate-100 rounded-lg" />
                <div className="h-16 bg-slate-100 rounded-lg" />
              </div>
              <div className="h-12 bg-slate-100 rounded-lg mt-6" />
            </div>
          ) : (
            <>
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
                    label="Nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    color="purple"
                  />
                  <InputField
                    label="Apellidos"
                    name="apellidos"
                    type="text"
                    placeholder="Tus apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    color="purple"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Correo Electrónico"
                    name="correo"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.correo}
                    onChange={handleInputChange}
                    color="purple"
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
                    color="purple"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="DNI"
                    name="dni"
                    type="text"
                    placeholder="00000000X"
                    value={formData.dni}
                    onChange={handleInputChange}
                    maxLength={9}
                    inputFilter={(value) =>
                      value.toUpperCase().replace(/[^0-9A-Z]/g, "")
                    }
                    color="purple"
                  />
                  <InputField
                    label="Fecha de Nacimiento"
                    name="fecha_nacimiento"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                    color="purple"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            </>
          )}
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
            Estás seguro que quieres borrar tu cuenta? Esta acción es
            irreversible y se eliminarán todos tus datos.
          </p>

          <button
            onClick={() => {
              setShowDeleteModal(true);
              setDeleteError(null);
              setDeletePassword("");
            }}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                className="w-6 h-6 text-purple-600"
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
              Por seguridad, ingresa tu contraseña para actualizar tu perfil
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
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
                className="flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              ¿Eliminar cuenta?
            </h3>

            <p className="text-sm text-slate-600 text-center mb-6">
              Esta acción no se puede deshacer. Se eliminarán todos tus datos de
              forma permanente.
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
