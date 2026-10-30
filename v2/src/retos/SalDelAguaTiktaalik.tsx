import { useState } from "react";
import Laberinto, { CELDA } from "../componentes/Laberinto";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 4 (peques): un río poco profundo visto desde arriba. Abajo, el agua más honda;
// arriba, la orilla de barro. El Tiktaalik va de casilla en casilla hasta la orilla: un solo
// camino de doce pasos con tres entrantes cortos sin salida, para que un peque de cuatro años
// lo haga en menos de un minuto. Nada de hierba ni de flores, que aún no existían: en la
// orilla, plantas de tallos sin hojas que se ahorquillan, como las de hace 375 millones de años.
//   "#" piedra, tronco o plantas · "S" salida · "M" la orilla · "A", "B" puntos de control.
const PLANO = [
  "###M#",
  "....#",
  "#B###",
  "#..A.",
  "###.#",
  "S....",
];
const FILA_TRONCO = 4; // los obstáculos seguidos de esta fila forman un tronco caído
const ANCHO = PLANO[0].length * CELDA;
const ALTO = PLANO.length * CELDA;

// La figura es la losa del Tiktaalik del parque (img/p04/tiktaalik.webp, una foto de 260×196
// con hierba alrededor), recortada en un círculo de radio 80 centrado en el pez (145, 85). En
// la foto la cabeza mira hacia abajo y algo a la derecha: girada 162°, mira hacia arriba.
const RADIO = 25;
const K = RADIO / 80;
const FIGURA = (
  <g>
    <circle cx="2" cy="3" r={RADIO + 1} fill="rgba(10, 40, 50, 0.35)" />
    <g transform="rotate(-162)">
      <image
        href="img/p04/tiktaalik.webp"
        x={-145 * K}
        y={-85 * K}
        width={260 * K}
        height={196 * K}
        clipPath="url(#lab-tiktaalik)"
      />
    </g>
    <circle r={RADIO} fill="none" stroke="#fff" strokeWidth="3" />
  </g>
);

// Ondas del agua y guijarros del fondo, en sitios fijos (los obstáculos se dibujan encima).
const ONDAS = [
  [50, 95], [150, 84], [215, 100], [90, 200], [160, 226], [268, 196],
  [40, 336], [118, 318], [200, 342], [272, 320],
];
const GUIJARROS = [
  [18, 92, 4], [70, 78, 3], [128, 104, 4], [205, 86, 3], [96, 214, 4], [150, 190, 3],
  [252, 222, 4], [176, 270, 3], [212, 300, 4], [66, 304, 3],
];
// La orilla, de izquierda a derecha.
const ORILLA = "M0 64 Q37 54 75 59 T150 63 T225 61 T300 60";

const FONDO = (
  <>
    <defs>
      <linearGradient id="lab-agua" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b5c9a0" />
        <stop offset="0.3" stopColor="#7fb2a6" />
        <stop offset="1" stopColor="#2d6b86" />
      </linearGradient>
      <linearGradient id="lab-barro" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6e4f30" />
        <stop offset="1" stopColor="#9d7b4d" />
      </linearGradient>
      <clipPath id="lab-tiktaalik">
        <circle r={RADIO} />
      </clipPath>
    </defs>
    <rect width={ANCHO} height={ALTO} fill="url(#lab-agua)" />
    {GUIJARROS.map(([x, y, r]) => (
      <ellipse key={`${x},${y}`} cx={x} cy={y} rx={r * 1.4} ry={r} fill="#d8cfa6" opacity="0.4" />
    ))}
    {ONDAS.map(([x, y]) => (
      <path
        key={`${x},${y}`}
        d={`M${x - 12} ${y} q6 -5 12 0 t12 0`}
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    ))}
    {/* El barro de la orilla, con charquitos y la espuma donde toca el agua */}
    <path d={`${ORILLA} V0 H0 Z`} fill="url(#lab-barro)" />
    <ellipse cx="40" cy="24" rx="9" ry="3.5" fill="#4f3a24" opacity="0.35" />
    <ellipse cx="128" cy="40" rx="11" ry="4" fill="#4f3a24" opacity="0.3" />
    <ellipse cx="272" cy="18" rx="8" ry="3" fill="#4f3a24" opacity="0.35" />
    <path d={ORILLA} stroke="rgba(255, 255, 255, 0.7)" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d={ORILLA} transform="translate(0 6)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" fill="none" />
  </>
);

// La meta: un claro de barro seco en la orilla.
const META = <ellipse cx="30" cy="31" rx="24" ry="17" fill="#d6b77e" opacity="0.85" />;

