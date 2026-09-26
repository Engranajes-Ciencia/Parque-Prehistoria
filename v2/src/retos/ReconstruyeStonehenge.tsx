import { useRef, useState, type RefObject } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { useArrastre } from "../componentes/useArrastre";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Escena esquemática (no un plano): desde el centro del círculo, mirando al nordeste, al
// amanecer del solsticio de verano. Se levantan las piedras caídas sobre su sombra; el
// dintel solo entra cuando están de pie sus dos pilares. Al acabar, el sol sale por el hueco,
// un poco a la izquierda de la Piedra del Talón, como hoy.
const HORIZONTE = 220;

type Tipo = "pilar" | "dintel" | "azul" | "talon";
type Hueco = "pilarI" | "pilarD" | "dintel" | "azulI" | "azulD" | "talon";

interface Forma {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
}

// «alcance»: zona invisible donde vale soltar, para huecos demasiado pequeños para un dedo.
// La del Talón llena el hueco entre los dos pilares (x 160-200) sin pisarlos.
const HUECOS: Record<Hueco, { tipo: Tipo; forma: Forma; alcance?: Forma }> = {
  talon: {
    tipo: "talon",
    forma: { x: 186, y: HORIZONTE - 24, width: 16, height: 26, rx: 5 },
    alcance: { x: 160, y: HORIZONTE - 48, width: 40, height: 56, rx: 0 },
  },
  azulI: { tipo: "azul", forma: { x: 66, y: 244, width: 32, height: 76, rx: 8 } },
  azulD: { tipo: "azul", forma: { x: 262, y: 244, width: 32, height: 76, rx: 8 } },
  pilarI: { tipo: "pilar", forma: { x: 112, y: 116, width: 48, height: 204, rx: 7 } },
  pilarD: { tipo: "pilar", forma: { x: 200, y: 116, width: 48, height: 204, rx: 7 } },
  dintel: { tipo: "dintel", forma: { x: 104, y: 92, width: 152, height: 30, rx: 6 } },
};

const PIEZAS: { id: string; tipo: Tipo; nombre: string }[] = [
  { id: "p1", tipo: "pilar", nombre: "Piedra grande" },
  { id: "d", tipo: "dintel", nombre: "Piedra tumbada" },
  { id: "a1", tipo: "azul", nombre: "Piedra azul" },
  { id: "t", tipo: "talon", nombre: "Piedra del Talón" },
  { id: "p2", tipo: "pilar", nombre: "Piedra grande" },
  { id: "a2", tipo: "azul", nombre: "Piedra azul" },
];

const COLOR: Record<Tipo, string> = { pilar: "#9a958a", dintel: "#9a958a", azul: "#7f8fa3", talon: "#a8977a" };
const BORDE = "#5f5a50";

// Dibujo de cada pieza en la bandeja (misma proporción que en la escena).
const MINI: Record<Tipo, Forma> = {
  pilar: { x: 22, y: 4, width: 16, height: 52, rx: 3 },
  dintel: { x: 4, y: 22, width: 52, height: 14, rx: 3 },
  azul: { x: 22, y: 20, width: 16, height: 36, rx: 4 },
  talon: { x: 20, y: 18, width: 20, height: 34, rx: 6 },
};

