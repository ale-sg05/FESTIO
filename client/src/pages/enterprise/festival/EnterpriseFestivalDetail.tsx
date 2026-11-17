import MainLayout from "@/layouts/Layout";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { formatDate, formatMoney } from "@/utils";
import type { FestivalDetail, FestivalArtist } from "@/types/festival";
import Swal from "sweetalert2";
import type { AxiosError } from "axios";
import axios from "axios";
import AddArtistModal from "@/components/AddArtistModal";
const EditEnterpriseModal = ({
  festival,
  setEditModalOpen,
}: {
  festival: FestivalDetail;
  setEditModalOpen: (open: boolean) => void;
}) => {
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData);

      await api.post("/festival/update", {
        id: festival.id,
        empresa: festival.empresa,
        ...data,
      });
      Swal.fire({
        icon: "success",
        title: "Festival actualizado",
        text: "El festival ha sido actualizado correctamente.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        setEditModalOpen(false);
        window.location.reload();
      });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{
        error: Array<{ message: string }>;
      }>;
      const errorMessage =
        axiosError.response?.data?.error?.[0]?.message ||
        "No se pudo actualizar el festival.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "Aceptar",
      });
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full rounded-2xl bg-white p-6 shadow-lg max-w-md">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Editar festival
        </h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              defaultValue={festival.nombre}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
            <label className="block mt-4 text-sm font-medium text-slate-700">
              Ubicación
            </label>
            <input
              type="text"
              name="ubicacion"
              defaultValue={festival.ubicacion}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
            <label className="block mt-4 text-sm font-medium text-slate-700">
              Aforo
            </label>
            <input
              type="number"
              name="aforo"
              defaultValue={festival.aforo}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
            <label className="block mt-4 text-sm font-medium text-slate-700">
              Estado
            </label>
            <select
              name="estado"
              defaultValue={festival.estado}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            >
              <option value="Activo">Activo</option>
              <option value="Cancelado">Cancelado</option>
            </select>
            <label className="block mt-4 text-sm font-medium text-slate-700">
              Descripción
            </label>
            <textarea
              name="descripcion"
              defaultValue={festival.descripcion}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
            <label className="block mt-4 text-sm font-medium text-slate-700">
              Fecha de inicio
            </label>
            <input
              type="date"
              name="f_inicio"
              defaultValue={festival.f_inicio.split("T")[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
            <label className="block mt-4 text-sm font-medium text-slate-700">
              Fecha de fin
            </label>
            <input
              type="date"
              name="f_fin"
              defaultValue={festival.f_fin.split("T")[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
          </div>
          <div className="flex flex-row gap-2">
            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 cursor-pointer w-1/4"
              onClick={() => setEditModalOpen(false)}
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 w-3/4 cursor-pointer"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddAbonoModal = ({
  festival,
  setAddAbonoModalOpen,
  onAbonoAdded,
}: {
  festival: string;
  setAddAbonoModalOpen: (open: boolean) => void;
  onAbonoAdded: () => void;
}) => {
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData);

      await api.post("/festival/ticket/add", {
        festival: festival,
        ...data,
      });
      Swal.fire({
        icon: "success",
        title: "Abono añadido",
        text: "El abono ha sido añadido correctamente.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        setAddAbonoModalOpen(false);
        onAbonoAdded();
      });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{
        error: Array<{ message: string }>;
      }>;
      const errorMessage =
        axiosError.response?.data?.error
          ?.map((err) => `${err.message}`)
          .join("\n") || "No se pudo añadir el abono.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "Aceptar",
      });
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full rounded-2xl bg-white p-6 shadow-lg max-w-md">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Añadir abono
        </h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Nombre del abono
            </label>
            <input
              type="text"
              name="nombre"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
            <label className="block mt-4 text-sm font-medium text-slate-700">
              Precio
            </label>
            <input
              type="number"
              name="precio"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
            <label className="block mt-4 text-sm font-medium text-slate-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 w-full cursor-pointer"
          >
            Añadir abono
          </button>
        </form>
        <button
          className="mt-6 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 cursor-pointer w-full"
          onClick={() => setAddAbonoModalOpen(false)}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
