import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

import api from "@/lib/api";

interface ArtistSearchResult {
  id: string;
  name: string;
  images: { url: string }[];
}

export default function AddArtistModal({
  festival,
  onArtistAdded,
  setAddArtistModalOpen,
}: {
  festival: string;
  onArtistAdded: () => Promise<void>;
  setAddArtistModalOpen: (open: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<ArtistSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [addingArtistId, setAddingArtistId] = useState<string | null>(null);

  useEffect(() => {
    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      setArtists([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setSearchLoading(true);
        setSearchError(null);

        const response = await api.get("/artist/search", {
          params: {
            query: normalizedQuery,
            limit: 8,
          },
        });

        setArtists(Array.isArray(response.data) ? response.data : []);
      } catch (requestError) {
        console.error("Error searching artists:", requestError);
        setArtists([]);
        setSearchError("No se pudieron cargar los artistas.");
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleAddArtist = async (artistId: string) => {
    try {
      setAddingArtistId(artistId);

      await api.post("/festival/artist/add", {
        festival,
        artist: artistId,
      });

      await onArtistAdded();
      setAddArtistModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Artista añadido",
        text: "El artista se añadió correctamente al festival.",
        confirmButtonText: "Aceptar",
      });
    } catch (requestError) {
      const axiosError = requestError as AxiosError<{
        error?: string | Array<{ message: string }>;
      }>;
      const errorMessage = Array.isArray(axiosError.response?.data?.error)
        ? axiosError.response?.data?.error?.[0]?.message ||
          "No se pudo añadir el artista."
        : axiosError.response?.data?.error || "No se pudo añadir el artista.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "Aceptar",
      });
    } finally {
      setAddingArtistId(null);
    }
  };

  const getArtistImage = (artist: ArtistSearchResult) => artist.images[0]?.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full rounded-2xl bg-white p-6 shadow-lg max-w-md">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Añadir artista
        </h2>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Buscar artista
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Escribe un nombre de artista"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
          </div>

          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {searchLoading && (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                Buscando artistas...
              </div>
            )}

            {searchError && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                {searchError}
              </div>
            )}

            {!searchLoading &&
              !searchError &&
              searchQuery.trim() &&
              artists.length === 0 && (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  No hay resultados para esa búsqueda.
                </div>
              )}

            {artists.map((artist) => {
              const image = getArtistImage(artist);

              return (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => handleAddArtist(artist.id)}
                  disabled={addingArtistId === artist.id}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 text-white">
                    {image ? (
                      <img
                        src={image}
                        alt={artist.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold">
                        {artist.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {artist.name}
                    </p>
                  </div>

                  <span className="text-xs font-medium text-blue-900">
                    {addingArtistId === artist.id ? "Añadiendo..." : "Añadir"}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 cursor-pointer w-full"
            onClick={() => setAddArtistModalOpen(false)}
          >
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
}
