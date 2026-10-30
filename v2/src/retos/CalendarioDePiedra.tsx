import { useEffect, useRef, useState } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { dichoDelReto } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";
import "./CalendarioDePiedra.css";

// Parada 21, reto para mayores. Vista a la altura de los ojos desde el centro de Stonehenge:
// primero hacia el nordeste, al amanecer; después, hacia el suroeste, al atardecer. La
// posición horizontal de cada cosa es su acimut (grados desde el norte, hacia el este), seis
// píxeles por grado. Al cambiar el día con la barra, el sol sale (o se pone) por otro sitio
// del horizonte, y hay que encontrar los dos días en que lo hace por el eje del monumento:
// el solsticio de verano al amanecer y el de invierno al atardecer.
//
// Cuentas: acimut de la salida A = arccos(sen δ / cos φ), con φ = 51,18° N (Stonehenge) y la
// declinación del sol δ = 23,44° · sen(2π · (284 + N) / 365), N = día del año (fórmula de
// Cooper, año de 365 días). La puesta, por simetría, en 360° − A. SIMPLIFICACIÓN: se ignoran
// la refracción de la atmósfera y la altura del horizonte, que mueven el punto de salida del
// orden de un grado; al juego no le cambia nada. Con estas cuentas el sol del solsticio de
// verano sale a 50,6° y el del de invierno se pone a 230,6°: la dirección justo opuesta, el
// mismo eje. (El encargo decía 229,4° para el invierno, pero la puesta nunca baja de 230,6°:
// con ese número el juego no se podría ganar.) Hace 4.500 años el eje de la Tierra estaba algo
// más inclinado (unos 23,9°) y el sol del solsticio salía como un grado más a la izquierda.
//
// Escena esquemática, no un plano: las piedras del círculo exterior, más estrechas y con más
// hueco que las de verdad, para que el sol se vea entre ellas. La Piedra del Talón queda un
// poco a la derecha del eje, como hoy: el sol del solsticio asoma justo a su izquierda. En el
// suroeste, el Gran Trilito entero, como debió de ser (hoy uno de sus pilares está caído).

type Vista = "amanecer" | "atardecer";

const LATITUD = 51.18; // Stonehenge, grados norte
const OBLICUIDAD = 23.44; // inclinación del eje de la Tierra, hoy
const RAD = Math.PI / 180;

/** Declinación del sol el día N del año (fórmula de Cooper). */
const declinacion = (n: number) => OBLICUIDAD * Math.sin((2 * Math.PI * (284 + n)) / 365);

/** Acimut de la salida del sol con esa declinación, en grados desde el norte hacia el este. */
const acimut = (d: number) => Math.acos(Math.sin(d * RAD) / Math.cos(LATITUD * RAD)) / RAD;

/** El eje del monumento: por donde sale el sol en el solsticio de verano (≈ 50,6°). */
const EJE = acimut(OBLICUIDAD);
/** Cuánto puede apartarse el sol del eje para contar como alineado (unos nueve días a cada lado). */
const TOLERANCIA = 0.6;

const ANCHO = 360;
const ALTO = 200;
const HORIZONTE = 132;
const GRADOS = 60; // lo que abarca la vista
const PX = ANCHO / GRADOS; // píxeles por grado

const VISTAS: Record<Vista, { desde: number; eje: number; rotulo: string; fuera: string }> = {
  amanecer: { desde: 20, eje: EJE, rotulo: "Nordeste · amanecer", fuera: "sale" },
  atardecer: { desde: 200, eje: EJE + 180, rotulo: "Suroeste · atardecer", fuera: "se pone" },
};
// El eje cae en el mismo sitio del dibujo en las dos vistas (≈ 184 px).
const X_EJE = (EJE - VISTAS.amanecer.desde) * PX;
const X_TALON = (52 - VISTAS.amanecer.desde) * PX;

// Círculo exterior: pilares de 34 px separados 30, y el hueco del eje, más ancho (40), para
// que se vea cuál es la entrada.
const PILAR = 34;
const HUECO = 30;
const PUERTA = 40;
const PILARES = [0, 1, 2].flatMap((k) => {
  const d = PUERTA / 2 + PILAR / 2 + k * (PILAR + HUECO);
  return [X_EJE - d, X_EJE + d];
});
// Gran Trilito (solo en el suroeste): más cerca, más alto y con el hueco justo para el sol.
const GT_PILAR = 44;
const GT_HUECO = 28;

// Los mismos colores que ReconstruyeStonehenge.
const PIEDRA = "#9a958a";
const BORDE = "#5f5a50";
const TALON = "#a8977a";