export default function EnterpriseFestivalDetail() {
  const { id } = useParams();
  const [festival, setFestival] = useState<FestivalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addArtistModalOpen, setAddArtistModalOpen] = useState(false);
  const [addAbonoModalOpen, setAddAbonoModalOpen] = useState(false);

  useEffect(() => {
    const loadFestival = async () => {
      if (!id) {
        setError("Festival no encontrado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/festival/${id}`);
        setFestival(response.data.data);
        console.log(response.data.data);
      } catch (requestError) {
        setError("No se pudo cargar el festival.");
        console.error("Error fetching festival detail:", requestError);
      } finally {
        setLoading(false);
      }
    };

    loadFestival();
  }, [id]);

  const loadFestival = async () => {
    if (!id) {
      return;
    }

    try {
      const response = await api.get(`/festival/${id}`);
      setFestival(response.data.data);
    } catch (requestError) {
      console.error("Error refreshing festival detail:", requestError);
    }
  };
  const cancelFestival = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción cancelará el festival y no podrá ser revertida.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No, mantener",
      });

      if (result.isConfirmed) {
        await api.post("/festival/cancel", { id: festival?.id });
        await Swal.fire({
          icon: "success",
          title: "Festival cancelado",
          text: "El festival ha sido cancelado correctamente.",
          confirmButtonText: "Aceptar",
        });
        loadFestival();
      }
    } catch (error) {
      console.error("Error canceling festival:", error);

      const message = axios.isAxiosError(error)
        ? (error.response?.data?.error ?? "Error desconocido")
        : error instanceof Error
          ? error.message
          : "Error desconocido";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se pudo cancelar el festival. ${message}`,
        confirmButtonText: "Aceptar",
      });
    }
  };
  return (
    <MainLayout>
      <section className="min-h-screen w-full p-6 md:p-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Detalle del festival</p>
              <h1 className="text-3xl font-bold text-slate-900">
                {festival?.nombre}
              </h1>
            </div>

            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 cursor-pointer"
              onClick={cancelFestival}
            >
              Cancelar
            </button>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-8 text-sm text-slate-500 shadow-sm">
              Cargando festival...
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-sm text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {festival && (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
              {editModalOpen && (
                <EditEnterpriseModal
                  festival={festival}
                  setEditModalOpen={setEditModalOpen}
                />
              )}
              {addArtistModalOpen && (
                <AddArtistModal
                  festival={festival.id}
                  onArtistAdded={loadFestival}
                  setAddArtistModalOpen={setAddArtistModalOpen}
                />
              )}
              {addAbonoModalOpen && (
                <AddAbonoModal
                  festival={festival.id}
                  setAddAbonoModalOpen={setAddAbonoModalOpen}
                  onAbonoAdded={loadFestival}
                />
              )}
              <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-end justify-end gap-3">
                  <button
                    className="rounded-md bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700 cursor-pointer"
                    onClick={() => setEditModalOpen(true)}
                  >
                    Editar
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Ubicación
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {festival.ubicacion}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Aforo
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {festival.aforo.toLocaleString("es-ES")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Inicio
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {formatDate(festival.f_inicio)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Fin
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {formatDate(festival.f_fin)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Descripción
                  </p>
                  <p className="mt-2 leading-7 text-slate-700">
                    {festival.descripcion}
                  </p>
                </div>
              </div>

              <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Empresa
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {festival.empresa}
                    </p>
                  </div>
                  <button
                    className="rounded-md bg-blue-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700 cursor-pointer"
                    onClick={() => setAddArtistModalOpen(true)}
                  >
                    Añadir Artista
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Artistas
                  </p>

                  <div className="mt-3 space-y-3">
                    {festival.actuaciones.length === 0 ? (
                      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                        Todavía no hay artistas asignados.
                      </div>
                    ) : (
                      festival.actuaciones.map((artist: FestivalArtist) => (
                        <div
                          key={artist.id}
                          className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"
                        >
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                            {artist.imagen ? (
                              <img
                                src={artist.imagen}
                                alt={artist.nombre}
                                className="h-full w-full rounded-2xl object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold">
                                {artist.nombre.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {artist.nombre}
                            </p>
                            <p className="text-xs text-slate-500">Artista</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </aside>
              <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm w-full">
                <div className="flex items-start justify-between gap-3">
                  <div></div>
                  <button
                    className="rounded-md bg-blue-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700 cursor-pointer"
                    onClick={() => setAddAbonoModalOpen(true)}
                  >
                    Añadir Abono
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Abonos
                  </p>

                  <div className="mt-3 space-y-3">
                    {festival.tiposAbono.length === 0 ? (
                      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                        Todavía no hay abonos disponibles.
                      </div>
                    ) : (
                      festival.tiposAbono.map((tipo) => (
                        <div
                          key={tipo.id}
                          className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 hover:bg-slate-100 transition cursor-crosshair"
                        >
                          <div>
                            <p className="font-medium text-slate-900">
                              {tipo.nombre} - {formatMoney(tipo.precio)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
