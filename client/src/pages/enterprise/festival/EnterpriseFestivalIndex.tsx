import MainLayout from "@/layouts/Layout";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { getAuthUser } from "@/lib/auth";
import type { Enterprise } from "@/types/enterprise";
import { useNavigate } from "react-router";
import { formatDate, formatMoney } from "@/utils";
import CreateFestivalModal from "@/components/CreateFestivalModal";

export default function EnterpriseFestivalIndex() {
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openCreateFestivalModal, setCreateFestivalModal] = useState(false);

  useEffect(() => {
    const user = getAuthUser();

    if (!user) {
      console.error("No authenticated user found.");
      setLoading(false);
      return;
    }

    const fetchFestivals = async () => {
      try {
        const response = await api.get(`/enterprise/${user.id}`);
        setEnterprise(response.data.data);
      } catch (error) {
        console.error("Error fetching festivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivals();
  }, []);

  const filteredFestivals = useMemo(() => {
    if (!enterprise) return [];

    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return enterprise.festivales;
    }

    return enterprise.festivales.filter((festival) => {
      return (
        festival.nombre.toLowerCase().includes(normalizedSearch) ||
        festival.empresa.toLowerCase().includes(normalizedSearch) ||
        enterprise.correo.toLowerCase().includes(normalizedSearch) ||
        enterprise.cif.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [enterprise, search]);

  const navigate = useNavigate();
  const user = getAuthUser();

  return (
    <MainLayout>
      <section className="min-h-screen w-full p-10">
        {openCreateFestivalModal && (
          <CreateFestivalModal
            setCreateFestivalModal={setCreateFestivalModal}
            user={user}
          />
        )}
        <div className="flex min-h-screen w-full flex-col space-y-1">
          <div className="rounded-xl bg-indigo-50/50 p-5 flex justify-between">
            <div className="flex max-w-lg items-center gap-3 rounded-md bg-white px-4 py-3 shadow-sm w-full">
              <svg
                className="h-5 w-5 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M7 12h10M10 18h4"
                />
              </svg>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filtrar por nombre, CIF o email..."
                className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 cursor-pointer"
              onClick={() => setCreateFestivalModal(true)}
            >
              Añadir festival
            </button>
          </div>

          <div className="overflow-hidden rounded-b-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                    <th className="w-16 px-3 py-5"></th>
                    <th className="px-4 py-5">Festival</th>
                    <th className="px-4 py-5">Aforo</th>
                    <th className="px-4 py-5">Fechas</th>
                    <th className="px-4 py-5">Ventas</th>
                    <th className="px-4 py-5 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-8 py-12 text-center text-sm text-slate-500"
                      >
                        Cargando festivales...
                      </td>
                    </tr>
                  )}

                  {!loading && filteredFestivals.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-8 py-12 text-center text-sm text-slate-500"
                      >
                        No hay festivales que coincidan con el filtro.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    filteredFestivals.map((festival) => {
                      return (
                        <tr
                          key={festival.id}
                          className="border-t border-slate-100 bg-white text-sm text-slate-600 transition hover:bg-slate-50/60"
                        >
                          <td className="px-3 py-7">
                            <div className="flex h-12 w-12 items-center justify-center rounded-r-md bg-indigo-50">
                              <svg
                                className="h-6 w-6 text-slate-300"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4 21h16M6 21V5a1 1 0 011-1h10a1 1 0 011 1v16M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2"
                                />
                              </svg>
                            </div>
                          </td>

                          <td className="px-4 py-7">
                            <p className="font-bold text-slate-800">
                              {festival.nombre}
                            </p>
                          </td>

                          <td className="px-4 py-7 font-medium">
                            {" "}
                            {/*TODO: Cambiar 0 por entradas_vendidas */}
                            {(0).toLocaleString("es-ES")}/
                            {festival.aforo.toLocaleString("es-ES")}
                          </td>

                          <td className="px-4 py-7 font-medium">
                            {formatDate(festival.f_inicio)} -{" "}
                            {formatDate(festival.f_fin)}
                          </td>

                          <td className="px-4 py-7 font-medium">
                            {/* {formatMoney(item.ventas)} */}
                            {formatMoney(0)}
                          </td>

                          <td className="px-4 py-7">
                            <div className="flex justify-center">
                              <button
                                className="cursor-pointer"
                                onClick={() =>
                                  navigate(
                                    `/enterprise/festivals/${festival.id}`,
                                  )
                                }
                              >
                                <svg
                                  className="h-5 w-5 text-slate-400 transition hover:text-teal-700"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.651-1.65a1.875 1.875 0 112.652 2.651L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
