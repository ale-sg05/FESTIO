import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen text-black flex items-center justify-center px-6 overflow-hidden relative">
      <section className="relative z-10 max-w-xl w-full text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em]">
          Página no encontrada
        </p>

        <h1 className="text-8xl font-black tracking-tight sm:text-9xl">404</h1>

        <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
          Página no encontrada
        </h2>

        <p className="mt-4 text-slate-400 leading-relaxed">
          La página que intentas visitar no existe. Vuelve al inicio para
          continuar navegando.
        </p>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-200 active:translate-y-0 cursor-pointer"
          >
            <span className="transition group-hover:-translate-x-1">←</span>
            Volver al inicio
          </button>
        </div>
      </section>
    </main>
  );
}
