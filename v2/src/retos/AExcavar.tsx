import { useEffect, useRef, useState, type PointerEvent as EventoPuntero, type ReactNode } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Arenero de 4×4 casillas: columnas A-D (izquierda a derecha), filas 1-4 (arriba a abajo).
// Los hallazgos están siempre en la misma casilla: el guion los nombra por ella.
const COLUMNAS = ["A", "B", "C", "D"];
const DESCUBIERTO = 0.4; // fracción de la casilla rascada para dar el hallazgo por encontrado

interface Hallazgo {
  id: string;
  etiqueta: string;
  col: number;
  fila: number;
  dibujo: ReactNode;
}

const hueso = "#efe6d0";
const trazo = "#6b5a3e";

const HALLAZGOS: Hallazgo[] = [
  {
    id: "diente",
    etiqueta: "Al encontrar el diente",
    col: 2,
    fila: 1,
    dibujo: (
      <path
        d="M22 30 Q20 12 34 14 Q42 10 50 14 Q64 12 62 30 Q60 42 56 48 L54 78 Q50 84 47 76 L44 54 L40 54 L37 76 Q34 84 30 78 L28 48 Q24 42 22 30 Z"
        fill={hueso}
        stroke={trazo}
        strokeWidth="3"
      />
    ),
  },
  {
    id: "mandibula",
    etiqueta: "Al encontrar la mandíbula",
    col: 0,
    fila: 3,
    dibujo: (
      <g>
        <path d="M12 20 Q14 76 42 78 Q70 76 72 20 L60 20 Q58 62 42 64 Q26 62 24 20 Z" fill={hueso} stroke={trazo} strokeWidth="3" />
        {[30, 38, 46, 54].map((x) => (
          <rect key={x} x={x - 3} y="60" width="6" height="7" rx="2" fill="#fbf7ea" stroke={trazo} strokeWidth="1.5" />
        ))}
      </g>
    ),
  },
  {
    id: "bifaz",
    etiqueta: "Al encontrar el bifaz",
    col: 3,
    fila: 0,
    dibujo: (
      <g>
        <path d="M42 8 Q64 36 62 58 Q58 80 42 82 Q26 80 22 58 Q20 36 42 8 Z" fill="#9a9486" stroke="#4f4b43" strokeWidth="3" />
        <path d="M42 14 L36 40 L46 52 L38 70 M52 36 L46 52 M30 56 L38 70 M54 62 L46 52" stroke="#6d685e" strokeWidth="2" fill="none" />
      </g>
    ),
  },
  {
    id: "hueso",
    etiqueta: "Al encontrar el hueso",
    col: 1,
    fila: 2,
    dibujo: (
      <g transform="rotate(-30 42 42)">
        <path
          d="M18 34 Q8 28 12 20 Q18 14 24 22 L60 22 Q66 14 72 20 Q76 28 66 34 Q76 40 72 48 Q66 54 60 46 L24 46 Q18 54 12 48 Q8 40 18 34 Z"
          fill={hueso}
          stroke={trazo}
          strokeWidth="3"
        />
        <path d="M34 26 L36 32 M40 26 L42 32 M46 26 L48 32" stroke="#a0442e" strokeWidth="2" />
      </g>
    ),
  },
];

function pintarArena(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#e3bd76";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < (w * h) / 40; i++) {
    const t = Math.random();
    ctx.fillStyle = t < 0.5 ? "rgba(160,112,52,0.35)" : t < 0.8 ? "rgba(255,240,200,0.45)" : "rgba(120,84,40,0.5)";
    ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
}

export default function AExcavar({ parada }: { parada: ContenidoParada }) {
  const [frases] = useState(() => ({
    inicio: dichoDelReto(parada.guion, parada.id, "Al empezar"),
    final: dichoDelReto(parada.guion, parada.id, "Al terminar"),
    hallazgo: Object.fromEntries(HALLAZGOS.map((h) => [h.id, dichoDelReto(parada.guion, parada.id, h.etiqueta)])),
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [encontrados, setEncontrados] = useState<string[]>([]);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const ultimo = useRef<{ x: number; y: number } | null>(null);
  const trazos = useRef(0);
  const hallados = useRef<string[]>([]);

  useEffect(() => {
    const c = lienzo.current!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
    pintarArena(c.getContext("2d")!, c.width, c.height);
  }, []);

  const casilla = (h: Hallazgo) => {
    const c = lienzo.current!;
    const lado = c.width / 4;
    return { x: h.col * lado, y: h.fila * lado, lado };
  };

  const revisar = () => {
    const c = lienzo.current!;
    const ctx = c.getContext("2d")!;
    for (const h of HALLAZGOS) {
      if (hallados.current.includes(h.id)) continue;
      const { x, y, lado } = casilla(h);
      const datos = ctx.getImageData(x, y, lado, lado).data;
      let vacios = 0;
      let total = 0;
      for (let i = 3; i < datos.length; i += 16) {
        total++;
        if (datos[i] < 40) vacios++;
      }
      if (vacios / total >= DESCUBIERTO) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "#000";
        ctx.fillRect(x, y, lado, lado);
        const nuevos = [...hallados.current, h.id];
        hallados.current = nuevos;
        setEncontrados(nuevos);
        if (nuevos.length === HALLAZGOS.length) {
          terminar(frases.hallazgo[h.id], frases.final);
        } else {
          decir(frases.hallazgo[h.id]);
        }
        return;
      }
    }
  };

  const rascar = (e: EventoPuntero<HTMLCanvasElement>) => {
    if (acabado || (e.type === "pointermove" && e.buttons === 0)) return;
    const c = lienzo.current!;
    const r = c.getBoundingClientRect();
    const k = c.width / r.width;
    const p = { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
    const ctx = c.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineWidth = c.width * 0.09;
    ctx.beginPath();
    const desde = ultimo.current ?? p;
    ctx.moveTo(desde.x, desde.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ultimo.current = p;
    if (++trazos.current % 10 === 0) revisar();
  };

  return (
    <MarcoReto parada={parada.id} titulo={parada.reto ?? "¡A excavar!"} mensaje={mensaje} decir={decir} final={final} pose="lupa">
      <div className="excavacion">
        <div className="excavacion-columnas">
          {COLUMNAS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
        <div className="excavacion-filas">
          {[1, 2, 3, 4].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <div className="excavacion-arenero">
          {HALLAZGOS.map((h) => (
            <svg
              key={h.id}
              className="hallazgo"
              viewBox="0 0 84 90"
              style={{ left: `${h.col * 25}%`, top: `${h.fila * 25}%` }}
              aria-hidden="true"
            >
              {h.dibujo}
            </svg>
          ))}
          <canvas
            ref={lienzo}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              ultimo.current = null;
              rascar(e);
            }}
            onPointerMove={rascar}
            onPointerUp={() => {
              ultimo.current = null;
              revisar();
            }}
          />
          <svg className="excavacion-cuerdas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {[25, 50, 75].map((v) => (
              <g key={v}>
                <line x1={v} y1="0" x2={v} y2="100" />
                <line x1="0" y1={v} x2="100" y2={v} />
              </g>
            ))}
          </svg>
          {HALLAZGOS.filter((h) => encontrados.includes(h.id)).map((h) => (
            <span key={h.id} className="excavacion-apunte" style={{ left: `${h.col * 25}%`, top: `${h.fila * 25}%` }}>
              ✔ {COLUMNAS[h.col]}
              {h.fila + 1}
            </span>
          ))}
        </div>
      </div>
      <p className="nota">Rasca la arena con el dedo, como con un pincel. Hay cuatro tesoros escondidos.</p>
    </MarcoReto>
  );
}