/** Una piedra que asoma del agua; `v` cambia la forma y la vuelta, para que no salgan iguales. */
function piedra(v: number) {
  const forma =
    v % 3 === 2
      ? "M9 36 Q8 16 27 11 Q47 7 53 24 Q57 41 43 49 Q26 55 14 47 Q9 43 9 36 Z"
      : "M7 33 Q12 13 31 11 Q50 11 53 29 Q54 45 37 50 Q18 53 10 45 Q6 40 7 33 Z";
  return (
    <g transform={v % 2 ? "translate(60 0) scale(-1 1)" : undefined}>
      <ellipse cx="32" cy="38" rx="25" ry="16" fill="rgba(12, 44, 56, 0.28)" />
      {v % 3 === 1 && (
        <path
          d="M14 46 q-7 4 -5 11 M46 47 q6 4 4 11 M30 50 q-2 5 2 9"
          stroke="#3f8a4a"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      )}
      <path d={forma} fill="#8b877d" stroke="#57534b" strokeWidth="2.5" />
      <path d="M17 25 Q23 16 34 15" stroke="#bdb8ac" strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  );
}

/**
 * Matas de la orilla: tallos sin hojas que se parten en dos y acaban enroscados, como las
 * plantas de entonces. Sin espigas ni cápsulas en la punta: con ellas parecían juncos o
 * eneas, que son plantas con flor y llegaron muchísimo después.
 */
function plantas(v: number) {
  return (
    <g stroke="#3e7d36" strokeWidth="3" strokeLinecap="round" fill="none">
      <ellipse cx="30" cy="51" rx="24" ry="7" fill="#5b4126" stroke="none" opacity="0.5" />
      {[
        [15, -5],
        [30, 1],
        [45, 6],
      ].map(([x, inclina], i) => {
        const alto = 38 + ((v + i) % 3) * 4;
        const xr = x + inclina; // donde el tallo se ahorquilla
        const yr = 52 - alto * 0.5;
        const punta = 52 - alto;
        return (
          <path
            key={i}
            d={`M${x} 52 Q${x} ${yr + 6} ${xr} ${yr} Q${xr - 7} ${yr - 6} ${xr - 9} ${punta + 3} q-1 -5 4 -5 M${xr} ${yr} Q${xr + 6} ${yr - 8} ${xr + 6} ${punta} q0 -5 -5 -4`}
          />
        );
      })}
    </g>
  );
}

/** Un trozo de tronco caído; si sigue en la casilla de al lado, ese extremo queda abierto. */
function tronco(inicio: boolean, fin: boolean) {
  const x0 = inicio ? 7 : 0;
  const x1 = fin ? 53 : CELDA;
  return (
    <g>
      <rect x={x0} y="20" width={x1 - x0} height="30" fill="rgba(12, 44, 56, 0.28)" transform="translate(2 5)" />
      <rect x={x0} y="16" width={x1 - x0} height="30" fill="#7a5532" />
      <path d={`M${x0} 16 H${x1} M${x0} 46 H${x1}`} stroke="#43301c" strokeWidth="2.5" />
      <path
        d={`M${x0 + 9} 24 h15 M${x0 + 26} 33 h16 M${x0 + 5} 39 h10`}
        stroke="#5b3e22"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {inicio && <ellipse cx={x0} cy="31" rx="7" ry="15" fill="#c49a62" stroke="#43301c" strokeWidth="2.5" />}
      {fin && <ellipse cx={x1} cy="31" rx="7" ry="15" fill="#c49a62" stroke="#43301c" strokeWidth="2.5" />}
    </g>
  );
}

function obstaculo(c: number, f: number) {
  if (f === 0) return plantas(c);
  if (f === FILA_TRONCO) {
    const izquierda = PLANO[f][c - 1] === "#";
    const derecha = PLANO[f][c + 1] === "#";
    if (izquierda || derecha) return tronco(!izquierda, !derecha);
  }
  return piedra(c * 7 + f * 3);
}

export default function SalDelAguaTiktaalik({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [f] = useState(() => ({
    inicio: dicho("Al empezar"),
    mitad: dicho("A la mitad"),
    orilla: dicho("Cerca de la orilla"),
    llegada: dicho("Al llegar"),
    final: dicho("Al terminar"),
  }));
  return (
    <Laberinto
      parada={parada.id}
      titulo={parada.reto ?? "¡Sal del agua, Tiktaalik!"}
      plano={PLANO}
      fondo={FONDO}
      obstaculo={obstaculo}
      meta={META}
      figura={FIGURA}
      controles={{ A: f.mitad, B: f.orilla }}
      frases={{ inicio: f.inicio, llegada: f.llegada, final: f.final }}
      etiqueta="Un río poco profundo visto desde arriba, con piedras, un tronco caído y la orilla de barro"
      nota="Arrastra al Tiktaalik por el agua hasta la orilla."
    />
  );
}
