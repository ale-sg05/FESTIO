import { useState } from "react";
import { useNavigate } from "react-router";
import { signInEnterprise } from "@/services/auth.service";
import ColorBackground from "@/components/ColorBackground";

export default function EnterpriseSignIn() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const cif = formData.get("cif") as string;
      const password = formData.get("password") as string;

      const result = await signInEnterprise(cif, password);

      if (!result) {
        setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
        return;
      }

      navigate("/enterprise/");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.";

      setError(
        errorMessage ||
          "Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.",
      );
      return;
    }
  }

  return (
    <ColorBackground>
      <div className="flex flex-col items-center justify-center">
        <header className="relative z-10 flex justify-center pt-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-purple-600">
            fest.io
          </h1>
        </header>

        <section className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <div className="relative w-full max-w-98 overflow-hidden rounded-3xl border border-white/60 bg-white/55 px-8 py-9 shadow-2xl shadow-purple-950/10 backdrop-blur-xl">
            <div className="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-purple-600 to-violet-400" />

            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                Bienvenido de nuevo
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                Ingresa tus credenciales para acceder al backstage.
              </p>
            </div>

            {error && (
              <div className="mt-7 flex gap-3 rounded-md bg-rose-200/80 px-4 py-4 text-sm text-rose-800 justify-center items-center">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-rose-700"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m12.866 3l9.526 16.5a1 1 0 0 1-.866 1.5H2.474a1 1 0 0 1-.866-1.5L11.134 3a1 1 0 0 1 1.732 0m-8.66 16h15.588L12 5.5zM11 16h2v2h-2zm0-7h2v5h-2z"
                  ></path>
                </svg>

                <p className="text-sm text-rose-800 justify-center items-center">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="cif"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  CIF
                </label>

                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  >
                    <path
                      fill="currentColor"
                      d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zM20 8l-7.475 4.675q-.125.075-.262.113t-.263.037t-.262-.037t-.263-.113L4 8v10h16zm-8 3l8-5H4zM4 8v.25v-1.475v.025V6v.8v-.012V8.25zv10z"
                    />
                  </svg>

                  <input
                    id="cif"
                    name="cif"
                    type="text"
                    placeholder="CIF"
                    className="h-11 w-full rounded-md border border-blue-200/60 bg-blue-100/80 pl-12 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Contraseña
                  </label>
                  {/* TODO:
                <a
                  href="#"
                  className="text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  ¿Olvidaste tu contraseña?
                </a> */}
                </div>

                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                  >
                    <path
                      fill="currentColor"
                      d="M12 17a2 2 0 0 1-2-2c0-1.11.89-2 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m6 3V10H6v10zm0-12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.11.89-2 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
                    ></path>
                  </svg>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-md border border-blue-200/60 bg-blue-100/80 pl-12 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-purple-600"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.8 11.8 0 0 1-4 5.19l-1.42-1.43A9.86 9.86 0 0 0 20.82 12A9.82 9.82 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.82 9.82 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                        >
                          <path d="M3 13c3.6-8 14.4-8 18 0"></path>
                          <path
                            fill="currentColor"
                            d="M12 17a3 3 0 1 1 0-6a3 3 0 0 1 0 6"
                          ></path>
                        </g>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-7 h-12 w-full rounded-full bg-linear-to-r from-purple-600 to-blue-700 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] cursor-pointer"
              >
                Iniciar Sesión
              </button>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
              <p>
                ¿No tienes cuenta?{" "}
                <a
                  href="/enterprise/register"
                  className="font-bold text-blue-600"
                >
                  Regístrate
                </a>
              </p>

              <p className="mt-4">
                ¿Eres un cliente?{" "}
                <a href="/client/login" className="font-bold text-purple-600">
                  Entra aquí
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </ColorBackground>
  );
}
