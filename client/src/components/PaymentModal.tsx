import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type FocusEvent,
  type SetStateAction,
} from "react";
import { api } from "@/lib/api";
import { isAxiosError } from "axios";
import { encodeBase64 } from "@/utils";

type Step = 1 | 2 | 3;

interface PaymentForm {
  holder: string;
  number: string;
  expiry: string;
  cvv: string;
}

type PaymentFormErrors = Partial<Record<keyof PaymentForm, string>>;
type PaymentFormTouched = Partial<Record<keyof PaymentForm, boolean>>;

interface FieldProps {
  label: string;
  name: keyof PaymentForm;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  error?: string;
  maxLength?: number;
  half?: boolean;
}

interface PaymentResponse {
  status: string;
  transactionId?: string;
  reason?: string;
  amount?: number;
  currency?: string;
  cardLast4?: string;
  cardHolder?: string;
  timestamp?: string;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

function formatCvv(value: string): string {
  return value.replace(/\D/g, "").slice(0, 3);
}

function getOnlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function isValidLuhn(cardNumber: string): boolean {
  return true;
  const digits = getOnlyDigits(cardNumber);

  if (digits.length !== 16) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);

    if (shouldDouble) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function isValidExpiry(expiry: string): boolean {
  const digits = getOnlyDigits(expiry);

  if (digits.length !== 4) {
    return false;
  }

  const month = Number(digits.slice(0, 2));
  const year = Number(`20${digits.slice(2, 4)}`);

  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear) {
    return false;
  }

  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
}

