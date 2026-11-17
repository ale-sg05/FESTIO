import MainLayout from "@/layouts/Layout";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { FestivalDetail } from "@/types/festival";
import { formatDate } from "@/utils";
import PaymentModal from "@/components/PaymentModal";

export default function ClientFestivalDetail() {
  const { id } = useParams();
  const [festival, setFestival] = useState<FestivalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAbono, setSelectedAbono] = useState<{
    nombre: string;
    precio: number;
  } | null>(null);
  const isCanceled = festival?.estado?.toLowerCase().includes("cancel");

  const buyTicket = (abono: { nombre: string; precio: number }) => {
    if (isCanceled) {
      return;
    }
    setSelectedAbono(abono);
    setShowPaymentModal(true);
  };
  useEffect(() => {
    const fetchFestival = async () => {
      try {
        const response = await api.get(`/festival/${id}`);
        setFestival(response.data.data);
      } catch (error) {
        console.error("Error fetching festivals:", error);
        setError("No se pudo cargar el festival.");
      } finally {
        setLoading(false);
      }
    };

    fetchFestival();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen ">
          <p className="text-sm text-slate-500">Cargando festival...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !festival) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen ">
          <p className="text-sm text-red-500">
            {error ?? "Festival no encontrado."}
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="min-h-screen relative">
        {showPaymentModal && selectedAbono && (
          <PaymentModal
            setOpen={setShowPaymentModal}
            price={selectedAbono.precio}
            festivalId={festival.id}
            abono={selectedAbono.nombre}
          />
        )}
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={festival.imagen || "/placeholder-festival.jpg"}
            alt={festival.nombre}
            className={`w-full h-full object-cover brightness-50 ${
              isCanceled ? "grayscale" : ""
            }`}
          />

          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10 bg-linear-to-t from-black/70 to-transparent">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {festival.nombre}
            </h1>
            {isCanceled && (
              <span className="mt-2 inline-flex rounded-full bg-red-400/45 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
                Cancelado
              </span>
            )}
            <div className="flex gap-5 mt-2">
              <div className="flex items-center gap-1.5 text-white/90 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {festival.ubicacion}
              </div>
              <div className="flex items-center gap-1.5 text-white/90 text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M16 2v4M8 2v4M3 10h18"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {formatDate(festival.f_inicio)} - {formatDate(festival.f_fin)}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="bg-purple-400 rounded-2xl p-4">
              <p className="text-sm font-bold text-white mb-2">Description</p>
              <p className="text-xs text-white leading-relaxed">
                {festival.descripcion}
              </p>
            </div>

            <div className="bg-purple-600 rounded-2xl p-4">
              <p className="text-sm font-bold text-white text-center mb-3">
                Abonos
              </p>
              {isCanceled && (
                <p className="mb-3 text-center text-xs font-medium text-white/80">
                  Este festival está cancelado y no permite compras.
                </p>
              )}
              <div className="flex flex-col gap-2">
                {festival.tiposAbono.map((tipo) => (
                  <button
                    onClick={() => buyTicket(tipo)}
                    key={tipo.nombre}
                    disabled={isCanceled}
                    className={`flex items-center justify-between border-b border-white/20 pb-2 last:border-0 last:pb-0 rounded-lg px-3 py-1 transition ${
                      isCanceled
                        ? "cursor-not-allowed bg-white/10 text-white/60 opacity-70"
                        : "cursor-pointer hover:bg-purple-700/50"
                    }`}
                  >
                    <span className="text-white text-sm">{tipo.nombre}</span>
                    <span className=" text-white text-xs font-bold px-3 py-1 rounded-lg">
                      {tipo.precio}€
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1e1b4b] mb-3">Lineup</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {festival.actuaciones.map((artista) => (
                <div
                  key={artista.id}
                  className="flex flex-col items-center gap-2 bg-white rounded-2xl p-3"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200">
                    <img
                      src={artista.imagen || "/placeholder-artist.jpg"}
                      alt={artista.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-[#1e1b4b]">
                    {artista.nombre}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
