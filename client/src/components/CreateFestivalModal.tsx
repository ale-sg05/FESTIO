import { useNavigate } from "react-router";
import { api } from "@/lib/api";
import Swal from "sweetalert2";

export default function CreateFestivalModal({
  setCreateFestivalModal,
  user,
}: {
  setCreateFestivalModal: (open: boolean) => void;
  user: any;
}) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user.cif) {
      return;
    }
    const formData = new FormData(e.currentTarget);
    const data = {
      id: crypto.randomUUID(),
      nombre: formData.get("nombre") as string,
      ubicacion: formData.get("ubicacion") as string,
      aforo: Number(formData.get("aforo")),
      imagen: formData.get("imagen") as string,
      f_inicio: formData.get("f_inicio") as string,
      f_fin: formData.get("f_fin") as string,
      descripcion: formData.get("descripcion") as string,
      empresa: user.id as string,
      estado: "Activo",
    };
    api
      .post("/festival/add", data)
      .then(() => {
        setCreateFestivalModal(false);
        Swal.fire({
          icon: "success",
          title: "Festival creado",
          text: "El festival ha sido creado correctamente",
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al crear el festival",
          text: error.response?.data?.message || "Ha ocurrido un error",
        });
      });
  };
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full rounded-2xl bg-white p-6 shadow-lg max-w-md">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Añadir festival
        </h2>
        <form className="mb-4 flex flex-col gap-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="nombre"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Nombre del festival
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              placeholder="Introduce el nombre del festival"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="ubicacion"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Ubicación
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              required
              placeholder="Introduce la ubicación del festival"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="aforo"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Aforo
            </label>
            <input
              type="number"
              id="aforo"
              name="aforo"
              required
              min={1}
              placeholder="Introduce el aforo del festival"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="imagen"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Imagen
            </label>
            <input
              type="text"
              id="imagen"
              name="imagen"
              placeholder="Introduce la URL de la imagen del festival"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
          </div>
          <div className="flex flex-row items-center justify-center">
            <div className="w-1/2">
              <label
                htmlFor="f_inicio"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Fecha de inicio
              </label>
              <input
                type="date"
                id="f_inicio"
                name="f_inicio"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="f_fin"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Fecha de fin
              </label>
              <input
                type="date"
                id="f_fin"
                name="f_fin"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  w-1/2focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="descripcion"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              required
              placeholder="Introduce una descripción para el festival"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 sm:text-sm"
            />
          </div>
          <button
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 w-full cursor-pointer"
            type="submit"
          >
            Añadir festival
          </button>
        </form>
        <div className="flex flex-col gap-3">
          <button
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition cursor-pointer hover:bg-gray-800 w-full"
            onClick={() => setCreateFestivalModal(false)}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
