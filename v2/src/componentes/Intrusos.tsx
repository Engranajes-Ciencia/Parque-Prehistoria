import { useRef, useState, type MouseEvent } from "react";
import type { Dicho } from "../contenido/guion";
import type { PoseAlba } from "./Alba";
import MarcoReto, { useAlba } from "./MarcoReto";

// Motor de juego «¿qué no encaja?»: una escena con intrusos que no pudieron estar allí (un
// móvil en una cueva neandertal, un tiranosaurio junto al brontosaurio…). Se tocan para
// atraparlos. Puede haber trampas: cosas que parecen intrusas pero sí estaban; al tocarlas,
// Alba explica por qué valen y no cuentan como fallo.
//
// Cada cosa se dibuja encima de la escena: una imagen de la app (`img`) o un emoji del
// propio móvil (`emoji`; no hace falta dibujo nuevo y queda claro que «no es de allí»).

export interface CosaEscena {
  id: string;
  nombre: string;
  /** Centro, en unidades de la escena. */
  x: number;
  y: number;
  /** Ancho del dibujo (o tamaño del emoji), en unidades de la escena. */
  ancho: number;
  /** Alto de la imagen; si no se da, cuadrada. */
  alto?: number;
  img?: string;
  emoji?: string;
  /** Grados; un poco de giro integra mejor el emoji en la escena. */
  giro?: number;
  /** Mirar hacia el otro lado. */
  espejo?: boolean;
  dicho: Dicho;
}

interface Props {
  parada: number;
  titulo: string;
  pose?: PoseAlba;
  /** Fondo de la escena y la parte que se enseña (viewBox) en sus unidades. */
  fondo: { src: string; ancho: number; alto: number };
  viewBox: string;
  etiqueta: string;
  /** Lo que forma parte de la escena y no se toca (p. ej. el brontosaurio). */
  decorado?: CosaEscena[];
  intrusos: CosaEscena[];
  trampas?: CosaEscena[];
  inicio: Dicho;
  final: Dicho;
  nota: string;
}

function Dibujo({ c }: { c: CosaEscena }) {
  const alto = c.alto ?? c.ancho;
  const t = `rotate(${c.giro ?? 0} ${c.x} ${c.y})${c.espejo ? ` translate(${2 * c.x} 0) scale(-1 1)` : ""}`;
  if (c.img)
    return <image href={c.img} x={c.x - c.ancho / 2} y={c.y - alto / 2} width={c.ancho} height={alto} transform={t} preserveAspectRatio="xMidYMid meet" />;
  return (
    <text x={c.x} y={c.y} fontSize={c.ancho} textAnchor="middle" dominantBaseline="central" transform={t} className="intruso-emoji">
      {c.emoji}
    </text>
  );
}

export default function Intrusos(p: Props) {
  const { mensaje, decir, final, terminar, acabado } = useAlba(p.inicio, p.parada);
  const [atrapados, setAtrapados] = useState<string[]>([]);
  const ya = useRef<string[]>([]); // al instante: dos toques seguidos no deben pisarse
  const [vistas, setVistas] = useState<string[]>([]); // trampas ya explicadas
  const [fallo, setFallo] = useState<{ x: number; y: number } | null>(null);
  const ancho = Number(p.viewBox.split(/\s+/)[2]) || 600;

  const tocar = (e: MouseEvent<SVGSVGElement>) => {
    if (acabado) return;
    const m = e.currentTarget.getScreenCTM();
    if (!m) return;
    const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    // Gana la cosa cuyo centro esté más cerca, si el toque cae dentro de su radio (con un
    // mínimo generoso: un emoji pequeño debe poder tocarse con un dedo de cinco años).
    const radio = (c: CosaEscena) => Math.max(c.ancho, c.alto ?? c.ancho, ancho * 0.12) / 2;
    const cerca = [...p.intrusos, ...(p.trampas ?? [])]
      .map((c) => ({ c, d: Math.hypot(q.x - c.x, q.y - c.y) }))
      .filter(({ c, d }) => d <= radio(c))
      .sort((a, b) => a.d - b.d)[0]?.c;
    if (!cerca) {
      setFallo({ x: q.x, y: q.y });
      setTimeout(() => setFallo(null), 600);
      return;
    }
    if (p.trampas?.includes(cerca)) {
      setVistas((v) => (v.includes(cerca.id) ? v : [...v, cerca.id]));
      return decir(cerca.dicho);
    }
    if (ya.current.includes(cerca.id)) return decir(cerca.dicho);
    const nuevos = [...ya.current, cerca.id];
    ya.current = nuevos;
    setAtrapados(nuevos);
    if (nuevos.length === p.intrusos.length) terminar(cerca.dicho, p.final);
    else decir(cerca.dicho);
  };

  const marca = (c: CosaEscena, clase: string) => (
    <circle
      key={`${clase}-${c.id}`}
      className={clase}
      cx={c.x}
      cy={c.y}
      r={Math.max(c.ancho, c.alto ?? c.ancho) * 0.62}
      strokeWidth={ancho * 0.011}
    />
  );

  return (
    <MarcoReto parada={p.parada} titulo={p.titulo} mensaje={mensaje} decir={decir} final={final} pose={p.pose ?? "lupa"}>
      <div className="intrusos-cuenta" role="status">
        {atrapados.length} de {p.intrusos.length} intrusos
        <span aria-hidden="true">
          {p.intrusos.map((c) => (
            <i key={c.id} className={atrapados.includes(c.id) ? "hecho" : ""} />
          ))}
        </span>
      </div>
      <svg className="busca intrusos" viewBox={p.viewBox} role="img" aria-label={p.etiqueta} onClick={tocar}>
        <image href={p.fondo.src} x={0} y={0} width={p.fondo.ancho} height={p.fondo.alto} preserveAspectRatio="none" />
        {(p.decorado ?? []).map((c) => (
          <Dibujo key={c.id} c={c} />
        ))}
        {[...(p.trampas ?? []), ...p.intrusos].map((c) => (
          <g key={c.id} className={atrapados.includes(c.id) ? "intruso-atrapado" : ""}>
            <Dibujo c={c} />
          </g>
        ))}
        {p.intrusos.filter((c) => atrapados.includes(c.id)).map((c) => marca(c, "busca-hallada intruso-marca"))}
        {(p.trampas ?? []).filter((c) => vistas.includes(c.id)).map((c) => marca(c, "intruso-trampa"))}
        {fallo && <circle className="busca-fallo" cx={fallo.x} cy={fallo.y} r={ancho * 0.04} strokeWidth={ancho * 0.011} />}
      </svg>
      <p className="nota">{p.nota}</p>
    </MarcoReto>
  );
}
