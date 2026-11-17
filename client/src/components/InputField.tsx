import type { ChangeEventHandler, ReactNode } from "react";
import ErrorMessage from "@/components/ErrorMessage";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  icon?: ReactNode;
  placeholder?: string;
  error?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  color?: ColorScheme;
  value?: string;
  maxLength?: number;
  inputFilter?: (value: string) => string;
}

type ColorScheme = "purple" | "blue";

const COLORS = {
  purple: {
    text: "text-[#33264a]",
    bg: "bg-[#eed7ff]",
    ring: "focus-within:ring-purple-500",
  },
  blue: {
    text: "text-[#1e3a8a]",
    bg: "bg-[#dbeafe]",
    ring: "focus-within:ring-blue-500",
  },
};

export default function InputField({
  label,
  name,
  type = "text",
  icon,
  placeholder,
  error,
  onChange,
  className = "",
  color = "purple",
  value,
  maxLength,
  inputFilter,
}: InputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Aplicar filtro personalizado si existe
    if (inputFilter) {
      newValue = inputFilter(newValue);
    }

    // Limitar longitud si está definida
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }

    // Crear un evento modificado
    e.target.value = newValue;

    // Llamar al onChange original con el evento modificado
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={className}>
      <label className="block">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className={`block text-xs font-semibold ${COLORS[color].text}`}
          >
            {label}
          </span>
          {maxLength && value && (
            <span className="text-xs text-slate-400">
              {String(value).length}/{maxLength}
            </span>
          )}
        </div>

        <div
          className={`flex h-11 items-center gap-3 rounded-xl px-3 ${COLORS[color].text} transition ${
            error
              ? "bg-pink-50 ring-1 ring-pink-500"
              : `${COLORS[color].bg} ${COLORS[color].ring}`
          }`}
        >
          {icon && <span className="shrink-0">{icon}</span>}

          <input
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            value={value}
            maxLength={maxLength}
            className={`w-full bg-transparent text-xs outline-none ${
              color === "purple"
                ? "placeholder:text-[#33264a]"
                : "placeholder:text-[#1e3a8a]"
            }`}
          />
        </div>
      </label>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
}
