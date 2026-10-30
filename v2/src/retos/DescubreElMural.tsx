import { useRef, useState, type MouseEvent } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Foto real del mural del parque (foto 48). Zonas en porcentaje de la imagen, medidas sobre ella.
interface Rect {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface Hallazgo extends Rect {
  id: string;
  nombre: string;
  etiqueta: string;
  /** Más sitios donde está lo mismo (dos pastores en dos rincones del mural). */
  otras?: Rect[];
}

const HALLAZGOS: Hallazgo[] = [
  { id: "carro", nombre: "El carro", etiqueta: "Al encontrar el carro", x0: 5, x1: 30, y0: 4, y1: 72 },
  { id: "bailan", nombre: "Los que bailan", etiqueta: "Al encontrar a los que bailan", x0: 31, x1: 45, y0: 22, y1: 66 },
  { id: "ganado", nombre: "El ganado", etiqueta: "Al encontrar el ganado", x0: 66, x1: 85, y0: 20, y1: 96 },
  { id: "barcos", nombre: "Los barcos", etiqueta: "Al encontrar los barcos", x0: 85, x1: 100, y0: 28, y1: 82 },
];

const sitios = (h: Hallazgo): Rect[] => [h, ...(h.otras ?? [])];
const area = (r: Rect) => (r.x1 - r.x0) * (r.y1 - r.y0);

/** El juego del mural con la lista de cosas que se le dé: la de peques y la de mayores. */
export function Mural({ parada, hallazgos, titulo }: { parada: ContenidoParada; hallazgos: Hallazgo[]; titulo: string }) {
  const [frases] = useState(() => ({
    inicio: dichoDelReto(parada.guion, parada.id, "Al empezar"),
    final: dichoDelReto(parada.guion, parada.id, "Al terminar"),
    hallazgo: Object.fromEntries(hallazgos.map((h) => [h.id, dichoDelReto(parada.guion, parada.id, h.etiqueta)])),
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [encontrados, setEncontrados] = useState<string[]>([]);
  const hallados = useRef<string[]>([]); // al instante: dos toques seguidos no deben pisarse
  const [fallo, setFallo] = useState<{ x: number; y: number } | null>(null);

  const tocar = (e: MouseEvent<HTMLImageElement>) => {
    if (acabado) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    // Si dos zonas se solapan, gana la más pequeña: es el detalle más concreto.
    const h = hallazgos
      .flatMap((h) => sitios(h).map((z) => ({ h, z })))
      .filter(({ z }) => x >= z.x0 && x <= z.x1 && y >= z.y0 && y <= z.y1)
      .sort((a, b) => area(a.z) - area(b.z))[0]?.h;
    if (!h) {
      setFallo({ x, y });
      setTimeout(() => setFallo(null), 600);
      return;
    }
    if (hallados.current.includes(h.id)) return decir(frases.hallazgo[h.id]);
    const nuevos = [...hallados.current, h.id];
    hallados.current = nuevos;
    setEncontrados(nuevos);
    if (nuevos.length === hallazgos.length) {
      terminar(frases.hallazgo[h.id], frases.final);
    } else {
      decir(frases.hallazgo[h.id]);
    }
  };

  return (
    <MarcoReto parada={parada.id} titulo={titulo} mensaje={mensaje} decir={decir} final={final} pose="senala">
      <div className="mural-lista">
        {hallazgos.map((h) => (
          <span key={h.id} className={encontrados.includes(h.id) ? "hecho" : ""}>
            {encontrados.includes(h.id) ? "✔" : "?"} {h.nombre}
          </span>
        ))}
      </div>
      <div className="mural-marco">
        <div className="mural">
          <img src="img/p19/mural.webp" alt="El mural del parque" draggable={false} onClick={tocar} />
          {hallazgos
            .filter((h) => encontrados.includes(h.id))
            .flatMap((h) => sitios(h).map((z, i) => ({ z, clave: `${h.id}-${i}` })))
            .map(({ z, clave }) => (
              <span
                key={clave}
                className="mural-hallado"
                style={{ left: `${z.x0}%`, top: `${z.y0}%`, width: `${z.x1 - z.x0}%`, height: `${z.y1 - z.y0}%` }}
              />
            ))}
          {fallo && <span className="mural-fallo" style={{ left: `${fallo.x}%`, top: `${fallo.y}%` }} />}
        </div>
      </div>
      <p className="nota">← Desliza el dedo para recorrer el mural →</p>
    </MarcoReto>
  );
}

export default function DescubreElMural({ parada }: { parada: ContenidoParada }) {
  return <Mural parada={parada} hallazgos={HALLAZGOS} titulo={parada.reto ?? "Descubre el mural"} />;
}
