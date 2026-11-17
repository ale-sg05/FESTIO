import { useState, useEffect } from "react";
import { QRCode } from "react-qr-code";

export default function TicketCard({
  name,
  initdate,
  enddate,
  festivalName,
  tipoAbono,
  qrData,
  flipped: externalFlipped,
  onFlip,
}) {
  const [internalFlipped, setInternalFlipped] = useState(false);

  // Usa el estado externo si se proporciona, sino usa el interno
  const flipped =
    externalFlipped !== undefined ? externalFlipped : internalFlipped;

  const handleFlip = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

  return (
    <div
      className="[perspective:1200px] cursor-pointer select-none"
      onClick={handleFlip}
    >
      <div
        className="relative w-[420px] h-[630px] [transform-style:preserve-3d] transition-transform duration-[650ms] ease-[cubic-bezier(0.4,0.2,0.2,1)]"
        style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
      >
        <TicketFace>
          <header className="p-5 relative z-10">
            <h3 className="font-mono text-3xl font-medium leading-snug bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 max-w-[16ch]">
              {name}
            </h3>
            <p className="font-mono text-6xl font-semibold bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent tabular-nums">
              {festivalName}
            </p>
          </header>
          <footer className="justify-center items-center mt-auto p-5 border-t border-purple-400/20 relative z-10 text-center flex flex-col gap-2">
            <span className="font-mono text-sm tracking-widest text-yellow-600 uppercase">
              {tipoAbono}
            </span>
            <time className="font-mono text-xs tracking-wider text-blue-300/70">
              {initdate} - {enddate}
            </time>
          </footer>
        </TicketFace>

        <TicketFace back>
          <div className="flex flex-col items-center justify-center h-full gap-3 relative z-10">
            <QRCode
              className="w-60 h-60 rounded-lg bg-white p-2"
              value={qrData}
            />
          </div>
        </TicketFace>
      </div>
    </div>
  );
}

function TicketFace({ children, back = false }) {
  return (
    <div
      className={[
        "absolute inset-0 rounded-2xl border border-purple-500/50 p-2",
        "bg-gradient-to-br from-[#1a0f2e] via-[#0f1a3d] to-[#1a0f3d]",
        "[backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
        "[mask-image:radial-gradient(white,black)]",
        back ? "[transform:rotateY(180deg)]" : "",
      ].join(" ")}
    >
      <div className="h-full rounded-xl border border-blue-400/20 bg-gradient-to-b from-white/5 to-transparent flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 font-black text-[80px] text-purple-400/25 flex items-center justify-center pointer-events-none font-mono select-none">
          fest.IO
        </div>
        {children}
      </div>
    </div>
  );
}