export default function ReconstruyeStonehenge({ parada }: { parada: ContenidoParada }) {
  const dicho = (etiqueta: string) => dichoDelReto(parada.guion, parada.id, etiqueta);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: dicho("Fallo"),
    pronto: dicho("Dintel antes de tiempo"),
    final: dicho("Al terminar"),
    puesta: {
      pilar: dicho("Al poner un pilar"),
      dintel: dicho("Al poner el dintel"),
      azul: dicho("Al poner una piedra azul"),
      talon: dicho("Al poner la Piedra del Talón"),
    } as Record<Tipo, Dicho>,
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [puestas, setPuestas] = useState<Partial<Record<Hueco, string>>>({});
  const [sacudida, setSacudida] = useState<string | null>(null);
  const r = {
    talon: useRef<SVGRectElement>(null),
    azulI: useRef<SVGRectElement>(null),
    azulD: useRef<SVGRectElement>(null),
    pilarI: useRef<SVGRectElement>(null),
    pilarD: useRef<SVGRectElement>(null),
    dintel: useRef<SVGRectElement>(null),
  };
  const destinos = r as unknown as Record<Hueco, RefObject<HTMLElement | null>>;
  const completo = Object.keys(puestas).length === PIEZAS.length;

  const colocar = (id: string, hueco: Hueco) => {
    if (acabado) return;
    const pieza = PIEZAS.find((p) => p.id === id)!;
    const rechazar = (d: Dicho) => {
      setSacudida(id);
      setTimeout(() => setSacudida(null), 500);
      decir(d);
    };
    if (puestas[hueco] || HUECOS[hueco].tipo !== pieza.tipo) return rechazar(frases.fallo);
    if (hueco === "dintel" && !(puestas.pilarI && puestas.pilarD)) return rechazar(frases.pronto);
    const nuevas = { ...puestas, [hueco]: id };
    setPuestas(nuevas);
    if (Object.keys(nuevas).length === PIEZAS.length) terminar(frases.puesta[pieza.tipo], frases.final);
    else decir(frases.puesta[pieza.tipo]);
  };

  const encaja = (id: string, h: Hueco) => !puestas[h] && HUECOS[h].tipo === PIEZAS.find((p) => p.id === id)?.tipo;
  const { arrastre, elegida, sobre, pieza, tocarDestino } = useArrastre(destinos, colocar, encaja);
  const colocadas = Object.values(puestas);

  const hueco = (h: Hueco) => {
    const { tipo, forma, alcance } = HUECOS[h];
    const puesta = !!puestas[h];
    return (
      <g key={h} onClick={() => tocarDestino(h)}>
        <rect
          ref={alcance ? undefined : r[h]}
          {...forma}
          className={puesta ? "piedra-puesta" : `sombra ${sobre === h ? "sobre" : ""} ${elegida ? "esperando" : ""}`}
          fill={puesta ? COLOR[tipo] : "rgba(40,30,20,0.28)"}
          stroke={puesta ? BORDE : "rgba(255,255,255,0.85)"}
          strokeWidth="2"
          strokeDasharray={puesta ? undefined : "6 5"}
        />
        {alcance && <rect ref={r[h]} {...alcance} fill="transparent" />}
      </g>
    );
  };

  return (
    <MarcoReto parada={parada.id} titulo={parada.reto ?? "Reconstruye Stonehenge"} mensaje={mensaje} decir={decir} final={final} pose="piensa">
      <svg className={`solsticio ${completo ? "alineado" : ""}`} viewBox="0 0 360 320" role="img" aria-label="Stonehenge con sus piedras caídas">
        <defs>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={completo ? "#8ec5f0" : "#4f6fa8"} style={{ transition: "stop-color 2s" }} />
            <stop offset="1" stopColor={completo ? "#ffe2a6" : "#f2a672"} style={{ transition: "stop-color 2s" }} />
          </linearGradient>
          <linearGradient id="rayo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3c4" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ffd36b" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="halo">
            <stop offset="0" stopColor="#fff1b0" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffcf5a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="360" height={HORIZONTE} fill="url(#cielo)" />
        <g className={`sol ${completo ? "sale" : ""}`}>
          <circle cx="176" cy={HORIZONTE - 8} r="34" fill="url(#halo)" />
          <circle cx="176" cy={HORIZONTE - 8} r="15" fill="#ffd54f" />
        </g>
        <rect y={HORIZONTE} width="360" height={320 - HORIZONTE} fill="#6f8a4c" />
        <polygon points={`168,${HORIZONTE} 192,${HORIZONTE} 250,320 110,320`} fill="#86a05e" />
        {completo && <polygon className="rayo" points={`158,${HORIZONTE - 20} 194,${HORIZONTE - 20} 258,320 94,320`} fill="url(#rayo)" />}

        {/* Piedras del círculo exterior que siguen en pie: decorado. */}
        <g stroke={BORDE} strokeWidth="2" fill={COLOR.pilar}>
          <rect x="6" y="150" width="52" height="170" rx="6" />
          <rect x="302" y="150" width="52" height="170" rx="6" />
          <rect x="0" y="136" width="70" height="20" rx="4" />
          <rect x="290" y="136" width="70" height="20" rx="4" />
        </g>
        {/* Piedras caídas, tumbadas en la hierba. */}
        <g fill="#8a857a" stroke={BORDE} strokeWidth="1.5" opacity={colocadas.length ? 0.5 : 0.9}>
          <rect x="120" y="296" width="90" height="16" rx="5" transform="rotate(-6 165 304)" />
          <rect x="226" y="302" width="60" height="12" rx="4" transform="rotate(8 256 308)" />
        </g>

        {(Object.keys(HUECOS) as Hueco[]).map(hueco)}
      </svg>

      <div className="estante">
        <h3>Piedras caídas</h3>
        <div className="piezas">
          {PIEZAS.map((p) =>
            colocadas.includes(p.id) ? (
              <span key={p.id} className="pieza hueco" />
            ) : (
              <button
                key={p.id}
                className={`pieza ${arrastre?.id === p.id ? "moviendo" : ""} ${elegida === p.id ? "elegida" : ""} ${sacudida === p.id ? "sacudida" : ""}`}
                {...pieza(p.id)}
              >
                <svg className="pieza-piedra" viewBox="0 0 60 60" aria-hidden="true">
                  <rect {...MINI[p.tipo]} fill={COLOR[p.tipo]} stroke={BORDE} strokeWidth="2" />
                </svg>
                <span className="pieza-nombre">{p.nombre}</span>
              </button>
            ),
          )}
        </div>
      </div>
      <p className="nota">Arrastra cada piedra hasta su sombra, o tócala y luego toca la sombra.</p>
    </MarcoReto>
  );
}
