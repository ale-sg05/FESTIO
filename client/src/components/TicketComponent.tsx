import { useState } from "react";
import AntroposWrapper from "./AntroposWrapper";
import TicketCard from "./TicketCard";
import RechargeModal from "./RechargeModal";
import RefundModal from "./RefundModal";

export default function TicketComponent({
  ticket,
  user,
}: {
  ticket: any;
  user: any;
}) {
  const [flipped, setFlipped] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refunded, setRefunded] = useState<boolean>(ticket.estado === false);

  const beautifyDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 px-4 py-8 lg:gap-16 lg:items-start lg:pt-16 lg:pb-16 lg:px-12">

        {/* Contenedor del Ticket */}
        <div className="flex flex-col items-center gap-6 flex-shrink-0">
          <AntroposWrapper className="mt-25">
            <div id="ticket-preview-desktop">
              <TicketCard
                name={user?.nombre || ""}
                initdate={beautifyDate(ticket.festivalRef.f_inicio)}
                enddate={beautifyDate(ticket.festivalRef.f_fin)}
                festivalName={ticket.festivalRef.nombre}
                tipoAbono={ticket.tipo_abono}
                qrData={ticket.id}
                flipped={flipped}
                onFlip={() => setFlipped(!flipped)}
              />
            </div>
          </AntroposWrapper>

          {/* Botón para voltear ticket */}
          <button
            type="button"
            onClick={() => setFlipped(!flipped)}
            className="flex w-full max-w-md items-center justify-center gap-2 rounded-full border border-black/20 bg-black/40 px-4 py-2 font-mono text-xs tracking-[0.14em] text-black/80 uppercase backdrop-blur-md transition-all duration-200 hover:scale-[1.03] hover:bg-black/65 hover:text-black active:scale-95 cursor-pointer"
            aria-label="Voltear ticket"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flip-icon transition-transform duration-300"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            <span>Voltear</span>
          </button>
        </div>

        {/* Sección de Recarga */}
        {ticket.festivalRef.estado.toLowerCase() !== "cancelado" ? (
          <div className="w-full max-w-md lg:max-w-lg rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 lg:p-8 shadow-lg lg:shadow-xl lg:sticky lg:top-16 h-fit">
            <div className="flex flex-col gap-6 lg:gap-8">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900">
                  Saldo disponible
                </h3>
                <p className="text-sm lg:text-base text-slate-500 mt-2">
                  Abono: {ticket.tipo_abono}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-purple-100 p-6 lg:p-8 flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-purple-600 uppercase tracking-widest font-semibold">
                    Saldo actual
                  </p>
                  <p className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">
                    {Number(ticket.saldo || 0).toFixed(2)}{" "}
                    <span className="text-2xl lg:text-3xl text-purple-600">€</span>
                  </p>
                </div>
                <div className="text-purple-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    className="w-8 h-8 lg:w-10 lg:h-10"
                    viewBox="0 0 24 24"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <g fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path
                        stroke-linecap="round"
                        d="M12 6v12m3-8.5C15 8.12 13.657 7 12 7S9 8.12 9 9.5s1.343 2.5 3 2.5s3 1.12 3 2.5s-1.343 2.5-3 2.5s-3-1.12-3-2.5"
                      />
                    </g>
                  </svg>
                </div>
              </div>

              <button
                onClick={() => setShowRechargeModal(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 lg:py-4 rounded-xl transition-colors cursor-pointer shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 text-sm lg:text-base uppercase tracking-widest"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14"></path>
                  <path d="M5 12h14"></path>
                </svg>
                Recargar saldo
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md lg:max-w-lg rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-6 lg:p-8 shadow-lg lg:shadow-xl lg:sticky lg:top-16 h-fit">
            <div className="flex flex-col gap-4 items-center text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-600"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-red-600 mb-2">
                  Festival Cancelado
                </h3>
                <p className="text-sm lg:text-base text-red-700">
                  Este festival ha sido cancelado. No es posible recargar abonos.
                </p>
              </div>

              {refunded ? (
                <div className="w-full mt-2 bg-white border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-xs uppercase tracking-widest text-red-600 font-semibold">
                    Devolución tramitada
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Este abono ya ha sido devuelto.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRefundModal(true)}
                  className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 lg:py-4 rounded-xl transition-colors cursor-pointer shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 text-sm lg:text-base uppercase tracking-widest"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 14 4 9l5-5" />
                    <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
                  </svg>
                  Solicitar devolución
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Recarga */}
      {showRechargeModal && (
        <RechargeModal
          setOpen={setShowRechargeModal}
          abonoId={ticket.id}
          clienteId={user?.id}
          festivalId={ticket.festivalRef.id}
          tipoAbonoId={ticket.tipo_abono}
          currentBalance={Number(ticket.saldo || 0)}
        />
      )}

      {/* Modal de Devolución */}
      {showRefundModal && (
        <RefundModal
          setOpen={setShowRefundModal}
          abonoId={ticket.id}
          festivalId={ticket.festivalRef.id}
          tipoAbonoId={ticket.tipo_abono}
          festivalName={ticket.festivalRef.nombre}
          amount={Number(ticket.saldo || 0)}
          onRefunded={() => setRefunded(true)}
        />
      )}
    </>
  );
}
