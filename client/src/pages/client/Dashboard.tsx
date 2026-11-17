import MainLayout from "@/layouts/Layout";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { FestivalDetail } from "@/types/festival";

const AbonoItem = ({
  tipo,
  abono,
  index,
}: {
  tipo: string;
  abono: {
    id: string;
    saldo: number;
  };
  index: number;
}) => {
  const [isAbonoOpen, setIsAbonoOpen] = useState(false);
  return (
    <button
      key={abono.id}
      className={`block w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 ${isAbonoOpen ? "bg-purple-50" : "bg-white"}`}
      onClick={(event) => {
        event.stopPropagation();
        setIsAbonoOpen(!isAbonoOpen);
      }}
    >
      {tipo} #{index + 1}
      {isAbonoOpen && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`/client/ticket/${abono.id}`}
            className="group inline-flex  sm:w-auto items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-purple-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              className="transition-transform duration-200 group-hover:scale-110"
            >
              <path
                fill="currentColor"
                d="M3 4.5v5c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5h-5C3.67 3 3 3.67 3 4.5M5 5h4v4H5zM3 19.5c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5h-5c-.83 0-1.5.67-1.5 1.5zM5 15h4v4H5zM19.5 3h-5c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5M19 9h-4V5h4zm-6 4h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm2 2h2v2h-2zm-4 0h2v2h-2zm2-6h2v2h-2zm2 2h2v2h-2z"
              />
            </svg>

            <span>Ver detalles</span>
          </a>
        </div>
      )}
    </button>
  );
};

const FestivalItem = ({ festival }: { festival: FestivalDetail }) => {
  const [open, setOpen] = useState(false);
  const isCanceled = festival.estado?.toLowerCase().includes("cancel");

  const groupedAbonos = festival.abonos?.reduce(
    (acc, abono) => {
      const key = abono.tipo_abono;
      if (!acc[key]) acc[key] = [];
      acc[key].push(abono);
      return acc;
    },
    {} as Record<string, { id: string; saldo: number }[]>,
  );

  return (
    <button
      key={festival.id}
      onClick={() => setOpen(!open)}
      className={`group overflow-hidden rounded-3xl transition hover:-translate-y-1 cursor-pointer ${
        isCanceled ? "bg-slate-100 opacity-80" : "bg-white"
      }`}
    >
      <div className="h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={festival.imagen || "/fest-background.webp"}
          alt={festival.nombre}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            isCanceled ? "grayscale opacity-70" : ""
          }`}
        />
      </div>

      <div className="p-5">
        <h2
          className={`line-clamp-1 text-xl font-bold transition ${
            isCanceled
              ? "text-slate-500 group-hover:text-slate-600"
              : "text-slate-900 group-hover:text-purple-600"
          }`}
        >
          {festival.nombre}
        </h2>

        <p
          className={`mt-3 line-clamp-3 text-sm leading-6 ${
            isCanceled ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {festival.descripcion}
        </p>

        {open && (
          <div
            className={`mt-4 text-sm ${
              isCanceled ? "text-slate-500" : "text-slate-700"
            }`}
          >
            {Object.entries(groupedAbonos ?? {}).map(([tipo, abonos]) =>
              abonos.map((abono, index) => (
                <AbonoItem
                  key={`${tipo}-${index}`}
                  tipo={tipo}
                  abono={abono}
                  index={index}
                />
              )),
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export default function ClientDashboard() {
  const [festivals, setFestivals] = useState<FestivalDetail[]>([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await api.get("/client/festivals");

        setFestivals(response.data.data);
      } catch (error) {
        console.error("Error fetching festivals:", error);
      }
    };

    fetchFestivals();
  }, []);

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold">Mis festivales</h2>
      <div className=" py-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {festivals.map((festival) => (
          <FestivalItem key={festival.id} festival={festival} />
        ))}
      </div>
    </MainLayout>
  );
}
