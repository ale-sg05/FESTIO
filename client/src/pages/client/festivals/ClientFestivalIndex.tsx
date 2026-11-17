import MainLayout from "@/layouts/Layout";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { FestivalDetail } from "@/types/festival";

export default function ClientFestivalIndex() {
  const [festivals, setFestivals] = useState<FestivalDetail[]>([]);
  const [filteredFestivals, setFilteredFestivals] = useState<FestivalDetail[]>(
    [],
  );

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await api.get("/festival");

        setFestivals(response.data.data);
        setFilteredFestivals(response.data.data);
      } catch (error) {
        console.error("Error fetching festivals:", error);
      }
    };

    fetchFestivals();
  }, []);

  const handleSearch = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();

    setFilteredFestivals(
      festivals.filter((festival) =>
        festival.nombre.toLowerCase().includes(normalizedQuery),
      ),
    );
  };

  const isCanceledFestival = (estado: string) =>
    estado.toLowerCase() === "cancelado";

  return (
    <MainLayout>
      <section className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Festivales disponibles
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Consulta los festivales publicados y accede al detalle para ver
              más información.
            </p>

            <div className="mt-6 w-full max-w-md">
              <input
                type="text"
                placeholder="Buscar festivales..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredFestivals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-slate-800">
                No se encontraron festivales
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Prueba con otro nombre o revisa la búsqueda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredFestivals.map((festival) => (
                <a
                  key={festival.id}
                  href={`/client/festivals/${festival.id}`}
                  className={`group overflow-hidden rounded-3xl bg-white transition hover:-translate-y-1 ${
                    isCanceledFestival(festival.estado)
                      ? "bg-slate-100 opacity-80 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <div className="h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={festival.imagen || "/fest-background.webp"}
                      alt={festival.nombre}
                      className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                        isCanceledFestival(festival.estado)
                          ? "grayscale opacity-70"
                          : ""
                      }`}
                    />
                  </div>

                  <div className="p-5">
                    <h2
                      className={`line-clamp-1 text-xl font-bold transition ${
                        isCanceledFestival(festival.estado)
                          ? "text-slate-500 group-hover:text-slate-600"
                          : "text-slate-900 group-hover:text-purple-600"
                      }`}
                    >
                      {festival.nombre}
                    </h2>

                    <p
                      className={`mt-3 line-clamp-3 text-sm leading-6 ${
                        isCanceledFestival(festival.estado)
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {festival.descripcion}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
