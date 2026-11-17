import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import ColorBackground from "@/components/ColorBackground";
import InputField from "@/components/InputField";
import ErrorMessage from "@/components/ErrorMessage";
import PasswordCheck from "@/components/PasswordCheck";
import type { EnterpriseSignUpFormErrors } from "@/types/enterprise";
import {
  validateCif,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
  validateRazonSocial,
} from "@/utils";
import { signUpEnterprise } from "@/services/auth.service";
import Swal from "sweetalert2";

export default function EnterpriseSignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string>("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    razonSocial: "",
    email: "",
    cif: "",
    phone: "",
    location: "",
    personName: "",
  });
  const [errors, setErrors] = useState<EnterpriseSignUpFormErrors>({});

  const passwordRules = {
    minLength: password.length >= 8,
    number: /\d/.test(password),
    uppercase: /[A-ZÁÉÍÓÚÜÑ]/.test(password),
    special: /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]/.test(password),
  };

  function handleFieldChange(
    field: keyof EnterpriseSignUpFormErrors,
    validator: (value: string) => string | undefined,
  ) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;

      setFormData((current) => ({
        ...current,
        [field]: value,
      }));

      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validator(value),
      }));
    };
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;

    setPassword(value);
    setErrors((currentErrors) => ({
      ...currentErrors,
      password: validatePassword(value),
    }));
  }

  const validateLocation = (value: string) => {
    if (!value.trim()) {
      return "El domicilio social es obligatorio";
    }
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const newErrors: EnterpriseSignUpFormErrors = {};

    const razonSocial = validateRazonSocial(formData.razonSocial);
    const email = validateEmail(formData.email);
    const cif = validateCif(formData.cif);
    const phone = validatePhone(formData.phone);
    const personName = validateName(formData.personName);
    const passwordError = validatePassword(password);
    const locationError = validateLocation(formData.location);

    if (razonSocial) newErrors.razonSocial = razonSocial;
    if (email) newErrors.email = email;
    if (cif) newErrors.cif = cif;
    if (phone) newErrors.phone = phone;
    if (personName) newErrors.personName = personName;
    if (passwordError) newErrors.password = passwordError;
    if (locationError) newErrors.location = locationError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await signUpEnterprise(
        formData.cif,
        formData.personName,
        formData.email,
        formData.phone,
        formData.razonSocial,
        formData.location,
        password,
      );

      Swal.fire({
        icon: "success",
        title: "Cuenta creada",
        text: "Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.",
        confirmButtonText: "Ir a Iniciar Sesión",
      }).then(() => {
        navigate("/enterprise/login");
      });
    } catch (error: unknown) {
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text:
          error instanceof Error
            ? error.message
            : "Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <ColorBackground>
      <section className="w-full max-w-120 rounded-3xl bg-linear-to-r from-purple-500 via-fuchsia-300 to-cyan-300 p-1 shadow-2xl shadow-purple-900/10">
        <div className="rounded-[22px] bg-white px-8 py-8">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold text-blue-700">fest.io</h1>

            <h2 className="mt-1.5 text-2xl font-extrabold text-blue-950/85">
              Únete a la fiesta
            </h2>

            <p className="mt-3 text-xs text-blue-900/65">
              Crea tu cuenta para empezar a crecer tú negocio.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <InputField
              color="blue"
              label="Razón Social"
              name="razonSocial"
              placeholder="Festival Internacional de Benicàssim"
              error={errors.razonSocial}
              onChange={handleFieldChange("razonSocial", validateName)}
              icon={
                <svg
                  className="h-5 w-5 text-blue-900/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                  />
                </svg>
              }
            />{" "}
            <InputField
              color="blue"
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email}
              onChange={handleFieldChange("email", validateEmail)}
              icon={
                <svg
                  className="h-5 w-5 text-blue-900/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6.75h18v10.5H3V6.75z"
                  />
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7l9 6 9-6"
                  />
                </svg>
              }
            />
            <div className="grid gap-4 grid-cols-2">
              <InputField
                color="blue"
                label="CIF"
                name="cif"
                placeholder="B12345678"
                error={errors.cif}
                onChange={handleFieldChange("cif", validateCif)}
                icon={
                  <svg
                    className="h-5 w-5 text-blue-900/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16v12H4z"
                    />
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      d="M8 10h.01M8 14h4M14 10h3M14 14h3"
                    />
                  </svg>
                }
              />

              <InputField
                color="blue"
                label="Número de teléfono"
                name="phone"
                placeholder="+34 600 000 000"
                error={errors.phone}
                onChange={handleFieldChange("phone", validatePhone)}
                icon={
                  <svg
                    className="h-5 w-5 text-blue-900/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5.5C3 4.67 3.67 4 4.5 4h2.1c.66 0 1.24.43 1.43 1.06l.7 2.34a1.5 1.5 0 01-.38 1.5l-1.1 1.1a12 12 0 005.75 5.75l1.1-1.1a1.5 1.5 0 011.5-.38l2.34.7c.63.19 1.06.77 1.06 1.43v2.1c0 .83-.67 1.5-1.5 1.5H17C9.27 20 3 13.73 3 6V5.5z"
                    />
                  </svg>
                }
              />
            </div>
            <InputField
              label="Domicilio Social"
              name="location"
              placeholder="Calle Principal, 123"
              error={errors.location}
              color="blue"
              onChange={handleFieldChange("location", validateLocation)}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-blue-900/50"
                >
                  <g fill="none">
                    <path
                      d="M12 2a8 8 0 0 1 8 8c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 0 1 8-8m0 5a3 3 0 1 0 0 6a3 3 0 0 0 0-6"
                      clip-rule="evenodd"
                    />
                    <path
                      stroke="currentColor"
                      stroke-width="2"
                      d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 1 1 16 0Z"
                    />
                    <path
                      stroke="currentColor"
                      stroke-width="2"
                      d="M15 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"
                    />
                  </g>
                </svg>
              }
            />
            <InputField
              color="blue"
              label="Persona Responsable"
              name="personName"
              placeholder="John Doe"
              error={errors.personName}
              onChange={handleFieldChange("personName", validateName)}
              icon={
                <svg
                  className="h-5 w-5 text-blue-900/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                  />
                </svg>
              }
            />
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-[#33264a]">
                Contraseña
              </span>

              <div
                className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[#33264a] transition ${
                  errors.password
                    ? "bg-pink-50 ring-1 ring-pink-500"
                    : "bg-[#dbeafe] focus-within:ring-1 focus-within:ring-blue-500"
                }`}
              >
                <svg
                  className="h-5 w-5 text-blue-900/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 10V8a5 5 0 0110 0v2M6 10h12v10H6z"
                  />
                </svg>

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Crea una contraseña segura"
                  className="w-full bg-transparent text-xs outline-none placeholder:text-blue-900/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-md p-1 transition hover:bg-blue-900/10"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-blue-900/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"
                      />
                      <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-blue-900/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58M9.88 5.25A10.3 10.3 0 0112 5c6.5 0 10 7 10 7a16.3 16.3 0 01-3.08 4.16M6.1 6.1C3.45 7.89 2 12 2 12s3.5 7 10 7a10.9 10.9 0 004.1-.78"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <PasswordCheck
                  checked={passwordRules.minLength}
                  text="Mínimo 8 caracteres"
                />
                <PasswordCheck
                  checked={passwordRules.number}
                  text="Un número"
                />
                <PasswordCheck
                  checked={passwordRules.uppercase}
                  text="Una mayúscula"
                />
                <PasswordCheck
                  checked={passwordRules.special}
                  text="Un símbolo especial"
                />
              </div>

              {errors.password && (
                <ErrorMessage>{errors.password}</ErrorMessage>
              )}
            </div>
            {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
            <button
              type="submit"
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-purple-700 to-purple-500 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition hover:scale-[1.01] hover:shadow-purple-500/40 active:scale-[0.99]"
            >
              Crear Cuenta
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M13 5l7 7-7 7"
                />
              </svg>
            </button>
          </form>
          <p className="mt-6 text-center text-xs font-semibold text-blue-950/85">
            ¿Ya tienes cuenta?{" "}
            <a
              href="/enterprise/login"
              className="font-bold text-blue-700 transition hover:text-blue-900 hover:underline"
            >
              Iniciar Sesión
            </a>
          </p>
        </div>
      </section>
    </ColorBackground>
  );
}
