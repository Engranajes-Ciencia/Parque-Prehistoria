import { useRef, useState } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { dichoDelReto, dichosDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";
import "./PaseabaOCorria.css";

// Parada 9, reto para mayores. Tres rastros fósiles del mismo terópodo (carnívoro de tres
// dedos), vistos desde arriba, cada uno con una zancada distinta. La zancada es la distancia
// entre dos huellas seguidas DEL MISMO PIE (dos pasos): de la huella del círculo a la de la
// bandera; la del otro pie queda en medio. Se mide con «patas»: una pata es la altura de la
// cadera, que los paleontólogos estiman en unas cuatro veces el largo de la huella (Alexander,
// 1976); por eso aquí la huella mide un cuarto de pata. Zancada relativa (zancada / altura de
// la cadera): por debajo de 2, al paso; de 2 a 2,9, al trote; por encima de 2,9, a la carrera
// (Thulborn, 1990). En pantalla se redondea a «más de 3», y los tres rastros (1,5; 2,5 y 3,6)
// quedan lejos de los límites para que no haya duda posible.
//
// Se empieza con una pata puesta junto a la primera huella; «+ 1 pata» pone otra a
// continuación hasta pasar la bandera. Solo entonces se puede elegir. Un fallo no borra nada:
// se puede volver a contar.

type Paso = "paseaba" | "trote" | "corria";

const ANCHO = 360;
const ALTO = 200;
const PATA = 80; // altura de la cadera, en unidades del dibujo
const HUELLA = PATA / 4; // largo de la huella
const X0 = 18; // talón de la huella de salida
const Y_IZQ = 114; // huellas del pie izquierdo (el dinosaurio camina hacia la derecha)
const Y_DER = 134; // huellas del pie derecho
const Y_PATAS = 166; // la fila de patas de medir

// Primero el más fácil, luego el contraste, y el trote (el del medio) al final.
const RASTROS: { zancada: number; paso: Paso }[] = [
  { zancada: 1.5, paso: "paseaba" },
  { zancada: 3.6, paso: "corria" },
  { zancada: 2.5, paso: "trote" },
];

const OPCIONES: { paso: Paso; nombre: string; regla: string }[] = [
  { paso: "paseaba", nombre: "Paseaba", regla: "menos de 2" },
  { paso: "trote", nombre: "Iba al trote", regla: "entre 2 y 3" },
  { paso: "corria", nombre: "Corría", regla: "más de 3" },
];

// Barro con algunas piedrecillas (fijas: el dibujo sale igual siempre).
const CHINAS = [
  [40, 158],
  [112, 150],
  [150, 98],
  [232, 152],
  [298, 100],
  [334, 156],
  [74, 100],
];

/** Huella de terópodo vista desde arriba, de HUELLA de largo: talón en (x, y), dedos hacia la derecha. */
function Huella({ x, y, marcada }: { x: number; y: number; marcada: boolean }) {
  const color = marcada ? "#5a3b1f" : "#8f6a45";
  return (
    <g transform={`translate(${x} ${y})`} stroke={color} strokeLinecap="round" fill="none">
      <ellipse cx="4.5" cy="0" rx="4.5" ry="3.6" fill={color} stroke="none" />
      {/* Tres dedos finos… */}
      <path d="M5 0 L17 0 M5 -1 L13.5 -6.5 M5 1 L13.5 6.5" strokeWidth="3.2" />
      {/* …acabados en garra. */}
      <path d="M17 0 L20 0 M13.5 -6.5 L15.8 -8.2 M13.5 6.5 L15.8 8.2" strokeWidth="1.4" />
    </g>
  );
}

export default function PaseabaOCorria({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  /** Todas las frases alternativas de una etiqueta, que se turnan. */
  const varios = (e: string) => {
    dicho(e); // falla si el guion no la tiene, como las demás (dichosDelReto daría una lista vacía)
    return dichosDelReto(parada.guion, parada.id, e);
  };
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: varios("Fallo"),
    final: dicho("Al terminar"),
    acierto: {
      paseaba: dicho("Paseaba"),
      trote: dicho("Al trote"),
      corria: dicho("Corría"),
    } as Record<Paso, Dicho>,
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [indice, setIndice] = useState(0);
  const [patas, setPatas] = useState(1);
  const [acertado, setAcertado] = useState<Paso | null>(null);
  const [sacudida, setSacudida] = useState<Paso | null>(null);
  const bloqueo = useRef(false); // entre un acierto y el rastro siguiente no se toca nada
  const fallos = useRef(0);

  const rastro = RASTROS[indice];
  const zancada = rastro.zancada * PATA;
  const xFin = X0 + zancada; // talón de la huella de la bandera
  const maximo = Math.ceil(rastro.zancada); // patas que hacen falta para pasarla
  const medido = patas >= rastro.zancada;
  const dentro = Math.floor(rastro.zancada); // la pata (desde 0) en la que cae la bandera

  // Las huellas del rastro, un paso (media zancada) entre cada una, alternando los pies.
  const huellas: { k: number; x: number }[] = [];
  for (let k = -2; X0 + (k * zancada) / 2 < ANCHO; k++) {
    const x = X0 + (k * zancada) / 2;
    if (x + HUELLA > 0) huellas.push({ k, x });
  }

  const poner = () => {
    if (acabado || medido || bloqueo.current) return;
    setPatas((n) => Math.min(n + 1, maximo));
  };

  const elegir = (p: Paso) => {
    if (acabado || !medido || bloqueo.current) return;
    if (p !== rastro.paso) {
      setSacudida(p);
      setTimeout(() => setSacudida(null), 450);
      decir(frases.fallo[fallos.current++ % frases.fallo.length]);
      return;
    }
    bloqueo.current = true;
    setAcertado(p);
    if (indice === RASTROS.length - 1) return terminar(frases.acierto[p], frases.final);
    // El rastro siguiente llega cuando Alba acaba de explicar este.
    decir(frases.acierto[p], () => {
      setIndice((i) => i + 1);
      setPatas(1);
      setAcertado(null);
      bloqueo.current = false;
    });
  };

  return (
    <MarcoReto parada={parada.id} titulo={parada.reto ?? "¿Paseaba o corría?"} mensaje={mensaje} decir={decir} final={final} pose="lupa">
      <svg
        className="zancada-vista"
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        role="img"
        aria-label={`Rastro ${indice + 1} de ${RASTROS.length}: huellas de un dinosaurio carnívoro y ${patas} ${patas === 1 ? "pata" : "patas"} de medir`}
      >
        <defs>
          <clipPath id="zancada-barro">
            <rect y="86" width={ANCHO} height={ALTO - 86} />
          </clipPath>
        </defs>

        {/* Arriba: qué es «una pata». La cadera del dibujo está en (126, 36) y los pies en y = 80. */}
        <rect width={ANCHO} height="86" fill="#eaf3ee" />
        <line x1="56" y1="80.5" x2="194" y2="80.5" stroke="#b39568" strokeWidth="2" strokeLinecap="round" />
        <image href="img/p09/teropodo.webp" x="62" y="4" width="120" height="78.4" />
        <line x1="106" y1="36" x2="126" y2="36" stroke="#5a3b1f" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect x="92" y="36" width="14" height="44" rx="3" fill="#e0a526" stroke="#8a5a12" strokeWidth="1.5" />
        <text x="99" y="58" transform="rotate(-90 99 58)" textAnchor="middle" dominantBaseline="central" className="zancada-rotulo-pata">
          1 pata
        </text>
        <text x="200" y="20" className="zancada-explica">
          1 pata = su pierna,
        </text>
        <text x="200" y="35" className="zancada-explica">
          del suelo a la cadera
        </text>
        <text x="200" y="60" className="zancada-cuantas">
          Patas: {patas}
        </text>
        <text x="200" y="77" className="zancada-rastro-num">
          Rastro {indice + 1} de {RASTROS.length}
        </text>

        {/* Abajo: el barro, con el rastro y las patas de medir. key: cada rastro entra con su animación. */}
        <rect y="86" width={ANCHO} height={ALTO - 86} fill="#cdb083" />
        <g key={indice} className="zancada-rastro" clipPath="url(#zancada-barro)">
          {CHINAS.map(([cx, cy]) => (
            <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx="3" ry="2" fill="#bb9b6c" />
          ))}

          {huellas.map(({ k, x }) => (
            <Huella key={k} x={x} y={k % 2 === 0 ? Y_DER : Y_IZQ} marcada={k === 0 || k === 2} />
          ))}

          {/* Desde aquí (círculo)… */}
          <line x1={X0} y1="96" x2={X0} y2="190" stroke="#e0a526" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx={X0} cy="96" r="5" fill="#e0a526" stroke="#fff" strokeWidth="1.5" />
          {/* …hasta aquí (bandera): la huella siguiente del mismo pie. */}
          <line
            x1={xFin}
            y1="92"
            x2={xFin}
            y2="190"
            stroke={medido ? "#1d6f65" : "#c8553d"}
            strokeWidth={medido ? 3 : 2}
            strokeDasharray={medido ? undefined : "4 4"}
          />
          <polygon points={`${xFin},91 ${xFin + 14},96 ${xFin},101`} fill={medido ? "#1d6f65" : "#c8553d"} />

          {Array.from({ length: patas }, (_, i) => (
            <g key={i} className={`zancada-pata ${medido && i === dentro ? "zancada-pata-clave" : ""}`}>
              <rect
                x={X0 + i * PATA + 1}
                y={Y_PATAS}
                width={PATA - 2}
                height="16"
                rx="5"
                fill={i % 2 === 0 ? "#e0a526" : "#c8553d"}
                stroke={i % 2 === 0 ? "#8a5a12" : "#7d2f20"}
                strokeWidth="1.5"
              />
              <text x={X0 + i * PATA + PATA / 2} y={Y_PATAS + 12} textAnchor="middle" className="zancada-numero">
                {i + 1}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <p className="zancada-cuenta" aria-live="polite">
        {medido ? `Más de ${dentro} ${dentro === 1 ? "pata" : "patas"}, pero menos de ${dentro + 1}.` : "Poned patas hasta pasar la bandera."}
      </p>
      <button className="boton grande zancada-poner" onClick={poner} disabled={acabado || medido}>
        {medido ? "¡Medido!" : "+ 1 pata"}
      </button>

      <div className="zancada-opciones">
        {OPCIONES.map((o) => (
          <button
            key={o.paso}
            className={`boton zancada-opcion ${acertado === o.paso ? "acertada" : ""} ${sacudida === o.paso ? "sacudida" : ""}`}
            onClick={() => elegir(o.paso)}
            disabled={acabado || !medido || !!acertado}
          >
            <strong>{o.nombre}</strong>
            <small>{o.regla}</small>
          </button>
        ))}
      </div>
    </MarcoReto>
  );
}
