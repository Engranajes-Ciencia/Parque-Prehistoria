import { useEffect, useRef, useState, type PointerEvent as EventoPuntero } from "react";

// Arrastrar piezas con el dedo o, para quien no sepa arrastrar, tocar la pieza y luego el
// destino. Cada juego dice qué destinos hay (referencias a sus elementos) y qué pasa al soltar.

export interface EstadoArrastre {
  id: string;
  dx: number;
  dy: number;
}

/**
 * `encaja(pieza, destino)`, opcional: si bajo el dedo hay varios destinos y en alguno encaja
 * la pieza (su sitio y libre), gana ese. En los puzles las sombras se solapan y, sin esto, una
 * sombra vecina ya ocupada se quedaba la pieza soltada sobre la suya (la escalera de la
 * casa fallaba en una cuarta parte de su propia sombra; revisión del 27-sep).
 */
export function useArrastre<Destino extends string>(
  destinos: Record<Destino, React.RefObject<HTMLElement | null>>,
  alSoltar: (pieza: string, destino: Destino) => void,
  encaja?: (pieza: string, destino: Destino) => boolean,
) {
  const [arrastre, setArrastre] = useState<EstadoArrastre | null>(null);
  const [elegida, setElegida] = useState<string | null>(null);
  const [sobre, setSobre] = useState<Destino | null>(null);
  const origen = useRef({ x: 0, y: 0, scroll: 0, tope: 0 });
  const dedo = useRef<number | null>(null); // el dedo que arrastra: los demás no cuentan
  const enVuelo = useRef<{ id: string; x: number; y: number } | null>(null); // pieza y dedo, al instante
  const bucle = useRef<number | undefined>(undefined);

  // Si dos destinos se solapan (los continentes de Pangea), gana primero aquel en el que la
  // pieza encaja y, entre iguales, el de centro más cercano.
  const destinoEn = (x: number, y: number, piezaId?: string): Destino | null => {
    const bajo: { d: Destino; dist: number; bueno: boolean }[] = [];
    for (const d of Object.keys(destinos) as Destino[]) {
      const r = destinos[d].current?.getBoundingClientRect();
      if (!r || x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
      const dist = Math.hypot(x - (r.left + r.right) / 2, y - (r.top + r.bottom) / 2);
      bajo.push({ d, dist, bueno: !!(piezaId && encaja?.(piezaId, d)) });
    }
    bajo.sort((a, b) => Number(b.bueno) - Number(a.bueno) || a.dist - b.dist);
    return bajo[0]?.d ?? null;
  };

  // La pieza sigue al dedo. Si la página se ha desplazado, su sitio en la página se ha movido
  // con ella: se descuenta para que no se separe del dedo.
  const mover = (id: string, x: number, y: number) => {
    setArrastre({ id, dx: x - origen.current.x, dy: y - origen.current.y + (window.scrollY - origen.current.scroll) });
    setSobre(destinoEn(x, y, id));
  };

  // Desplazamiento automático: arrastrando cerca del borde de arriba o de abajo, la página se
  // mueve sola (también con el dedo quieto), para llegar a destinos que no caben en pantalla.
  // Solo tras un arrastre de verdad y en la dirección en que va el dedo: un toque en una pieza
  // pegada al borde no debe mover nada (medido el 27-sep a 360×600: en cuatro juegos había
  // piezas o destinos a medias por debajo de la pantalla).
  const desplazar = () => {
    const v = enVuelo.current;
    if (!v) {
      bucle.current = undefined;
      return;
    }
    const margen = 72;
    const arriba = 56 + margen; // la barra de arriba tapa sus 56 px
    // Tope medido al empezar: la pieza arrastrada alarga la página y, sin tope, bajar la
    // desplazaba más, lo que alargaba más la página… (probado: se iba 1.449 px abajo).
    const baja = v.y > innerHeight - margen && v.y > origen.current.y + 12 && window.scrollY < origen.current.tope;
    const sube = v.y < arriba && v.y < origen.current.y - 12;
    const fuerza = baja ? (v.y - (innerHeight - margen)) / margen : sube ? -(arriba - v.y) / margen : 0;
    if (fuerza) {
      const antes = window.scrollY;
      const paso = Math.round(Math.max(-1.5, Math.min(1.5, fuerza)) * 14);
      window.scrollTo(0, Math.min(origen.current.tope, Math.max(0, antes + paso)));
      if (window.scrollY !== antes) mover(v.id, v.x, v.y);
    }
    bucle.current = requestAnimationFrame(desplazar);
  };
  const aterrizar = () => {
    enVuelo.current = null;
    if (bucle.current !== undefined) cancelAnimationFrame(bucle.current);
    bucle.current = undefined;
  };
  useEffect(() => aterrizar, []);

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
      const tope = document.documentElement.scrollHeight - innerHeight;
      origen.current = { x: e.clientX, y: e.clientY, scroll: window.scrollY, tope };
      setArrastre({ id, dx: 0, dy: 0 });
      enVuelo.current = { id, x: e.clientX, y: e.clientY };
      if (bucle.current === undefined) bucle.current = requestAnimationFrame(desplazar);
    },
    onPointerMove: (e: EventoPuntero<HTMLElement>) => {
      if (arrastre?.id !== id || e.pointerId !== dedo.current) return;
      enVuelo.current = { id, x: e.clientX, y: e.clientY };
      mover(id, e.clientX, e.clientY);
    },
    onPointerUp: (e: EventoPuntero<HTMLElement>) => {
      if (arrastre?.id !== id || e.pointerId !== dedo.current) return;
      dedo.current = null;
      aterrizar();
      const movido = Math.hypot(arrastre.dx, arrastre.dy) >= 10;
      setArrastre(null);
      setSobre(null);
      if (!movido) {
        setElegida(elegida === id ? null : id);
        return;
      }
      const d = destinoEn(e.clientX, e.clientY, id);
      if (d) soltar(id, d);
    },
    // El sistema se queda el dedo (una llamada, un gesto del navegador…): todo como estaba.
    onPointerCancel: (e: EventoPuntero<HTMLElement>) => {
      if (e.pointerId !== dedo.current) return;
      dedo.current = null;
      aterrizar();
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
