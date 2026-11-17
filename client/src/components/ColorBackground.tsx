import type { ReactNode } from "react";

interface ColorBackgroundProps {
  children: ReactNode;
}

export default function ColorBackground({ children }: ColorBackgroundProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-purple-200 via-pink-50 to-blue-200 px-4 py-6">
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-purple-300/40 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
      <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />

      <div className="relative z-10 flex min-h-[calc(100vh-3rem)] items-center justify-center">
        {children}
      </div>
    </main>
  );
}
