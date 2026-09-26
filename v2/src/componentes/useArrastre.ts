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
  const dedo = useRef<number | null>(null); // el dedo que arrastra: los demás no cuentan

  // Si dos destinos se solapan (los continentes de Pangea), gana aquel cuyo centro está más cerca.
  const destinoEn = (x: number, y: number): Destino | null => {
    let mejor: Destino | null = null;
    let distancia = Infinity;
    for (const d of Object.keys(destinos) as Destino[]) {
      const r = destinos[d].current?.getBoundingClientRect();
      if (!r || x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
      const dist = Math.hypot(x - (r.left + r.right) / 2, y - (r.top + r.bottom) / 2);
      if (dist < distancia) {
        mejor = d;
        distancia = dist;
      }
    }
    return mejor;
  };

  const soltar = (pieza: string, destino: Destino) => {
    setElegida(null);
    alSoltar(pieza, destino);
  };

  /** Props para cada pieza arrastrable. */
  const pieza = (id: string) => ({
    onPointerDown: (e: EventoPuntero<HTMLElement>) => {
      if (arrastre && dedo.current !== e.pointerId) return; // otro dedo ya está arrastrando
      dedo.current = e.pointerId;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* el dedo ya se levantó: el arrastre sigue igual, sin captura */
      }
      origen.current = { x: e.clientX, y: e.clientY };
      setArrastre({ id, dx: 0, dy: 0 });
    },
    onPointerMove: (e: EventoPuntero<HTMLElement>) => {
      if (arrastre?.id !== id || e.pointerId !== dedo.current) return;
      setArrastre({ id, dx: e.clientX - origen.current.x, dy: e.clientY - origen.current.y });
      setSobre(destinoEn(e.clientX, e.clientY));
    },
    onPointerUp: (e: EventoPuntero<HTMLElement>) => {
      if (arrastre?.id !== id || e.pointerId !== dedo.current) return;
      dedo.current = null;
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
    // El sistema se queda el dedo (una llamada, un gesto del navegador…): todo como estaba.
    onPointerCancel: (e: EventoPuntero<HTMLElement>) => {
      if (e.pointerId !== dedo.current) return;
      dedo.current = null;
      setArrastre(null);
      setSobre(null);
    },
    // Teclado o lector de pantalla (VoiceOver, TalkBack): llega un clic sin dedo (detail 0).
    // Hace lo mismo que tocar la pieza: elegirla, y luego se toca el destino.
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      if (e.detail === 0) setElegida(elegida === id ? null : id);
    },
    style:
      arrastre?.id === id ? { transform: `translate(${arrastre.dx}px, ${arrastre.dy}px) scale(1.1)`, zIndex: 10 } : undefined,
  });

  /** Tocar un destino con una pieza ya elegida. */
  const tocarDestino = (d: Destino) => {
    if (elegida) soltar(elegida, d);
  };

  return { arrastre, elegida, sobre, pieza, tocarDestino };
}
