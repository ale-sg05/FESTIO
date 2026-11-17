import { useState, type ChangeEvent, type FormEvent } from "react";
import ColorBackground from "@/components/ColorBackground";
import {
  isAdult,
  validateName,
  validateBirthDate,
  isValidDate,
  validateEmail,
  validateDni,
  validatePhone,
  validatePassword,
} from "@/utils";
import type { ClientSignUpFormErrors } from "@/types/client";

import InputField from "@/components/InputField";
import ErrorMessage from "@/components/ErrorMessage";
import PasswordCheck from "@/components/PasswordCheck";

import { signUpClient } from "@/services/auth.service";
import Swal from "sweetalert2";

export default function ClientSignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<ClientSignUpFormErrors>({});

  const isMinor =
    birthDate !== "" && isValidDate(birthDate) && !isAdult(birthDate);

  const passwordRules = {
    minLength: password.length >= 8,
    number: /\d/.test(password),
    uppercase: /[A-ZÁÉÍÓÚÜÑ]/.test(password),
    special: /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9]/.test(password),
  };

  function handleFieldChange(
    field: keyof ClientSignUpFormErrors,
    validator: (value: string) => string | undefined,
  ) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;

      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: validator(value),
      }));
    };
  }

  function handleBirthDateChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;

    setBirthDate(value);
    setErrors((currentErrors) => ({
      ...currentErrors,
      birthDate: validateBirthDate(value),
    }));
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;

    setPassword(value);
    setErrors((currentErrors) => ({
      ...currentErrors,
      password: validatePassword(value),
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const surname = String(formData.get("surname") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const dni = String(formData.get("dni") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    const newErrors: ClientSignUpFormErrors = {};

    newErrors.name = validateName(name);
    newErrors.surname = validateName(surname);
    newErrors.email = validateEmail(email);
    newErrors.dni = validateDni(dni);
    newErrors.phone = validatePhone(phone);
    newErrors.birthDate = validateBirthDate(birthDate);
    newErrors.password = validatePassword(password);

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    const payload = {
      name,
      surname,
      email,
      dni: dni.toUpperCase(),
      phone,
      birthDate,
      password,
    };

    try {
      await signUpClient(
        payload.name,
        payload.surname,
        payload.phone,
        payload.dni,
        payload.email,
        payload.password,
        payload.birthDate,
      );

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
        confirmButtonText: "Ir a Iniciar Sesión",
      }).then(() => {
        window.location.href = "/client/login";
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text:
          error instanceof Error
            ? error.message
            : "Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.",
      });
    }
  }

  return (
    <ColorBackground>
      <section className="w-full max-w-120 rounded-3xl bg-linear-to-r from-purple-500 via-fuchsia-300 to-cyan-300 p-1 shadow-2xl shadow-purple-900/10">
        <div className="rounded-[22px] bg-white px-8 py-8">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-extrabold text-purple-700">fest.io</h1>

            <h2 className="mt-1.5 text-2xl font-extrabold text-[#33264a]">
              Únete a la fiesta
            </h2>

            <p className="mt-3 text-xs text-purple-900/65">
              Crea tu cuenta para gestionar tus entradas y descubrir eventos.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nombre"
                name="name"
                placeholder="John"
                error={errors.name}
                onChange={handleFieldChange("name", validateName)}
                icon={
                  <svg
                    className="h-5 w-5 text-purple-900/50"
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
                label="Apellidos"
                name="surname"
                placeholder="Doe"
                error={errors.surname}
                onChange={handleFieldChange("surname", validateName)}
                icon={
                  <svg
                    className="h-5 w-5 text-purple-900/50"
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
            </div>
            <InputField
              label="Correo electrónico"
              name="email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email}
              onChange={handleFieldChange("email", validateEmail)}
              icon={
                <svg
                  className="h-5 w-5 text-purple-900/50"
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
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="DNI"
                name="dni"
                placeholder="00000000X"
                error={errors.dni}
                onChange={handleFieldChange("dni", validateDni)}
                icon={
                  <svg
                    className="h-5 w-5 text-purple-900/50"
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
                label="Número de teléfono"
                name="phone"
                placeholder="+34 600 000 000"
                error={errors.phone}
                onChange={handleFieldChange("phone", validatePhone)}
                icon={
                  <svg
                    className="h-5 w-5 text-purple-900/50"
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
            <div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#33264a]">
                  Fecha de nacimiento
                </span>

                <div
                  className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[#33264a] transition ${
                    errors.birthDate || isMinor
                      ? "bg-pink-50 ring-1 ring-pink-500"
                      : "bg-[#eed7ff] focus-within:ring-1 focus-within:ring-purple-500"
                  }`}
                >
                  <svg
                    className="h-5 w-5 text-purple-900/50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 011 1v14H4V6a1 1 0 011-1z"
                    />
                  </svg>

                  <input
                    name="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={handleBirthDateChange}
                    className="w-full bg-transparent text-xs text-purple-900/70 outline-none"
                  />
                </div>
              </label>

              {isMinor && (
                <ErrorMessage>
                  Debes ser mayor de edad para registrarte.
                </ErrorMessage>
              )}

              {!isMinor && errors.birthDate && (
                <ErrorMessage>{errors.birthDate}</ErrorMessage>
              )}
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-[#33264a]">
                Contraseña
              </span>

              <div
                className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[#33264a] transition ${
                  errors.password
                    ? "bg-pink-50 ring-1 ring-pink-500"
                    : "bg-[#eed7ff] focus-within:ring-1 focus-within:ring-purple-500"
                }`}
              >
                <svg
                  className="h-5 w-5 text-purple-900/50"
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
                  className="w-full bg-transparent text-xs outline-none placeholder:text-purple-900/30"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-md p-1 transition hover:bg-purple-900/10"
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-purple-900/50"
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
                      className="h-5 w-5 text-purple-900/50"
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

          <p className="mt-6 text-center text-xs font-semibold text-[#33264a]">
            ¿Ya tienes cuenta?{" "}
            <a
              href="/client/login"
              className="font-bold text-purple-700 transition hover:text-purple-900"
            >
              Iniciar Sesión
            </a>
          </p>
        </div>
      </section>
    </ColorBackground>
  );
}
