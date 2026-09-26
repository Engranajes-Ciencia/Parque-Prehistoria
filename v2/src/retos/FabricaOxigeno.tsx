import { useRef, useState } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { dichoDelReto, dichosDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Estromatolitos en un mar primitivo; la capa verde de arriba son las cianobacterias.
const COLONIAS = [
  { x: 52, ancho: 64, alto: 58 },
  { x: 124, ancho: 52, alto: 42 },
  { x: 190, ancho: 74, alto: 70 },
  { x: 262, ancho: 54, alto: 48 },
  { x: 322, ancho: 60, alto: 60 },
];
const FONDO = 262;
const TOQUES = 10;

interface Burbuja {
  id: number;
  x: number;
  y: number;
  r: number;
  retraso: number;
}

const mezcla = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

export default function FabricaOxigeno({ parada }: { parada: ContenidoParada }) {
  const [frases] = useState(() => ({
    inicio: dichoDelReto(parada.guion, parada.id, "Al empezar"),
    toques: dichosDelReto(parada.guion, parada.id, "Al tocar"),
    mitad: dichoDelReto(parada.guion, parada.id, "A la mitad"),
    final: dichoDelReto(parada.guion, parada.id, "Al terminar"),
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [toques, setToques] = useState(0);
  const cuenta = useRef(0);
  const dichas = useRef(0);
  const [burbujas, setBurbujas] = useState<Burbuja[]>([]);
  const siguiente = useRef(0);
  const ultimoToque = useRef<number[]>(COLONIAS.map(() => 0));

  const tocar = (i: number) => {
    const ahora = Date.now();
    if (acabado || ahora - ultimoToque.current[i] < 300) return;
    ultimoToque.current[i] = ahora;
    const c = COLONIAS[i];
    const nuevas = Array.from({ length: 6 }, (_, k) => ({
      id: siguiente.current++,
      x: c.x + (Math.random() - 0.5) * c.ancho * 0.7,
      y: FONDO - c.alto,
      r: 3 + Math.random() * 5,
      retraso: k * 0.08,
    }));
    setBurbujas((b) => [...b, ...nuevas]);
    setTimeout(() => setBurbujas((b) => b.filter((x) => !nuevas.includes(x))), 2200);

    // Cuenta en una ref: dos toques en el mismo instante no deben contarse como uno.
    const n = ++cuenta.current;
    setToques(n);
    if (n === TOQUES) {
      terminar(null, frases.final);
    } else if (n === TOQUES / 2) {
      decir(frases.mitad);
    } else if (n % 2 === 1 && frases.toques.length) {
      // Las frases «Al tocar» se turnan todas (antes la tercera no sonaba nunca).
      decir(frases.toques[dichas.current++ % frases.toques.length]);
    }
  };

  const nivel = toques / TOQUES;

  return (
    <MarcoReto parada={parada.id} titulo={parada.reto ?? "Fábrica de oxígeno"} mensaje={mensaje} decir={decir} final={final}>
      <svg className="oxigeno" viewBox="0 0 360 300" role="img" aria-label="Mar primitivo con colonias de cianobacterias">
        <defs>
          <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mezcla([96, 128, 88], [120, 196, 232], nivel)} />
            <stop offset="1" stopColor={mezcla([40, 72, 60], [26, 96, 150], nivel)} />
          </linearGradient>
        </defs>
        <rect width="360" height="300" fill="url(#agua)" />
        <path d={`M0 ${FONDO} Q90 ${FONDO - 8} 180 ${FONDO} T360 ${FONDO} V300 H0 Z`} fill="#b8995f" />

        {burbujas.map((b) => (
          <circle
            key={b.id}
            className="burbuja"
            cx={b.x}
            cy={b.y}
            r={b.r}
            style={{ animationDelay: `${b.retraso}s` }}
          />
        ))}

        {COLONIAS.map((c, i) => {
          const izq = c.x - c.ancho / 2;
          return (
            <g key={i} className="colonia" onPointerDown={() => tocar(i)}>
              <path
                d={`M${izq} ${FONDO + 2} Q${izq} ${FONDO - c.alto} ${c.x} ${FONDO - c.alto} Q${izq + c.ancho} ${FONDO - c.alto} ${izq + c.ancho} ${FONDO + 2} Z`}
                fill="#8a6a45"
                stroke="#5d4630"
                strokeWidth="2"
              />
              {[0.3, 0.55, 0.78].map((f) => (
                <path
                  key={f}
                  d={`M${izq + 4} ${FONDO - c.alto * f * 0.9} Q${c.x} ${FONDO - c.alto * (f + 0.12)} ${izq + c.ancho - 4} ${FONDO - c.alto * f * 0.9}`}
                  stroke="#6f5436"
                  strokeWidth="2"
                  fill="none"
                />
              ))}
              <ellipse cx={c.x} cy={FONDO - c.alto + 4} rx={c.ancho * 0.36} ry="9" fill="#3fae4f" stroke="#237a33" strokeWidth="2" />
            </g>
          );
        })}
      </svg>

      <div className="medidor" aria-label={`Oxígeno: ${Math.round(nivel * 100)} %`}>
        <span className="medidor-etiqueta">Oxígeno</span>
        <span className="medidor-barra">
          <span style={{ width: `${nivel * 100}%` }} />
        </span>
      </div>
      <p className="nota">Toca las colonias verdes de lo alto de las rocas.</p>
    </MarcoReto>
  );
}
