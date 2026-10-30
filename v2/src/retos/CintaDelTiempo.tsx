import { useRef, useState, type MouseEvent } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 1, reto para mayores: la historia de la Tierra en una cinta vertical, a escala. Arriba,
// la Tierra recién formada; abajo, hoy. Se elige un momento y se toca la cinta donde se cree
// que va. Primero los tres más antiguos; luego la cinta «hace zoom» a los últimos 540 millones
// de años (como el parque, que dedica casi la mitad del camino a la familia humana) y van los
// tres más recientes. Aun así, los humanos quedan pegados al final: es la lección.

interface Momento {
  id: string;
  nombre: string;
  emoji: string;
  /** Millones de años. */
  hace: number;
}

const ETAPAS: { desde: number; marcas: number[]; momentos: Momento[] }[] = [
  {
    desde: 4540,
    marcas: [4000, 3000, 2000, 1000],
    momentos: [
      { id: "vida", nombre: "Primeros seres vivos", emoji: "🦠", hace: 3500 },
      { id: "oxigeno", nombre: "El aire se llena de oxígeno", emoji: "💨", hace: 2400 },
      { id: "animales", nombre: "El mar se llena de animales", emoji: "🐚", hace: 540 },
    ],
  },
  {
    desde: 540,
    marcas: [400, 300, 200, 100],
    momentos: [
      { id: "dinosaurios", nombre: "Primeros dinosaurios", emoji: "🦕", hace: 230 },
      { id: "extincion", nombre: "Fin de los grandes dinosaurios", emoji: "☄️", hace: 66 },
      { id: "humanos", nombre: "Nuestra especie", emoji: "🧍", hace: 0.3 },
    ],
  },
];

const ALTO = 420; // unidades del dibujo
const ARRIBA = 24;
const ABAJO = 24;
/** Cuánto se puede fallar y que valga, en fracción de la cinta. */
const MARGEN = 0.08;

const fraccion = (hace: number, desde: number) => 1 - hace / desde; // 0 arriba, 1 abajo (hoy)
const yDe = (f: number) => ARRIBA + f * (ALTO - ARRIBA - ABAJO);
const fDe = (y: number) => Math.min(1, Math.max(0, (y - ARRIBA) / (ALTO - ARRIBA - ABAJO)));
const cifra = (n: number) => n.toLocaleString("es-ES");

export default function CintaDelTiempo({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    zoom: dicho("Zoom"),
    masAntiguo: dicho("Más antiguo"),
    masReciente: dicho("Más reciente"),
    final: dicho("Al terminar"),
    momento: Object.fromEntries(ETAPAS.flatMap((e) => e.momentos).map((m) => [m.id, dicho(m.nombre)])) as Record<string, Dicho>,
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [etapa, setEtapa] = useState(0);
  const [puestos, setPuestos] = useState<string[]>([]);
  const ya = useRef<string[]>([]);
  const [elegido, setElegido] = useState<string | null>(null);
  const [fallo, setFallo] = useState<number | null>(null);
  const e = ETAPAS[etapa];

  const tocarCinta = (ev: MouseEvent<SVGSVGElement>) => {
    if (acabado || !elegido) return;
    const m = ev.currentTarget.getScreenCTM();
    if (!m) return;
    const y = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m.inverse()).y;
    const momento = e.momentos.find((x) => x.id === elegido)!;
    const objetivo = fraccion(momento.hace, e.desde);
    const tocado = fDe(y);
    if (Math.abs(tocado - objetivo) > MARGEN) {
      setFallo(y);
      setTimeout(() => setFallo(null), 700);
      return decir(tocado > objetivo ? frases.masAntiguo : frases.masReciente);
    }
    const nuevos = [...ya.current, momento.id];
    ya.current = nuevos;
    setPuestos(nuevos);
    setElegido(null);
    const quedan = e.momentos.filter((x) => !nuevos.includes(x.id));
    if (quedan.length) return decir(frases.momento[momento.id]);
    if (etapa === 0) {
      decir(frases.momento[momento.id], () => {
        setEtapa(1);
        decir(frases.zoom);
      });
    } else terminar(frases.momento[momento.id], frases.final);
  };

  return (
    <MarcoReto parada={parada.id} titulo={parada.reto ?? "La cinta del tiempo"} mensaje={mensaje} decir={decir} final={final} pose="senala">
      <div className="cinta-juego">
        <div className="cinta-momentos" role="group" aria-label="Momentos para colocar">
          {e.momentos.map((m) => {
            const puesto = puestos.includes(m.id);
            return (
              <button
                key={m.id}
                className={`cinta-momento ${elegido === m.id ? "elegido" : ""} ${puesto ? "puesto" : ""}`}
                disabled={puesto || acabado}
                aria-pressed={elegido === m.id}
                onClick={() => setElegido(elegido === m.id ? null : m.id)}
              >
                <span className="cinta-emoji" aria-hidden="true">
                  {m.emoji}
                </span>
                <span>{m.nombre}</span>
                {puesto && <small>hace {m.hace < 1 ? "300.000 años" : `${cifra(m.hace)} millones de años`}</small>}
              </button>
            );
          })}
          <p className="nota">{elegido ? "Ahora toca la cinta donde crees que va." : "Elige un momento y tócalo en la cinta."}</p>
        </div>
        <svg className={`cinta ${elegido ? "esperando" : ""}`} viewBox={`0 0 150 ${ALTO}`} role="img" aria-label="La cinta del tiempo" onClick={tocarCinta}>
          <defs>
            <linearGradient id="cinta-color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={etapa === 0 ? "#c8553d" : "#4f8fb8"} />
              <stop offset="0.5" stopColor={etapa === 0 ? "#4f8fb8" : "#5aa26b"} />
              <stop offset="1" stopColor={etapa === 0 ? "#5aa26b" : "#e0a526"} />
            </linearGradient>
          </defs>
          <rect x={58} y={ARRIBA} width={34} height={ALTO - ARRIBA - ABAJO} rx={10} fill="url(#cinta-color)" />
          <text x={75} y={14} textAnchor="middle" className="cinta-extremo">
            {etapa === 0 ? "La Tierra se forma" : "Hace 540 millones"}
          </text>
          <text x={75} y={ALTO - 6} textAnchor="middle" className="cinta-extremo">
            Hoy
          </text>
          {e.marcas.map((h) => (
            <g key={h} className="cinta-marca">
              <line x1={52} x2={58} y1={yDe(fraccion(h, e.desde))} y2={yDe(fraccion(h, e.desde))} />
              <text x={48} y={yDe(fraccion(h, e.desde)) + 4} textAnchor="end">
                {cifra(h)}
              </text>
            </g>
          ))}
          {e.momentos
            .filter((m) => puestos.includes(m.id))
            .map((m) => {
              const y = yDe(fraccion(m.hace, e.desde));
              return (
                <g key={m.id} className="cinta-puesto">
                  <line x1={58} x2={104} y1={y} y2={y} />
                  <text x={108} y={y + 6} className="cinta-puesto-emoji">
                    {m.emoji}
                  </text>
                </g>
              );
            })}
          {fallo !== null && <circle className="busca-fallo" cx={75} cy={fallo} r={10} strokeWidth={3} />}
        </svg>
      </div>
      <p className="nota">Las cifras de la cinta son millones de años.</p>
    </MarcoReto>
  );
}
