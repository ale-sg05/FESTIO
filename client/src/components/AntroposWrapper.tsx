import { useEffect, useRef, useState } from "react";
import Atropos from "atropos";
import "atropos/css";

const BREAKPOINT = 768;

export default function AtroposWrapper({ children, className = "" }) {
  const wrapperRef = useRef(null);
  const atroposInstanceRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Función para verificar si es mobile
  const checkIsMobile = () => {
    return window.matchMedia(`(max-width: ${BREAKPOINT}px)`).matches;
  };

  // Inicializar Atropos
  const initAtropos = () => {
    if (checkIsMobile() || atroposInstanceRef.current || !wrapperRef.current)
      return;

    atroposInstanceRef.current = Atropos({
      el: wrapperRef.current,
      highlight: true,
      onRotate(rx, ry) {
        const k = 1.5 / 15;
        const clamp = (v) => Math.max(-1.5, Math.min(1.5, v));

        window.dispatchEvent(
          new CustomEvent("atropos:tilt", {
            detail: {
              x: clamp(ry * k),
              y: clamp(rx * k),
            },
          }),
        );
      },
    });
  };

  // Destruir Atropos
  const destroyAtropos = () => {
    if (atroposInstanceRef.current) {
      atroposInstanceRef.current.destroy();
      atroposInstanceRef.current = null;
    }
  };

  useEffect(() => {
    // Verificar estado inicial
    setIsMobile(checkIsMobile());

    // Inicializar Atropos si no es mobile
    if (!checkIsMobile()) {
      initAtropos();
    }

    // Listener para cambios de tamaño de pantalla
    const mq = window.matchMedia(`(max-width: ${BREAKPOINT}px)`);
    const handleChange = (e) => {
      setIsMobile(e.matches);
      if (e.matches) {
        destroyAtropos();
      } else {
        initAtropos();
      }
    };

    mq.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mq.removeEventListener("change", handleChange);
      destroyAtropos();
    };
  }, []);

  return (
    <div className={`relative z-0 w-full h-auto mx-auto ${className}`}>
      <div className="isolate h-max opacity-100">
        <div className="flex h-max items-center justify-center">
          {isMobile ? (
            // En mobile, renderizamos directamente el children
            children
          ) : (
            // En desktop, envolvemos en la estructura de Atropos
            <div
              ref={wrapperRef}
              className="atropos block w-max h-auto mx-auto shadow-2xl"
            >
              <div className="atropos-scale">
                <div className="atropos-rotate">
                  <div className="atropos-inner backdrop-blur-xl rounded-xl">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
