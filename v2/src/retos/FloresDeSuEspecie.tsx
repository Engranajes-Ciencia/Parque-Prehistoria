import { createRef, useRef, useState, type RefObject } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { useArrastre } from "../componentes/useArrastre";
import { dichoDelReto, dichosDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";
import "./FloresDeSuEspecie.css";

// Parada 6, reto para mayores: «Flores de su especie». Como PolinizaLasFlores, pero con seis
// flores de tres especies: cerezo, naranjo (el azahar; en la parada hay un naranjo) y amapola,
// dos de cada una. La abeja se lleva de flor en flor (arrastrándola, o tocándola y luego la
// flor) y se queda posada en la última que visitó: lleva SU polen, y el circulito de la abeja
// dice de qué flor es. Al llegar a una flor:
//  - con polen de otra flor de la misma especie, la flor queda polinizada;
//  - con polen de otra especie, no pasa nada («Otra especie»);
//  - con polen de esa misma flor, tampoco («Con su propio polen»).
// En los tres casos la abeja come y se lleva el polen de esa flor. Cuando las seis están
// polinizadas se caen los pétalos y cada una enseña su fruto: cereza, naranja y la cápsula de
// la amapola, que también es un fruto (seco).
//
// Rigor (no se dice en voz alta; lo recoge el guion):
//  - El cerezo dulce y la amapola son, en general, autoincompatibles: necesitan polen de OTRA
//    planta de su especie. Por eso cada flor lleva su propio tallo: son plantas distintas.
//  - El naranjo dulce, en cambio, se apaña con su propio polen (y hay variedades que dan
//    naranjas sin semillas sin polinizar). El juego no cuenta el polen propio en ninguna
//    especie; por eso la frase «Con su propio polen» dice que muchas plantas lo necesitan de
//    otra, no que esta flor lo necesite.
//  - La amapola no da néctar: la abeja come su polen. Por eso Alba dice «come», no «bebe».
//  - De la flor al fruto pasan semanas o meses: Alba dice «con el tiempo».

type Especie = "cerezo" | "naranjo" | "amapola";

const NOMBRE: Record<Especie, { flor: string; polen: string; fruto: string }> = {
  cerezo: { flor: "Flor de cerezo", polen: "polen de cerezo", fruto: "cereza" },
  naranjo: { flor: "Azahar, la flor del naranjo", polen: "polen de azahar", fruto: "naranja" },
  amapola: { flor: "Amapola", polen: "polen de amapola", fruto: "cápsula de amapola" },
};

// Dos de cada especie, sin repetir especie en la misma columna ni en la misma fila.
const FLORES: { id: string; especie: Especie; x: number; y: number }[] = [
  { id: "f1", especie: "cerezo", x: 17, y: 25 },
  { id: "f2", especie: "amapola", x: 50, y: 25 },
  { id: "f3", especie: "naranjo", x: 83, y: 25 },
  { id: "f4", especie: "naranjo", x: 17, y: 75 },
  { id: "f5", especie: "cerezo", x: 50, y: 75 },
  { id: "f6", especie: "amapola", x: 83, y: 75 },
];
const especieDe = (id: string) => FLORES.find((f) => f.id === id)!.especie;

/** La flor de cada especie: la ilustración del cerezo y dos dibujos sencillos. */
function DibujoFlor({ especie }: { especie: Especie }) {
  if (especie === "cerezo") return <img src="img/p06/flor.webp" alt="" draggable={false} />;
  if (especie === "naranjo")
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((k) => (
          <ellipse
            key={k}
            cx="50"
            cy="27"
            rx="14"
            ry="23"
            fill="#fffdf4"
            stroke="#cfc5a8"
            strokeWidth="2.5"
            transform={`rotate(${k * 72} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="14" fill="#f6eab4" />
        {Array.from({ length: 10 }, (_, k) => {
          const a = (k * Math.PI) / 5;
          return (
            <circle
              key={k}
              cx={(50 + 13 * Math.cos(a)).toFixed(1)}
              cy={(50 + 13 * Math.sin(a)).toFixed(1)}
              r="3"
              fill="#f2c230"
              stroke="#c99a14"
              strokeWidth="1"
            />
          );
        })}
        <circle cx="50" cy="50" r="6" fill="#b9cf62" stroke="#7d9a2c" strokeWidth="2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      {/* Cuatro pétalos rojos: primero los de arriba y abajo, encima los de los lados. */}
      {[
        [50, 31],
        [50, 69],
        [31, 50],
        [69, 50],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="25" fill="#e3392c" stroke="#a8231a" strokeWidth="2.5" />
      ))}
      <circle cx="50" cy="50" r="16" fill="#2a2024" />
      {Array.from({ length: 12 }, (_, k) => {
        const a = (k * Math.PI) / 6;
        return <circle key={k} cx={(50 + 12 * Math.cos(a)).toFixed(1)} cy={(50 + 12 * Math.sin(a)).toFixed(1)} r="2.2" fill="#5d5476" />;
      })}
      <circle cx="50" cy="50" r="7" fill="#9bb07a" stroke="#5f7340" strokeWidth="2" />
    </svg>
  );
}

/** El fruto de cada especie: el ovario de la flor, ya crecido. */
function DibujoFruto({ especie }: { especie: Especie }) {
  if (especie === "cerezo") return <img src="img/p06/cereza.webp" alt="" draggable={false} />;
  if (especie === "naranjo")
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 26 Q52 16 58 10" stroke="#6b4f2a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="68" cy="14" rx="14" ry="6" transform="rotate(-25 68 14)" fill="#4f9a3a" stroke="#2f6b24" strokeWidth="2" />
        <circle cx="50" cy="60" r="34" fill="#f39c1f" stroke="#c46f0a" strokeWidth="3" />
        <ellipse cx="38" cy="47" rx="10" ry="6" transform="rotate(-30 38 47)" fill="#ffd27a" opacity="0.75" />
        {[
          [62, 52],
          [56, 74],
          [40, 70],
          [70, 66],
          [48, 58],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#d9800c" />
        ))}
        <circle cx="50" cy="27" r="3.5" fill="#7a8f3a" />
      </svg>
    );
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 96 V80" stroke="#6f8f45" strokeWidth="5" strokeLinecap="round" />
      <path d="M28 40 Q24 74 50 84 Q76 74 72 40 Z" fill="#a9b98a" stroke="#6f7f50" strokeWidth="3" />
      <ellipse cx="50" cy="36" rx="25" ry="8" fill="#7f8f5a" stroke="#56653a" strokeWidth="3" />
      {Array.from({ length: 8 }, (_, k) => {
        const a = (k * Math.PI) / 4;
        return (
          <line
            key={k}
            x1="50"
            y1="36"
            x2={(50 + 22 * Math.cos(a)).toFixed(1)}
            y2={(36 + 7 * Math.sin(a)).toFixed(1)}
            stroke="#56653a"
            strokeWidth="2"
          />
        );
      })}
      <circle cx="50" cy="36" r="3" fill="#56653a" />
    </svg>
  );
}

export default function FloresDeSuEspecie({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    suya: dichosDelReto(parada.guion, parada.id, "Polen de su especie"),
    otra: dicho("Otra especie"),
    propio: dicho("Con su propio polen"),
    ultima: dicho("Última flor"),
    final: dicho("Al terminar"),
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);

  // La flor de la que viene el polen que lleva la abeja (y donde está posada); al principio, ninguna.
  const [carga, setCarga] = useState<string | null>(null);
  const [polinizadas, setPolinizadas] = useState<string[]>([]);
  const [visitas, setVisitas] = useState(0);
  const [rechazo, setRechazo] = useState<{ id: string; n: number } | null>(null);
  // En refs, además: dos visitas en el mismo instante deben ver cada una lo que dejó la otra.
  const lleva = useRef<string | null>(null);
  const hechas = useRef<string[]>([]);
  const dichas = useRef(0);
  const rechazos = useRef(0);

  const refs = useRef<Record<string, RefObject<HTMLElement | null>>>(
    Object.fromEntries(FLORES.map((f) => [f.id, createRef<HTMLElement>()])),
  );

  const visitar = (_abeja: string, id: string) => {
    if (acabado || hechas.current.length === FLORES.length) return;
    const antes = lleva.current;
    lleva.current = id;
    setCarga(id);
    setVisitas((v) => v + 1);
    // La primera flor, o una ya polinizada: la abeja come y se lleva su polen, sin más.
    if (antes === null || hechas.current.includes(id)) return;
    if (antes === id) return decir(frases.propio);
    if (especieDe(antes) !== especieDe(id)) {
      setRechazo({ id, n: rechazos.current++ });
      return decir(frases.otra);
    }
    hechas.current = [...hechas.current, id];
    setPolinizadas(hechas.current);
    if (hechas.current.length === FLORES.length) terminar(frases.ultima, frases.final);
    else if (frases.suya.length) decir(frases.suya[dichas.current++ % frases.suya.length]);
  };

  const { arrastre, elegida, sobre, pieza, tocarDestino } = useArrastre(refs.current, visitar);

  // Posada en su flor, hacia el centro del prado para no salirse; al principio, en medio.
  const posada = carga ? FLORES.find((f) => f.id === carga)! : null;
  const sitioAbeja = posada
    ? { left: `${posada.x + (posada.x > 60 ? -11 : 11)}%`, top: `${posada.y - 12}%` }
    : { left: "50%", top: "50%" };
  const abeja = pieza("abeja");
  const lo = carga ? especieDe(carga) : null;

  return (
    <MarcoReto
      parada={parada.id}
      titulo={parada.reto ?? "Flores de su especie"}
      mensaje={mensaje}
      decir={decir}
      final={final}
      // La hoja final tapa el prado: los frutos se enseñan también dentro de ella.
      recuerdo={
        <div className="especies-recuerdo" aria-label="Las flores ya son frutos: cerezas, naranjas y cápsulas de amapola">
          {FLORES.map((f) => (
            <span key={f.id}>
              <DibujoFruto especie={f.especie} />
            </span>
          ))}
        </div>
      }
    >
      <div className="especies-prado">
        {FLORES.map((f) => {
          const hecha = polinizadas.includes(f.id);
          const sacudida = rechazo?.id === f.id ? `especies-no-${rechazo.n % 2}` : "";
          return (
            <button
              key={f.id}
              ref={refs.current[f.id] as RefObject<HTMLButtonElement>}
              className={[
                "especies-flor",
                sobre === f.id ? "especies-sobre" : "",
                elegida ? "especies-esperando" : "",
                hecha && !acabado ? "especies-polinizada" : "",
              ].join(" ")}
              data-especie={f.especie}
              style={{ left: `${f.x}%`, top: `${f.y}%` }}
              onClick={() => tocarDestino(f.id)}
              aria-label={
                acabado
                  ? `${NOMBRE[f.especie].fruto[0].toUpperCase()}${NOMBRE[f.especie].fruto.slice(1)}`
                  : `${NOMBRE[f.especie].flor}${hecha ? ", con polen de su especie" : ""}`
              }
            >
              {acabado ? (
                <>
                  <span className="especies-fruto">
                    <DibujoFruto especie={f.especie} />
                  </span>
                  <span className="especies-petalos" aria-hidden="true">
                    <DibujoFlor especie={f.especie} />
                  </span>
                </>
              ) : (
                <span className={`especies-dibujo ${sacudida}`}>
                  <DibujoFlor especie={f.especie} />
                  {hecha && <span className="especies-polen" aria-hidden="true" />}
                </span>
              )}
            </button>
          );
        })}
        {!acabado && (
          <button
            {...abeja}
            className={[
              "especies-abeja",
              arrastre ? "especies-moviendo" : "",
              elegida ? "especies-elegida" : "",
              visitas ? `especies-posa-${visitas % 2}` : "",
            ].join(" ")}
            style={{ ...sitioAbeja, ...abeja.style }}
            aria-label={lo ? `La abeja, con ${NOMBRE[lo].polen}` : "La abeja, todavía sin polen"}
          >
            <img src="img/p06/abeja.webp" alt="" draggable={false} />
            {lo && (
              <span className="especies-carga" data-especie={lo} aria-hidden="true">
                <DibujoFlor especie={lo} />
              </span>
            )}
          </button>
        )}
      </div>
      <p className="nota especies-nota">Lleva la abeja de flor en flor. En su circulito ves de qué flor es el polen que lleva.</p>
    </MarcoReto>
  );
}