const DIAS_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** 111 → «21 de abril». */
function fecha(n: number): string {
  let d = n;
  for (let m = 0; m < 12; m++) {
    if (d <= DIAS_MES[m]) return `${d} de ${MESES[m]}`;
    d -= DIAS_MES[m];
  }
  return "31 de diciembre";
}

// Se empieza el 19 de abril: el sol se ve, a la derecha, en un hueco entre dos piedras.
const DIA_INICIAL = 109;
// La barra se comprueba cuando se queda quieta un momento: cruzar junio a toda prisa no cuenta.
const ESPERA = 400;

export default function CalendarioDePiedra({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    moviendo: dicho("Moviendo el sol"),
    verano: dicho("Solsticio de verano"),
    girar: dicho("A mirar el atardecer"),
    invierno: dicho("Solsticio de invierno"),
    final: dicho("Al terminar"),
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [dia, setDia] = useState(DIA_INICIAL);
  const [vista, setVista] = useState<Vista>("amanecer");
  const [verano, setVerano] = useState(false); // ya encontraron el solsticio de verano
  const movido = useRef(false);
  const pista = useRef(false); // la pista de «Moviendo el sol» se da una sola vez

  const v = VISTAS[vista];
  const salida = acimut(declinacion(dia));
  const az = vista === "amanecer" ? salida : 360 - salida;
  const xSol = (az - v.desde) * PX;
  const fuera = xSol > ANCHO + 4 ? "derecha" : xSol < -4 ? "izquierda" : null;
  const x = Math.min(ANCHO - 4, Math.max(4, xSol));
  const alineado = Math.abs(az - v.eje) < TOLERANCIA;

  // Cada vez que la barra se para: ¿está el sol en el eje? El efecto ve el estado del momento.
  useEffect(() => {
    if (!movido.current || acabado) return;
    const t = setTimeout(() => {
      if (alineado && vista === "atardecer") {
        terminar(frases.invierno, frases.final);
      } else if (alineado && !verano) {
        pista.current = true;
        setVerano(true);
        decir(frases.verano);
      } else if (!pista.current) {
        pista.current = true;
        decir(frases.moviendo);
      }
    }, ESPERA);
    return () => clearTimeout(t);
  }, [dia]);

  /** Cambia el día; el año da la vuelta (del 31 de diciembre se pasa al 1 de enero). */
  const cambiar = (n: number) => {
    if (acabado) return;
    movido.current = true;
    setDia(((n - 1 + 365) % 365) + 1);
  };

  const girar = () => {
    if (acabado || vista === "atardecer") return;
    setVista("atardecer");
    decir(frases.girar);
  };

  const flecha = fuera === "derecha" ? `El sol ${v.fuera} mucho más a la derecha →` : `← El sol ${v.fuera} mucho más a la izquierda`;

  return (
    <MarcoReto parada={parada.id} titulo={parada.reto ?? "El calendario de piedra"} mensaje={mensaje} decir={decir} final={final} pose="senala">
      <svg
        className="calendario-vista"
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        role="img"
        aria-label={`Stonehenge visto desde el centro, mirando al ${vista === "amanecer" ? "nordeste al amanecer" : "suroeste al atardecer"} del ${fecha(dia)}`}
      >
        <defs>
          <linearGradient id="calendario-cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={vista === "amanecer" ? "#4f6fa8" : "#3d3f78"} />
            <stop offset="1" stopColor={vista === "amanecer" ? "#f2a672" : "#f08a5d"} />
          </linearGradient>
          <radialGradient id="calendario-halo">
            <stop offset="0" stopColor="#fff1b0" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffcf5a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="calendario-luz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3c4" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ffd36b" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* key: al darse la vuelta, la escena nueva entra con su animación. */}
        <g key={vista} className="calendario-escena">
          <rect width={ANCHO} height={HORIZONTE} fill="url(#calendario-cielo)" />
          {/* El disco, antes que el suelo: el horizonte tapa su mitad de abajo. */}
          <circle cx={x} cy={HORIZONTE - 3} r="10" fill="#ffd54f" />
          <rect y={HORIZONTE} width={ANCHO} height={ALTO - HORIZONTE} fill="#6f8a4c" />

          {/* La Avenida, que sale del círculo por el eje hacia el nordeste. */}
          {vista === "amanecer" && (
            <polygon points={`${X_EJE - 5},${HORIZONTE} ${X_EJE + 5},${HORIZONTE} ${X_EJE + 70},${ALTO} ${X_EJE - 70},${ALTO}`} fill="#86a05e" />
          )}
          {alineado && (
            <polygon
              className="calendario-rayo"
              points={`${x - 5},${HORIZONTE - 4} ${x + 5},${HORIZONTE - 4} ${x + 46},${ALTO} ${x - 46},${ALTO}`}
              fill="url(#calendario-luz)"
            />
          )}
          {vista === "amanecer" && (
            // La Piedra del Talón, lejos, fuera del círculo, un poco inclinada.
            <path
              d={`M${X_TALON - 5} ${HORIZONTE + 5} L${X_TALON + 5} ${HORIZONTE + 5} L${X_TALON + 6} ${HORIZONTE - 12} Q${X_TALON + 2} ${HORIZONTE - 18} ${X_TALON - 3} ${HORIZONTE - 14} Z`}
              fill={TALON}
              stroke={BORDE}
              strokeWidth="1.5"
            />
          )}

          {/* Círculo exterior: pilares y la fila de dinteles por encima. */}
          <g fill={PIEDRA} stroke={BORDE} strokeWidth="2">
            {PILARES.map((c) => (
              <rect key={c} x={c - PILAR / 2} y="64" width={PILAR} height="126" rx="5" />
            ))}
            <rect x="-10" y="54" width={ANCHO + 20} height="14" rx="3" />
          </g>

          {vista === "atardecer" && (
            <g fill="#8d887d" stroke={BORDE} strokeWidth="2">
              <rect x={X_EJE - GT_HUECO / 2 - GT_PILAR} y="48" width={GT_PILAR} height={ALTO} rx="6" />
              <rect x={X_EJE + GT_HUECO / 2} y="48" width={GT_PILAR} height={ALTO} rx="6" />
              <rect x={X_EJE - GT_HUECO / 2 - GT_PILAR - 8} y="34" width={GT_HUECO + 2 * GT_PILAR + 16} height="18" rx="5" />
            </g>
          )}

          {/* El resplandor va encima de todo: aunque el sol esté detrás de una piedra, se ve dónde anda. */}
          <g className={`calendario-sol ${alineado ? "calendario-brilla" : ""}`}>
            <circle className="calendario-halo" cx={x} cy={HORIZONTE - 3} r="26" fill="url(#calendario-halo)" />
          </g>
          {alineado && (
            <line
              className="calendario-rayo"
              x1={x}
              y1={HORIZONTE + 2}
              x2={x}
              y2={ALTO}
              stroke="#fff8dc"
              strokeWidth="2.5"
              strokeDasharray="6 5"
            />
          )}

          <rect x="8" y="8" width="156" height="22" rx="11" fill="rgba(31, 42, 46, 0.55)" />
          <text x="86" y="23.5" textAnchor="middle" className="calendario-rotulo">
            {v.rotulo}
          </text>
          {/* Si el sol queda fuera de la vista, un aviso junto al horizonte señala hacia dónde. */}
          {fuera && (
            <g>
              {/* 292 de ancho: holgura para la letra más ancha del móvil (SF de iPhone). */}
              <rect x={fuera === "derecha" ? ANCHO - 300 : 8} y="96" width="292" height="20" rx="10" fill="rgba(31, 42, 46, 0.7)" />
              <text x={fuera === "derecha" ? ANCHO - 154 : 154} y="110.5" textAnchor="middle" className="calendario-rotulo">
                {flecha}
              </text>
            </g>
          )}
        </g>
      </svg>

      <div className="calendario-fecha">
        <button className="calendario-paso" onClick={() => cambiar(dia - 1)} disabled={acabado} aria-label="Un día antes">
          ◀
        </button>
        <output className="calendario-dia">{fecha(dia)}</output>
        <button className="calendario-paso" onClick={() => cambiar(dia + 1)} disabled={acabado} aria-label="Un día después">
          ▶
        </button>
      </div>
      <input
        className="calendario-barra"
        type="range"
        min="1"
        max="365"
        step="1"
        value={dia}
        disabled={acabado}
        onChange={(e) => cambiar(Number(e.target.value))}
        aria-label="Día del año"
        aria-valuetext={fecha(dia)}
      />
      <div className="calendario-meses" aria-hidden="true">
        {MESES_CORTOS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      {verano && vista === "amanecer" ? (
        <button className="boton grande calendario-girar" onClick={girar} disabled={acabado}>
          ↻ Mirar hacia el atardecer
        </button>
      ) : (
        <p className="nota">
          {vista === "amanecer"
            ? "Cambiad el día: ¿cuándo sale el sol justo por el hueco?"
            : "¿Qué día se pone el sol por el hueco del Gran Trilito?"}
        </p>
      )}
    </MarcoReto>
  );
}