function validatePaymentForm(form: PaymentForm): PaymentFormErrors {
  const errors: PaymentFormErrors = {};

  const holder = form.holder.trim();
  const cardDigits = getOnlyDigits(form.number);
  const expiryDigits = getOnlyDigits(form.expiry);
  const cvvDigits = getOnlyDigits(form.cvv);

  if (!holder) {
    errors.holder = "El titular de la tarjeta es obligatorio.";
  } else if (holder.length < 3) {
    errors.holder = "El titular debe tener al menos 3 caracteres.";
  } else if (!/^[a-zA-ZÀ-ÿ\s'.-]+$/.test(holder)) {
    errors.holder = "El titular solo puede contener letras y espacios.";
  }

  if (!cardDigits) {
    errors.number = "El número de tarjeta es obligatorio.";
  } else if (cardDigits.length !== 16) {
    errors.number = "El número de tarjeta debe tener 16 dígitos.";
  } else if (!isValidLuhn(form.number)) {
    errors.number = "El número de tarjeta no es válido.";
  }

  if (!expiryDigits) {
    errors.expiry = "La caducidad es obligatoria.";
  } else if (expiryDigits.length !== 4) {
    errors.expiry = "La caducidad debe tener formato MM / AA.";
  } else if (!isValidExpiry(form.expiry)) {
    errors.expiry = "La fecha de caducidad no es válida.";
  }

  if (!cvvDigits) {
    errors.cvv = "El CVV es obligatorio.";
  } else if (cvvDigits.length !== 3) {
    errors.cvv = "El CVV debe tener 3 dígitos.";
  }

  return errors;
}

function Field({
  label,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  maxLength,
  half,
}: FieldProps) {
  return (
    <div className={half ? "flex-1" : "w-full"}>
      <label className="block text-purple-700 text-xs uppercase tracking-widest mb-2 font-semibold">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none transition-colors text-sm shadow-sm ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        }`}
      />

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function StepTickets({
  quantity,
  setQuantity,
  price,
}: {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  price: number;
}) {
  const total = (quantity * price).toFixed(2);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-1">
        <p className="text-purple-700 text-sm uppercase tracking-widest font-semibold">
          Precio por entrada
        </p>

        <p className="text-5xl font-bold text-slate-900">
          {price} <span className="text-2xl text-purple-500">€</span>
        </p>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-12 h-12 rounded-full border border-purple-300 text-purple-700 text-2xl font-light flex items-center justify-center hover:bg-purple-50 hover:border-purple-500 transition-colors cursor-pointer"
        >
          -
        </button>

        <span className="text-5xl font-bold text-slate-900 w-12 text-center">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(10, q + 1))}
          className="w-12 h-12 rounded-full border border-purple-300 text-purple-700 text-2xl font-light flex items-center justify-center hover:bg-purple-50 hover:border-purple-500 transition-colors cursor-pointer"
        >
          +
        </button>
      </div>

      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-purple-500 text-sm">
            {quantity} entrada{quantity !== 1 ? "s" : ""}
          </p>
          <p className="text-slate-900 font-semibold">Total a pagar</p>
        </div>

        <p className="text-3xl font-bold text-purple-700">{total} €</p>
      </div>
    </div>
  );
}

function StepPayment({
  form,
  setForm,
  errors,
  touched,
  setTouched,
}: {
  form: PaymentForm;
  setForm: Dispatch<SetStateAction<PaymentForm>>;
  errors: PaymentFormErrors;
  touched: PaymentFormTouched;
  setTouched: Dispatch<SetStateAction<PaymentFormTouched>>;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof PaymentForm;

    let newValue = value;

    if (fieldName === "holder") {
      newValue = value;
    }

    if (fieldName === "number") {
      newValue = formatCardNumber(value);
    }

    if (fieldName === "expiry") {
      newValue = formatExpiry(value);
    }

    if (fieldName === "cvv") {
      newValue = formatCvv(value);
    }

    setForm((previousForm) => ({
      ...previousForm,
      [fieldName]: newValue,
    }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const fieldName = e.target.name as keyof PaymentForm;

    setTouched((previousTouched) => ({
      ...previousTouched,
      [fieldName]: true,
    }));
  };

  return (
    <div className="space-y-4">
      <Field
        label="Titular de la tarjeta"
        name="holder"
        value={form.holder}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.holder ? errors.holder : undefined}
        placeholder="María García López"
      />

      <Field
        label="Número de la tarjeta"
        name="number"
        value={form.number}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.number ? errors.number : undefined}
        placeholder="0000 0000 0000 0000"
        maxLength={19}
      />

      <div className="flex gap-4">
        <Field
          label="Caducidad"
          name="expiry"
          value={form.expiry}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.expiry ? errors.expiry : undefined}
          placeholder="MM / AA"
          maxLength={7}
          half
        />

        <Field
          label="CVV"
          name="cvv"
          value={form.cvv}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.cvv ? errors.cvv : undefined}
          placeholder="···"
          maxLength={3}
          half
        />
      </div>
    </div>
  );
}

function StepConfirmation({
  success,
  errorMessage,
}: {
  success: boolean;
  errorMessage?: string;
}) {
  return (
    <div className="text-center space-y-5 py-4">
      <div
        className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl ${
          success ? "bg-purple-100 text-purple-700" : "bg-red-100 text-red-500"
        }`}
      >
        {success ? "✓" : "✕"}
      </div>

      <div className="space-y-2">
        <h3
          className={`text-2xl font-bold ${
            success ? "text-purple-700" : "text-red-500"
          }`}
        >
          {success ? "¡Pago completado!" : "Pago fallido"}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed">
          {success
            ? "El pago ha sido procesado exitosamente."
            : errorMessage ||
              "No se pudo procesar el pago. Comprueba los datos de tu tarjeta e inténtalo de nuevo."}
        </p>
      </div>
    </div>
  );
}

