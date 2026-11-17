const features = [
  {
    title: "Vite",
    description: "Servidor de desarrollo rápido y build optimizado.",
  },
  {
    title: "React",
    description:
      "Componentes reutilizables para construir interfaces modernas.",
  },
  {
    title: "Tailwind",
    description: "Clases de utilidad para diseñar sin salir del JSX.",
  },
];

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20">
        <div className="mb-10 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
          React + Vite + Tailwind
        </div>

        <h1 className="max-w-4xl text-center text-5xl font-black tracking-tight md:text-7xl">
          Una demo sencilla con{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Tailwind CSS
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-center text-lg text-slate-300">
          Proyecto base preparado para empezar a crear componentes, layouts y
          páginas modernas con React.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300">
            Empezar
          </button>

          <button className="rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
            Ver documentación
          </button>
        </div>

        <div className="mt-16 grid w-full gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.06]"
            >
              <h2 className="text-2xl font-bold">{feature.title}</h2>
              <p className="mt-3 text-slate-400">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
