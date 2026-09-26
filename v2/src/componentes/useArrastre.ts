import { useRef, useState, type PointerEvent as EventoPuntero } from "react";

// Arrastrar piezas con el dedo o, para quien no sepa arrastrar, tocar la pieza y luego el
// destino. Cada juego dice qué destinos hay (referencias a sus elementos) y qué pasa al soltar.

export interface EstadoArrastre {
  id: string;
  dx: number;
  dy: number;
}

export function useArrastre<Destino extends string>(
  destinos: Record<Destino, React.RefObject<HTMLElement | null>>,
  alSoltar: (pieza: string, destino: Destino) => void,
) {
  const [arrastre, setArrastre] = useState<EstadoArrastre | null>(null);
  const [elegida, setElegida] = useState<string | null>(null);
  const [sobre, setSobre] = useState<Destino | null>(null);
  const origen = useRef({ x: 0, y: 0 });

  const destinoEn = (x: number, y: number): Destino | null => {
    for (const d of Object.keys(destinos) as Destino[]) {
      const r = destinos[d].current?.getBoundingClientRect();
      if (r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return d;
    }
    return null;
  };

  const soltar = (pieza: string, destino: Destino) => {
    setElegida(null);
    alSoltar(pieza, destino);
  };

  /** Props para cada pieza arrastrable. */
  const pieza = (id: string) => ({
    onPointerDown: (e: EventoPuntero<HTMLElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      origen.current = { x: e.clientX, y: e.clientY };
      setArrastre({ id, dx: 0, dy: 0 });
    },
    onPointerMove: (e: EventoPuntero<HTMLElement>) => {
      if (arrastre?.id !== id) return;
      setArrastre({ id, dx: e.clientX - origen.current.x, dy: e.clientY - origen.current.y });
      setSobre(destinoEn(e.clientX, e.clientY));
    },
    onPointerUp: (e: EventoPuntero<HTMLElement>) => {
      if (arrastre?.id !== id) return;
      const movido = Math.hypot(arrastre.dx, arrastre.dy) >= 10;
      setArrastre(null);
      setSobre(null);
      if (!movido) {
        setElegida(elegida === id ? null : id);
        return;
      }
      const d = destinoEn(e.clientX, e.clientY);
      if (d) soltar(id, d);
    },
    onPointerCancel: () => setArrastre(null),
    style:
      arrastre?.id === id ? { transform: `translate(${arrastre.dx}px, ${arrastre.dy}px) scale(1.1)`, zIndex: 10 } : undefined,
  });

  /** Tocar un destino con una pieza ya elegida. */
  const tocarDestino = (d: Destino) => {
    if (elegida) soltar(elegida, d);
  };

  return { arrastre, elegida, sobre, pieza, tocarDestino };
}
