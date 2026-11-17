import { useState, type Dispatch, type SetStateAction } from "react";
import { api } from "@/lib/api";
import { isAxiosError } from "axios";
import { encodeBase64 } from "@/utils";

interface RefundResponse {
  status: string;
  transactionId?: string;
  reason?: string;
  amount?: number;
  currency?: string;
  cardLast4?: string;
  timestamp?: string;
}

type Step = 1 | 2;

function StepConfirm({
  amount,
  festivalName,
  tipoAbono,
}: {
  amount: number;
  festivalName: string;
  tipoAbono: string;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
        <p className="text-sm text-red-700 leading-relaxed">
          El festival <span className="font-semibold">{festivalName}</span> ha
          sido cancelado. Puedes solicitar la devolución del importe pagado por
          tu abono.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-purple-700 text-xs uppercase tracking-widest font-semibold">
          Detalles de la devolución
        </p>

        <div className="rounded-2xl border border-purple-100 divide-y divide-purple-100">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-slate-500">Tipo de abono</span>
            <span className="text-sm font-semibold text-slate-900">
              {tipoAbono}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          El importe se reembolsará a la tarjeta usada en la compra original.
          Esta acción no se puede deshacer.
        </p>
      </div>
    </div>
  );
}

function StepResult({
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
          {success ? "¡Devolución completada!" : "Devolución fallida"}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed">
          {success
            ? "La devolución se ha procesado correctamente. El importe será reembolsado a tu tarjeta en los próximos días."
            : errorMessage ||
              "No se pudo procesar la devolución. Inténtalo de nuevo más tarde."}
        </p>
      </div>
    </div>
  );
}

export default function RefundModal({
  setOpen,
  abonoId,
  festivalId,
  tipoAbonoId,
  festivalName,
  amount,
  onRefunded,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  abonoId: string;
  festivalId: string;
  tipoAbonoId: string;
  festivalName: string;
  amount: number;
  onRefunded?: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const submitRefund = async (): Promise<void> => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = encodeBase64({
        abonoId,
        festivalId,
        tipoAbonoId,
      });

      const response = await api.post<RefundResponse>(
        "festival/payment/refund",
        { payload },
      );

      if (response.data.status !== "refunded") {
        setSuccess(false);
        setErrorMessage(
          response.data.reason || "La devolución fue rechazada por el banco.",
        );
        setStep(2);
        return;
      }

      setSuccess(true);
      setStep(2);
      onRefunded?.();
    } catch (error) {
      setSuccess(false);

      if (isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "No se pudo conectar con el servidor.",
        );
      } else {
        setErrorMessage("Error inesperado al procesar la devolución.");
      }

      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (): void => {
    setOpen(false);

    setTimeout(() => {
      setStep(1);
      setSuccess(null);
      setIsSubmitting(false);
      setErrorMessage("");
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
        <div className="px-7 pt-7 pb-6 border-b border-purple-100 bg-gradient-to-br from-white to-purple-50">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 font-bold text-lg">
              {step === 1 ? "Solicitar devolución" : "Resultado"}
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
        </div>

        <div className="px-7 py-7 bg-white">
          {step === 1 && (
            <StepConfirm
              amount={amount}
              festivalName={festivalName}
              tipoAbono={tipoAbonoId}
            />
          )}

          {step === 2 && success !== null && (
            <StepResult success={success} errorMessage={errorMessage} />
          )}
        </div>

        <div className="px-7 pb-7 bg-white">
          {errorMessage && step === 1 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          {step === 1 ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold py-4 rounded-2xl text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={submitRefund}
                disabled={isSubmitting}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-4 rounded-2xl text-sm transition-colors cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-purple-600/20"
              >
                {isSubmitting ? "Procesando..." : "Solicitar devolución"}
              </button>
            </div>
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
