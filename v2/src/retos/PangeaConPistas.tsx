import { createRef, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { useArrastre } from "../componentes/useArrastre";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";
import { ganarPegatina } from "../estado";
import "./PangeaConPistas.css";

// Parada 8, reto para mayores. Pangea entera, como estaba hace unos doscientos cincuenta
// millones de años, en siete piezas (Madagascar va fija, en gris). Cada pieza lleva pintadas
// franjas de colores: los sitios donde han aparecido cuatro fósiles, las mismas pruebas que
// usó Wegener y que dibuja el mapa del Servicio Geológico de Estados Unidos (USGS, «This
// Dynamic Earth»). Al encajar dos piezas vecinas, sus franjas siguen de una a otra.
//
// Cada pieza encajada dice su frase. Cuando una franja queda unida por primera vez entre dos
// piezas, Alba explica ese fósil justo después. Si se coloca otra pieza antes de que acabe,
// la explicación pendiente se repite tras la frase de la pieza nueva. Con la última pieza:
// su frase, los fósiles que falten por explicar y, al final, la hoja de «¡Reto superado!»
// (la pegatina se gana en el instante en que se completa Pangea).
//
// Dibujo ESQUEMÁTICO, no un mapa: piezas ya giradas como estaban en Pangea, con las costas
// simplificadas y sin los bloques de Asia que aún se estaban juntando. Las juntas son las
// mismas líneas en las dos piezas (se construyen con los mismos tramos), para que encajen sin
// huecos. Lo que sí respeta: la India entre Madagascar, África y la Antártida; Australia
// pegada a la Antártida; América del Sur metida en el golfo de Guinea; Groenlandia junto a
// Noruega, y la península ibérica (el puntito) junto a Terranova.
//
// Las franjas simplifican el mapa del USGS. Rigor (no se dice en voz alta): el cinognato
// también ha aparecido en la Antártida, y el listrosaurio, en China, Mongolia y Rusia; el
// glosópteris, además, en Madagascar. Las franjas solo marcan los sitios del mapa clásico.

type IdPieza = "america-sur" | "africa" | "america-norte" | "eurasia" | "india" | "antartida" | "australia";
type IdFosil = "mesosaurio" | "glosopteris" | "listrosaurio" | "cinognato";
type Punto = readonly [number, number];

// Vértices donde se juntan tres piezas (o una junta con la costa).
const V = {
  naSaAf: [146, 122],
  naEuAf: [168, 90],
  naEuNorte: [184, 10],
  euAfTetis: [214, 94],
  saAfAn: [182, 216],
  saAnSur: [154, 244],
  afInMad: [250, 148],
  afInCosta: [262, 136],
  afMadAn: [236, 192],
  madInAn: [246, 196],
  inAuAn: [294, 206],
  inAuCosta: [302, 166],
  auAnCosta: [342, 218],
} satisfies Record<string, Punto>;

// Juntas entre piezas: cada una, una sola vez, y la usan las dos piezas que separa.
const JUNTA = {
  naAf: [V.naSaAf, [156, 108], V.naEuAf],
  naEu: [V.naEuAf, [172, 70], [178, 44], V.naEuNorte],
  euAf: [V.naEuAf, [188, 92], V.euAfTetis],
  saAf: [V.naSaAf, [150, 134], [162, 140], [168, 148], [168, 166], [172, 190], [176, 206], V.saAfAn],
  saAn: [V.saAnSur, [168, 230], V.saAfAn],
  afAn: [V.saAfAn, [198, 212], [220, 204], V.afMadAn],
  afMad: [V.afMadAn, [242, 170], V.afInMad],
  afIn: [V.afInMad, V.afInCosta],
  madIn: [V.afInMad, [254, 172], V.madInAn],
  madAn: [V.afMadAn, V.madInAn],
  inAn: [V.madInAn, [268, 204], V.inAuAn],
  inAu: [V.inAuAn, [300, 186], V.inAuCosta],
  auAn: [V.inAuAn, [318, 214], V.auAnCosta],
} satisfies Record<string, Punto[]>;

// Costas (de un vértice al siguiente, sin cerrar).
const COSTA = {
  na: [V.naEuNorte, [164, 8], [152, 22], [146, 40], [136, 24], [112, 22], [88, 18], [60, 22], [40, 36], [48, 50], [62, 58], [70, 78], [84, 96], [98, 108], [112, 114], [120, 110], [126, 104], [134, 106], [140, 114], V.naSaAf],
  eu: [V.naEuNorte, [204, 6], [226, 10], [240, 4], [276, 6], [306, 10], [330, 18], [348, 30], [352, 46], [344, 58], [330, 62], [318, 70], [304, 70], [286, 76], [268, 78], [252, 84], [236, 84], [226, 90], V.euAfTetis],
  af: [V.euAfTetis, [232, 96], [246, 94], [262, 102], [270, 114], [264, 124], [252, 128], V.afInCosta],
  sa: [V.saAnSur, [146, 240], [138, 226], [128, 206], [116, 184], [104, 162], [98, 146], [100, 134], [110, 126], [124, 121], [136, 119], V.naSaAf],
  an: [V.auAnCosta, [344, 232], [326, 244], [296, 252], [256, 254], [216, 254], [184, 252], [164, 250], [148, 254], [138, 248], V.saAnSur],
  in: [V.afInCosta, [272, 134], [284, 140], [296, 150], V.inAuCosta],
  au: [V.inAuCosta, [312, 160], [320, 168], [324, 156], [332, 166], [342, 180], [350, 196], [350, 210], V.auAnCosta],
} satisfies Record<string, Punto[]>;

const alReves = (t: Punto[]) => [...t].reverse();
/** Une tramos que empiezan donde acaba el anterior y cierra el contorno. */
function contorno(...tramos: Punto[][]): string {
  const puntos = [tramos[0][0], ...tramos.flatMap((t) => t.slice(1))];
  return `M${puntos.map((p) => `${p[0]} ${p[1]}`).join(" L")} Z`;
}
function caja(...tramos: Punto[][]) {
  const p = tramos.flat();
  const xs = p.map((q) => q[0]);
  const ys = p.map((q) => q[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

interface Continente {
  id: IdPieza;
  nombre: string;
  color: string;
  tramos: Punto[][];
}

// El nombre es también la etiqueta de su frase en el guion.
const CONTINENTES: Continente[] = [
  { id: "america-norte", nombre: "América del Norte", color: "#f6c49b", tramos: [JUNTA.naAf, JUNTA.naEu, COSTA.na] },
  { id: "eurasia", nombre: "Eurasia", color: "#e9a99a", tramos: [alReves(JUNTA.euAf), JUNTA.naEu, COSTA.eu] },
  {
    id: "africa",
    nombre: "África",
    color: "#f3d98b",
    tramos: [JUNTA.naAf, JUNTA.euAf, COSTA.af, alReves(JUNTA.afIn), alReves(JUNTA.afMad), alReves(JUNTA.afAn), alReves(JUNTA.saAf)],
  },
  { id: "america-sur", nombre: "América del Sur", color: "#a8d8b9", tramos: [JUNTA.saAf, alReves(JUNTA.saAn), COSTA.sa] },
  { id: "antartida", nombre: "Antártida", color: "#eef3f6", tramos: [JUNTA.saAn, JUNTA.afAn, JUNTA.madAn, JUNTA.inAn, JUNTA.auAn, COSTA.an] },
  { id: "india", nombre: "India", color: "#bfe0f0", tramos: [COSTA.in, alReves(JUNTA.inAu), alReves(JUNTA.inAn), alReves(JUNTA.madIn), JUNTA.afIn] },
  { id: "australia", nombre: "Australia", color: "#f2c6d6", tramos: [COSTA.au, alReves(JUNTA.auAn), JUNTA.inAu] },
];

const FORMA = Object.fromEntries(
  CONTINENTES.map((c) => [c.id, { d: contorno(...c.tramos), zona: caja(...c.tramos) }]),
) as Record<IdPieza, { d: string; zona: ReturnType<typeof caja> }>;

const MADAGASCAR = contorno(JUNTA.madIn, alReves(JUNTA.madAn), JUNTA.afMad);

interface Fosil {
  id: IdFosil;
  /** Nombre en pantalla; es también la etiqueta de su frase en el guion. */
  nombre: string;
  color: string;
  /** La franja, en unidades del mapa: cada pieza dibuja el trozo que le cae dentro. */
  franja: string;
  /** Pares de piezas cuya junta cruza la franja: con las dos puestas, el fósil queda unido. */
  uniones: [IdPieza, IdPieza][];
  icono: ReactNode;
}

// Siluetas en un recuadro de 40 × 24.
const FOSILES: Fosil[] = [
  {
    id: "mesosaurio",
    nombre: "Mesosaurio",
    color: "#1f6fd0",
    franja: "M126 183 L198 177",
    uniones: [["america-sur", "africa"]],
    icono: (
      <>
        <path d="M1 12 L10 10.5 Q13 8.5 17 9 Q24 8.6 30 10 Q35 11 39 9 Q36 13 30 13.6 Q24 14.6 17 14 Q13 14 10 12.8 Z M15 13.5 L12 18 L15 17.5 L17 14 Z M25 13.8 L23 18.5 L26 18 L27 14 Z M15 9.5 L13 6 L16 6.5 L17.5 9.2 Z" />
        <circle cx="11.5" cy="10.8" r="0.9" fill="#fff" />
      </>
    ),
  },
  {
    id: "glosopteris",
    nombre: "Glosópteris",
    color: "#2b8a3e",
    franja: "M138 204 L200 198 L224 234 L318 236 M260 236 L264 180 M318 236 L326 190",
    uniones: [
      ["america-sur", "africa"],
      ["africa", "antartida"],
      ["antartida", "india"],
      ["antartida", "australia"],
    ],
    icono: (
      <>
        <path d="M6 20 Q12 16 16 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M15 13 Q16 2 30 2 Q36 3 35 8 Q32 16 15 13 Z" />
        <path d="M15.5 12.6 Q24 8 34 4.5" stroke="#cdeccf" strokeWidth="1" fill="none" />
      </>
    ),
  },
  {
    id: "listrosaurio",
    nombre: "Listrosaurio",
    color: "#7b3fb0",
    franja: "M214 168 L256 142 L280 156 L280 222",
    uniones: [
      ["africa", "india"],
      ["india", "antartida"],
    ],
    icono: (
      <>
        <path d="M4 12 Q4 6 12 6 L24 6 Q30 6 31 9 L35 8 Q39 9 38 13 L35 16 Q33 17 32 15 L31 13 Q30 15 27 15 L27 20 L23 20 L23 15.5 L14 15.5 L14 20 L10 20 L10 15 Q6 15 4 12 Z" />
        <path d="M34 14 L33.5 18" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="34" cy="10" r="0.9" fill="#fff" />
      </>
    ),
  },
  {
    id: "cinognato",
    nombre: "Cinognato",
    color: "#e8590c",
    franja: "M112 150 L206 144",
    uniones: [["america-sur", "africa"]],
    icono: (
      <>
        <path d="M2 9 Q8 10 11 8 Q14 6 20 6.5 L27 6.5 Q30 4 34 4.5 Q39 5.5 39 8 L35 9 L38 11 Q35 13 31 11.5 Q29 12.5 28 14 L28 21 L25 21 L24.5 14.5 L15 14.5 L14 21 L11 21 L11.5 13 Q8 12 2 9 Z" />
        <path d="M35.5 9.2 L35 11.2 M37 9.4 L36.6 10.8" stroke="#fff" strokeWidth="0.9" strokeLinecap="round" />
        <circle cx="33" cy="6.8" r="0.9" fill="#fff" />
      </>
    ),
  },
];

// Otra pista que no es un fósil: la cordillera de los Apalaches sigue en Escocia y Noruega.
const MONTES = (() => {
  const [ax, ay] = [124, 104];
  const [bx, by] = [198, 20];
  const n = 11;
  let d = "";
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = ax + (bx - ax) * t;
    const y = ay + (by - ay) * t;
    d += `M${(x - 4).toFixed(1)} ${(y + 3).toFixed(1)} L${x.toFixed(1)} ${(y - 4).toFixed(1)} L${(x + 4).toFixed(1)} ${(y + 3).toFixed(1)} `;
  }
  return d.trim();
})();
const ESPANA: Punto = [176, 84]; // la península ibérica, pegada a Terranova

// Orden del estante: revuelto, para que no salgan en el orden del mapa.
const ORDEN_ESTANTE: IdPieza[] = ["india", "america-norte", "antartida", "africa", "australia", "america-sur", "eurasia"];

/** Una pieza con sus franjas, recortadas por su propio contorno. */
function Continente({ c, recorte }: { c: Continente; recorte: string }) {
  const { d } = FORMA[c.id];
  return (
    <g>
      <defs>
        <clipPath id={recorte}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={c.color} />
      <g clipPath={`url(#${recorte})`}>
        {FOSILES.map((f) => (
          <g key={f.id} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={f.franja} stroke="#fff" strokeOpacity="0.85" strokeWidth="11" />
            <path d={f.franja} stroke={f.color} strokeWidth="8" />
          </g>
        ))}
        <path d={MONTES} fill="none" stroke="#7a5230" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx={ESPANA[0]} cy={ESPANA[1]} r="2.4" fill="#7a1f12" />
      </g>
      <path d={d} fill="none" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    </g>
  );
}

const unido = (f: Fosil, puestas: IdPieza[]) => f.uniones.some(([a, b]) => puestas.includes(a) && puestas.includes(b));

export default function PangeaConPistas({ parada }: { parada: ContenidoParada }) {
  const [frases] = useState(() => {
    const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
    return {
      inicio: dicho("Al empezar"),
      fallo: dicho("Fallo"),
      final: dicho("Al terminar"),
      pieza: Object.fromEntries(CONTINENTES.map((c) => [c.id, dicho(c.nombre)])) as Record<IdPieza, Dicho>,
      fosil: Object.fromEntries(FOSILES.map((f) => [f.id, dicho(f.nombre)])) as Record<IdFosil, Dicho>,
    };
  });
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [puestas, setPuestas] = useState<IdPieza[]>([]);
  const [sacudida, setSacudida] = useState<string | null>(null);
  const [cerrado, setCerrado] = useState(false); // Pangea completa: Alba termina de explicar
  const refs = useRef(
    Object.fromEntries(CONTINENTES.map((c) => [c.id, createRef<HTMLElement>()])) as Record<IdPieza, RefObject<HTMLElement | null>>,
  );
  // Cada jugada abre un turno nuevo: lo que quedara por decir del anterior se descarta.
  const turno = useRef(0);
  const explicados = useRef<IdFosil[]>([]);
  const seguro = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const temblor = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      turno.current++;
      clearTimeout(seguro.current);
      clearTimeout(temblor.current);
    },
    [],
  );

  /** Alba dice las frases una tras otra. Un fósil cuenta como explicado cuando acaba su frase. */
  const hablar = (lista: { d: Dicho; fosil?: IdFosil }[], alAcabar?: () => void) => {
    const mio = ++turno.current;
    const paso = (i: number) => {
      const { d, fosil } = lista[i];
      decir(d, () => {
        if (mio !== turno.current) return;
        if (fosil && !explicados.current.includes(fosil)) explicados.current = [...explicados.current, fosil];
        if (i + 1 < lista.length) paso(i + 1);
        else alAcabar?.();
      });
    };
    paso(0);
  };

  const colocar = (id: string, hueco: IdPieza) => {
    if (acabado || cerrado) return;
    if (id !== hueco || puestas.includes(hueco)) {
      setSacudida(id);
      clearTimeout(temblor.current);
      temblor.current = setTimeout(() => setSacudida(null), 500);
      turno.current++;
      decir(frases.fallo);
      return;
    }
    const nuevas = [...puestas, hueco];
    setPuestas(nuevas);
    // Fósiles unidos que Alba aún no ha explicado, en el orden de la leyenda.
    const porExplicar = FOSILES.filter((f) => unido(f, nuevas) && !explicados.current.includes(f.id)).map((f) => ({
      d: frases.fosil[f.id],
      fosil: f.id,
    }));
    const dePieza = { d: frases.pieza[hueco] };
    if (nuevas.length < CONTINENTES.length) return hablar([dePieza, ...porExplicar]);

    // Pangea completa.
    if (!porExplicar.length) return terminar(dePieza.d, frases.final);
    ganarPegatina(parada.id);
    setCerrado(true);
    const ultimo = porExplicar[porExplicar.length - 1].d;
    const lista = [dePieza, ...porExplicar.slice(0, -1)];
    // Por si la voz nunca avisa de que ha acabado: lo que tardaría en decirlo todo, con margen.
    const tope = [...lista.map((x) => x.d), ultimo].reduce((t, d) => t + 5000 + 100 * d.texto.length, 0);
    seguro.current = setTimeout(() => terminar(ultimo, frases.final), tope);
    hablar(lista, () => {
      clearTimeout(seguro.current);
      terminar(ultimo, frases.final);
    });
  };

  // La pieza «encaja» en su propia sombra si aún está libre (ver useArrastre).
  const encaja = (id: string, hueco: IdPieza) => id === hueco && !puestas.includes(hueco);
  const { arrastre, elegida, sobre, pieza, tocarDestino } = useArrastre<IdPieza>(refs.current, colocar, encaja);
  const completo = puestas.length === CONTINENTES.length;

  return (
    <MarcoReto parada={parada.id} titulo={parada.reto ?? "Pangea con pistas"} mensaje={mensaje} decir={decir} final={final} pose="senala">
      <svg
        className={`puzle pangea-pistas ${completo ? "completo" : ""}`}
        viewBox="0 0 360 256"
        role="img"
        aria-label="Pangea con siete huecos y Madagascar ya puesta"
        onClick={(e) => {
          // Tocar una sombra con una pieza elegida (como en el motor Puzle): si las zonas se
          // solapan, gana aquella en la que encaja la pieza elegida y, si no, la más cercana.
          const m = e.currentTarget.getScreenCTM();
          if (!m) return;
          const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
          const dentro = CONTINENTES.filter(({ id }) => {
            const z = FORMA[id].zona;
            return q.x >= z.x && q.x <= z.x + z.width && q.y >= z.y && q.y <= z.y + z.height;
          });
          const centro = (id: IdPieza) => {
            const z = FORMA[id].zona;
            return Math.hypot(q.x - z.x - z.width / 2, q.y - z.y - z.height / 2);
          };
          const buena = (id: IdPieza) => Number(!!elegida && encaja(elegida, id));
          const h = dentro.sort((a, b) => buena(b.id) - buena(a.id) || centro(a.id) - centro(b.id))[0];
          if (h) tocarDestino(h.id);
        }}
      >
        <rect width="360" height="256" fill="#6fb3d6" />
        <path d={MADAGASCAR} fill="#b9b2a4" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
        {CONTINENTES.map((c) => {
          const lleno = puestas.includes(c.id);
          return (
            <g
              key={c.id}
              className={`puzle-hueco ${lleno ? "lleno" : ""} ${sobre === c.id ? "sobre" : ""} ${elegida && !lleno ? "esperando" : ""}`}
            >
              {lleno ? <Continente c={c} recorte={`pangea-pistas-${c.id}`} /> : <path d={FORMA[c.id].d} className="sombra-pieza" />}
              <rect ref={refs.current[c.id] as unknown as RefObject<SVGRectElement>} {...FORMA[c.id].zona} fill="transparent" />
            </g>
          );
        })}
      </svg>

      <ul className="pangea-pistas-leyenda" aria-label="Los fósiles de las franjas">
        {FOSILES.map((f) => {
          const si = unido(f, puestas);
          return (
            <li key={f.id} className={si ? "unido" : ""} style={{ borderColor: f.color }}>
              <svg viewBox="0 0 40 24" fill={f.color} style={{ color: f.color }} aria-hidden="true">
                {f.icono}
              </svg>
              <span>
                {si ? "✔ " : ""}
                {f.nombre}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="estante pangea-pistas-estante">
        <div className="piezas">
          {ORDEN_ESTANTE.map((id) => {
            const c = CONTINENTES.find((x) => x.id === id)!;
            const z = FORMA[id].zona;
            return puestas.includes(id) ? (
              <span key={id} className="pieza hueco" />
            ) : (
              <button
                key={id}
                className={`pieza ${arrastre?.id === id ? "moviendo" : ""} ${elegida === id ? "elegida" : ""} ${sacudida === id ? "sacudida" : ""}`}
                {...pieza(id)}
              >
                <span className="pieza-dibujo">
                  <svg viewBox={`${z.x - 2} ${z.y - 2} ${z.width + 4} ${z.height + 4}`} aria-hidden="true">
                    <Continente c={c} recorte={`pangea-pistas-mini-${id}`} />
                  </svg>
                </span>
                <span className="pieza-nombre">{c.nombre}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="nota">Arrastra cada trozo hasta su sombra. Pista: las franjas de colores siguen de un trozo a su vecino.</p>
    </MarcoReto>
  );
}