export default function PaymentModal({
  setOpen,
  price,
  festivalId,
  abono,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  price: number;
  festivalId: string;
  abono: string;
}) {
  const [step, setStep] = useState<Step>(1);
  const [quantity, setQuantity] = useState<number>(1);

  const [form, setForm] = useState<PaymentForm>({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const [touched, setTouched] = useState<PaymentFormTouched>({});
  const [success, setSuccess] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [paymentError, setPaymentError] = useState<string>("");

  const steps: string[] = ["Entradas", "Pago", "Confirmación"];

  const errors = validatePaymentForm(form);
  const isPaymentFormValid = Object.keys(errors).length === 0;

  const markAllFieldsAsTouched = () => {
    setTouched({
      holder: true,
      number: true,
      expiry: true,
      cvv: true,
    });
  };

  const buildPaymentPayload = () => {
    return {
      cardHolder: form.holder.trim(),
      cardNumber: getOnlyDigits(form.number),
      expiryDate: form.expiry.replace(/\s/g, ""),
      cvv: form.cvv,
      tickets: quantity,
      festival: festivalId,
      abono: abono,
    };
  };

  const submitPayment = async (): Promise<void> => {
    setIsSubmitting(true);
    setPaymentError("");

    try {
      const payload = encodeBase64(buildPaymentPayload());

      const response = await api.post<PaymentResponse>("festival/payment/buy", {
        payload,
      });

      if (response.data.status !== "approved") {
        setSuccess(false);
        setPaymentError(response.data.reason || "El pago fue rechazado.");
        setStep(3);
        return;
      }

      setSuccess(true);
      setStep(3);
    } catch (error) {
      setSuccess(false);

      if (isAxiosError(error)) {
        setPaymentError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "No se pudo conectar con el servidor.",
        );
      } else {
        setPaymentError("Error inesperado al procesar el pago.");
      }

      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async (): Promise<void> => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2 && !isPaymentFormValid) {
      markAllFieldsAsTouched();
      return;
    }

    if (step === 2) {
      await submitPayment();
    }
  };

  const handleClose = (): void => {
    setOpen(false);

    setTimeout(() => {
      setStep(1);
      setQuantity(1);
      setForm({
        holder: "",
        number: "",
        expiry: "",
        cvv: "",
      });
      setTouched({});
      setSuccess(null);
      setIsSubmitting(false);
      setPaymentError("");
    }, 300);
  };

  const canProceed: boolean =
    step === 1 ? quantity > 0 : step === 2 ? isPaymentFormValid : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        <div className="px-7 pt-7 pb-6 border-b border-purple-100 bg-gradient-to-br from-white to-purple-50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-slate-900 font-bold text-lg">
              Proceso de compra
            </h2>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-purple-400 hover:text-purple-700 transition-colors text-xl leading-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center">
            {steps.map((label, i) => {
              const num = (i + 1) as Step;
              const active = step === num;
              const done = step > num;

              return (
                <div
                  key={num}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        done
                          ? "bg-purple-600 text-white"
                          : active
                            ? "bg-purple-100 text-purple-700 ring-2 ring-purple-500"
                            : "bg-purple-50 text-purple-300"
                      }`}
                    >
                      {done ? "✓" : num}
                    </div>

                    <span
                      className={`text-xs whitespace-nowrap ${
                        active
                          ? "text-purple-700 font-semibold"
                          : "text-slate-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-2 mb-4 transition-colors ${
                        done ? "bg-purple-500" : "bg-purple-100"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-7 py-7 bg-white">
          {step === 1 && (
            <StepTickets
              quantity={quantity}
              setQuantity={setQuantity}
              price={price}
            />
          )}

          {step === 2 && (
            <StepPayment
              form={form}
              setForm={setForm}
              errors={errors}
              touched={touched}
              setTouched={setTouched}
            />
          )}

          {step === 3 && success !== null && (
            <StepConfirmation success={success} errorMessage={paymentError} />
          )}
        </div>

        <div className="px-7 pb-7 bg-white">
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-100 disabled:text-purple-300 text-white font-bold py-4 rounded-2xl text-sm transition-colors cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-purple-600/20"
            >
              {isSubmitting
                ? "Procesando pago..."
                : step === 2
                  ? `Pagar ${(quantity * price).toFixed(2)} €`
                  : "Continuar →"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl text-sm transition-colors cursor-pointer shadow-lg shadow-purple-600/20"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
