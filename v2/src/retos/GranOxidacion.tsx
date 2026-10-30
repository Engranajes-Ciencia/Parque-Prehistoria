import { useEffect, useRef, useState } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { dichoDelReto, dichosDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";
import "./GranOxidacion.css";

// Parada 2, reto para mayores: «La gran oxidación». El mar con estromatolitos de
// FabricaOxigeno, pero contando adónde fue a parar aquel oxígeno, en tres actos:
//  1. El agua está llena de hierro disuelto (los puntitos claros). Cada burbuja de oxígeno se
//     junta con él, se vuelve una mota de óxido y se hunde; en el fondo, visto en corte, se
//     apilan bandas rojas. El medidor del aire no se mueve.
//  2. Gastado el hierro del agua (doce toques con luz), las burbujas llegan al aire: el medidor
//     se llena (diez toques más) y en el cielo van apareciendo moléculas de oxígeno.
//  3. Con el medidor lleno aparece, muy arriba, la capa de ozono, y los rayos ultravioleta (las
//     rayas violetas) ya no llegan al mar. Es el último paso: Alba lo explica al ganar.
// Hay día y noche (6 s y 4 s, con setTimeout): de noche las colonias no fabrican oxígeno y
// tocarlas solo da un «zzz».
//
// Lo que el juego simplifica (no se dice en voz alta; lo recoge el guion):
//  - El hierro no se acabó de golpe: lo que cambió es que se fabricaba más oxígeno del que
//    podían tragarse el hierro y los gases de los volcanes. El mar profundo siguió teniendo
//    hierro mucho tiempo y hubo bandas hasta hace unos 1.800 millones de años. Por eso Alba
//    dice «en esta agua» y no «en el mar».
//  - Las bandas de verdad alternan capas ricas en hierro (rojas o negras) y en sílice (grises):
//    aquí, una pareja roja y gris por toque. Cada capa real tardó años, o mucho más.
//  - El cielo NO cambia de color: el guion de la parada 2 descartó el «cielo de naranja a azul»
//    (el azul lo pone el aire al dispersar la luz, haya o no oxígeno, y la neblina naranja de
//    aquella época es una hipótesis). Lo que se llena de oxígeno se ve en el medidor y en las
//    moléculas del cielo.

const ANCHO = 360;
const ALTO = 300;
const MAR = 80; // superficie del mar: por encima, el cielo
const FONDO = 236; // suelo del mar, donde se apoyan las colonias
const CORTE = 242; // por debajo, el fondo visto en corte: ahí se apilan las bandas
const OZONO = 30; // altura de la capa de ozono
const SOL = { x: 338, y: -2, r: 18 }; // en la esquina, por encima de la capa de ozono

// Las mismas rocas que FabricaOxigeno, sobre un suelo algo más alto.
const COLONIAS = [
  { x: 52, ancho: 64, alto: 58 },
  { x: 124, ancho: 52, alto: 42 },
  { x: 190, ancho: 74, alto: 70 },
  { x: 262, ancho: 54, alto: 48 },
  { x: 322, ancho: 60, alto: 60 },
];

const HIERRO = 12; // toques con luz hasta gastar el hierro del agua
const AIRE = 10; // toques con luz para llenar el medidor del aire
const MOTAS = 3; // burbujas (y motas de óxido) por toque mientras queda hierro
const PAR = 4.6; // grosor de cada pareja de bandas (roja y gris): doce caben en el corte
const DIA = 6000;
const NOCHE = 4000;
const SUBE_POCO = 44; // lo que sube la burbuja antes de volverse óxido (igual que en el CSS)
const AL_FONDO = 2300; // ms desde el toque hasta que el óxido llega al fondo
const AL_AIRE = 1400; // ms desde el toque hasta que las burbujas salen al aire

/** Puntos repartidos «al azar», pero siempre los mismos: el dibujo no cambia de una vez a otra. */
function repartir(n: number, semilla: number, x0: number, x1: number, y0: number, y1: number) {
  let s = semilla;
  const azar = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: n }, () => ({ x: x0 + azar() * (x1 - x0), y: y0 + azar() * (y1 - y0) }));
}
const PUNTOS_HIERRO = repartir(HIERRO * MOTAS, 48271, 12, 348, 94, 158);
const MOLECULAS = repartir(AIRE * 2, 99991, 16, 292, 44, 72);

/** Raya en zigzag de (x1, y1) a (x2, y2): así se dibujan los rayos ultravioleta. */
function zigzag(x1: number, y1: number, x2: number, y2: number) {
  const tramos = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 9));
  const dx = (x2 - x1) / tramos;
  const dy = (y2 - y1) / tramos;
  const largo = Math.hypot(dx, dy);
  const nx = (-dy / largo) * 3;
  const ny = (dx / largo) * 3;
  let d = `M${x1} ${y1}`;
  for (let i = 1; i <= tramos; i++) {
    const lado = i === tramos ? 0 : i % 2 ? 1 : -1;
    d += ` L${(x1 + dx * i + nx * lado).toFixed(1)} ${(y1 + dy * i + ny * lado).toFixed(1)}`;
  }
  return d;
}
// Tres rayos del sol al mar: [x de salida, y de salida, x de llegada al mar].
const RAYOS = [
  [324, 12, 262],
  [332, 15, 292],
  [342, 16, 322],
];

interface Particula {
  id: number;
  x: number;
  y: number;
  r: number;
  retraso: number;
  /** «mota»: sube un poco y se vuelve óxido que se hunde; «aire»: sube hasta salir del agua. */
  tipo: "mota" | "aire";
}

/** Lo que Alba tiene que explicar, por orden: una frase, o algo que hacer cuando calle. */
type Turno = Dicho | (() => void);

export default function GranOxidacion({ parada }: { parada: ContenidoParada }) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    toques: dichosDelReto(parada.guion, parada.id, "Al tocar"),
    noche: dicho("De noche"),
    bandas: dicho("Bandas de hierro"),
    sinHierro: dicho("Se acaba el hierro"),
    aire: dicho("El aire se llena"),
    ozono: dicho("Capa de ozono"),
    final: dicho("Al terminar"),
  }));
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);

  const [dia, setDia] = useState(true);
  const [hechos, setHechos] = useState(0); // toques con luz
  const [bandas, setBandas] = useState(0);
  const [aire, setAire] = useState(0);
  const [lleno, setLleno] = useState(false);
  const [ozono, setOzono] = useState(false);
  const [particulas, setParticulas] = useState<Particula[]>([]);
  const [suenos, setSuenos] = useState<{ id: number; x: number; y: number }[]>([]);

  // Cuentas en refs: dos toques en el mismo instante no deben contarse como uno.
  const cuenta = useRef(0);
  const siguiente = useRef(0);
  const ultimoToque = useRef<number[]>(COLONIAS.map(() => 0));
  const avisoNoche = useRef(false);
  const dichas = useRef(0);

  // Relojes del juego: al salir de la pantalla no puede quedar nada pendiente que hable.
  const relojes = useRef(new Set<ReturnType<typeof setTimeout>>());
  const despues = (ms: number, f: () => void) => {
    const t = setTimeout(() => {
      relojes.current.delete(t);
      f();
    }, ms);
    relojes.current.add(t);
  };
  useEffect(
    () => () => {
      relojes.current.forEach(clearTimeout);
      relojes.current.clear();
    },
    [],
  );

  // Las explicaciones van en cola: un niño rápido llega a «se acaba el hierro» mientras Alba
  // aún cuenta lo de las bandas, y no debe cortarla a media frase. Si el navegador nunca avisa
  // del final de una frase (pasa a veces con la voz de Safari), un reloj de reserva la da por dicha.
  const cola = useRef<Turno[]>([]);
  const ocupada = useRef(false);
  const vez = useRef(0);
  const terminado = useRef(false);
  const atender = () => {
    while (!ocupada.current && cola.current.length && !terminado.current) {
      const t = cola.current.shift()!;
      if (typeof t === "function") t();
      else hablar(t);
    }
  };
  const hablar = (d: Dicho) => {
    ocupada.current = true;
    const mia = ++vez.current;
    const libre = () => {
      if (mia !== vez.current || !ocupada.current) return;
      ocupada.current = false;
      atender();
    };
    despues(7000 + 80 * d.texto.length, libre);
    decir(d, libre);
  };
  const explicar = (t: Turno) => {
    cola.current.push(t);
    atender();
  };
  /** Las frases cortas de «Al tocar», solo si Alba no tiene nada pendiente. */
  const animar = () => {
    if (ocupada.current || cola.current.length || !frases.toques.length) return;
    decir(frases.toques[dichas.current++ % frases.toques.length]);
  };

  // Día y noche. Con el medidor lleno se queda de día: la capa de ozono se ve con el sol.
  const deDia = dia || lleno;
  useEffect(() => {
    if (lleno) return;
    const t = setTimeout(() => setDia((d) => !d), dia ? DIA : NOCHE);
    return () => clearTimeout(t);
  }, [dia, lleno]);

  const tocar = (i: number) => {
    const ahora = Date.now();
    if (acabado || lleno || ahora - ultimoToque.current[i] < 300) return;
    ultimoToque.current[i] = ahora;
    const c = COLONIAS[i];
    const cima = FONDO - c.alto;

    if (!deDia) {
      const id = siguiente.current++;
      setSuenos((s) => [...s, { id, x: c.x, y: cima - 8 }]);
      despues(1300, () => setSuenos((s) => s.filter((z) => z.id !== id)));
      // La primera vez, Alba lo explica; si está hablando, se deja para la noche siguiente.
      if (!avisoNoche.current && !ocupada.current && !cola.current.length) {
        avisoNoche.current = true;
        hablar(frases.noche);
      }
      return;
    }

    const n = ++cuenta.current;
    if (n > HIERRO + AIRE) return; // las últimas burbujas ya van camino del aire
    const conHierro = n <= HIERRO;
    const nuevas: Particula[] = Array.from({ length: conHierro ? MOTAS : 4 }, (_, k) => ({
      id: siguiente.current++,
      x: c.x + (Math.random() - 0.5) * c.ancho * 0.6,
      y: cima + 4,
      r: 3 + Math.random() * (conHierro ? 3 : 4),
      retraso: k * 0.1,
      tipo: conHierro ? "mota" : "aire",
    }));
    setParticulas((p) => [...p, ...nuevas]);
    despues(3600, () => setParticulas((p) => p.filter((x) => !nuevas.includes(x))));
    setHechos(n);

    if (conHierro) {
      despues(AL_FONDO, () => {
        setBandas(n);
        if (n === 1) explicar(frases.bandas);
        if (n === HIERRO) explicar(frases.sinHierro);
      });
      if (n === 5 || n === 9) animar();
    } else {
      const k = n - HIERRO;
      despues(AL_AIRE, () => {
        setAire(k);
        if (k === AIRE / 2) explicar(frases.aire);
        if (k === AIRE) {
          setLleno(true);
          // La capa de ozono sale cuando Alba termina lo que estuviera contando.
          explicar(() => {
            terminado.current = true;
            setOzono(true);
            terminar(frases.ozono, frases.final);
          });
        }
      });
      if (k === 3 || k === 8) animar();
    }
  };

  const gastados = Math.min(hechos, HIERRO) * MOTAS;
  const nivel = aire / AIRE;
  const nota = ozono
    ? "En lo alto del cielo, la capa de ozono frena los rayos violetas."
    : lleno
      ? "¡Medidor lleno! Escucha a Alba."
      : hechos < HIERRO
        ? "Toca las colonias verdes cuando haya luz. Los puntitos del agua son hierro disuelto."
        : "Ya no queda hierro en el agua: ahora el oxígeno sube al aire.";

  return (
    <MarcoReto parada={parada.id} titulo={parada.reto ?? "La gran oxidación"} mensaje={mensaje} decir={decir} final={final} pose="senala">
      <svg
        className="oxidacion-vista"
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        role="img"
        aria-label={`Mar antiguo con colonias de cianobacterias, ${deDia ? "de día" : "de noche"}`}
      >
        <defs>
          <linearGradient id="oxidacion-agua" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5aa595" />
            <stop offset="1" stopColor="#2d6a5e" />
          </linearGradient>
          <linearGradient id="oxidacion-cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8ec9ef" />
            <stop offset="1" stopColor="#d3ecf8" />
          </linearGradient>
        </defs>

        <rect width={ANCHO} height={ALTO} fill="url(#oxidacion-agua)" />

        {/* Hierro disuelto: cada toque con luz gasta tres puntitos. */}
        {PUNTOS_HIERRO.map((p, i) => (
          <circle
            key={i}
            className={`oxidacion-hierro ${i < gastados ? "oxidacion-gastado" : ""}`}
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r="2.3"
          />
        ))}

        {COLONIAS.map((c, i) => {
          const izq = c.x - c.ancho / 2;
          const cima = FONDO - c.alto;
          return (
            <g key={i} className="oxidacion-colonia" onPointerDown={() => tocar(i)}>
              {/* Zona de toque algo mayor que la roca: la más baja no llegaba a 44 px. */}
              <rect x={izq - 4} y={cima - 16} width={c.ancho + 8} height={c.alto + 16} fill="transparent" />
              <path
                d={`M${izq} ${FONDO + 2} Q${izq} ${cima} ${c.x} ${cima} Q${izq + c.ancho} ${cima} ${izq + c.ancho} ${FONDO + 2} Z`}
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
              <ellipse cx={c.x} cy={cima + 4} rx={c.ancho * 0.36} ry="9" fill="#3fae4f" stroke="#237a33" strokeWidth="2" />
            </g>
          );
        })}

        {/* Burbujas y óxido, delante de las rocas; el suelo y el cielo, que van después, los tapan. */}
        {particulas.map((b) =>
          b.tipo === "mota" ? (
            <g key={b.id}>
              <circle
                className="oxidacion-burbuja oxidacion-burbuja-corta"
                cx={b.x}
                cy={b.y}
                r={b.r}
                style={{ animationDelay: `${b.retraso}s` }}
              />
              <circle
                className="oxidacion-mota"
                cx={b.x}
                cy={b.y - SUBE_POCO}
                r={b.r * 0.7}
                style={{ animationDelay: `${b.retraso + 0.8}s` }}
              />
            </g>
          ) : (
            <circle
              key={b.id}
              className="oxidacion-burbuja oxidacion-burbuja-larga"
              cx={b.x}
              cy={b.y}
              r={b.r}
              style={{ animationDelay: `${b.retraso}s` }}
            />
          ),
        )}

        {/* El cielo, con el borde ondulado de la superficie del mar. */}
        <path
          d={`M0 0 H${ANCHO} V${MAR} Q337.5 ${MAR + 4} 315 ${MAR} T270 ${MAR} T225 ${MAR} T180 ${MAR} T135 ${MAR} T90 ${MAR} T45 ${MAR} T0 ${MAR} Z`}
          fill="url(#oxidacion-cielo)"
        />

        {/* Oxígeno en el aire: dos moléculas por toque en la segunda parte. */}
        {MOLECULAS.slice(0, aire * 2).map((m, i) => (
          <g key={i} transform={`translate(${m.x.toFixed(1)} ${m.y.toFixed(1)})`}>
            <g className="oxidacion-molecula" style={{ animationDelay: `0s, ${0.8 + (i % 5) * 0.35}s` }}>
              <circle cx="-2.6" r="3.4" />
              <circle cx="2.6" r="3.4" />
            </g>
          </g>
        ))}

        {/* El sol y sus rayos ultravioleta: llegan al mar hasta que hay capa de ozono. */}
        <g className="oxidacion-sol" style={{ opacity: deDia ? 1 : 0 }}>
          {RAYOS.map(([x1, y1, x2]) => {
            const yFin = ozono ? OZONO - 2 : MAR;
            const xFin = x1 + ((x2 - x1) * (yFin - y1)) / (MAR - y1);
            return <path key={x2} className="oxidacion-uv" d={zigzag(x1, y1, xFin, yFin)} />;
          })}
          <circle cx={SOL.x} cy={SOL.y} r={SOL.r + 10} fill="#fff3b0" opacity="0.45" />
          <circle cx={SOL.x} cy={SOL.y} r={SOL.r} fill="#ffd54f" stroke="#f0b429" strokeWidth="2" />
          <text x="306" y="24" textAnchor="middle" className="oxidacion-uv-rotulo">
            UV
          </text>
        </g>

        {ozono && (
          <rect className="oxidacion-aparece" x="0" y={OZONO - 2.5} width={ANCHO} height="5" fill="#8fa8ff" opacity="0.85" />
        )}

        {/* El suelo del mar y, debajo, el corte: las bandas nuevas entran arriba y empujan hacia
            abajo las viejas (y la roca de debajo), como un fondo que se hunde mientras se llena. */}
        <g className="oxidacion-banda" style={{ transform: `translateY(${bandas * PAR}px)` }}>
          <rect x="0" y={CORTE} width={ANCHO} height={ALTO - CORTE} fill="#5e544c" />
          <path d={`M0 ${CORTE + 18} Q90 ${CORTE + 14} 180 ${CORTE + 19} T360 ${CORTE + 17}`} stroke="#4b433c" strokeWidth="2" fill="none" />
          <path d={`M0 ${CORTE + 38} Q120 ${CORTE + 42} 220 ${CORTE + 37} T360 ${CORTE + 40}`} stroke="#4b433c" strokeWidth="2" fill="none" />
        </g>
        {Array.from({ length: bandas }, (_, i) => (
          <g
            key={i}
            className={`oxidacion-banda ${i === bandas - 1 ? "oxidacion-banda-nueva" : ""}`}
            style={{ transform: `translateY(${CORTE + (bandas - 1 - i) * PAR}px)` }}
          >
            <rect width={ANCHO} height={PAR * 0.68} fill={i % 2 ? "#a8432a" : "#b8502f"} />
            <rect y={PAR * 0.68} width={ANCHO} height={PAR * 0.32} fill="#8e8a83" />
          </g>
        ))}
        <path
          d={`M0 ${FONDO} Q90 ${FONDO - 5} 180 ${FONDO} T360 ${FONDO} V${CORTE} H0 Z`}
          fill={bandas ? "#b8502f" : "#b8995f"}
        />
        {bandas > 0 && (
          <g className="oxidacion-aparece">
            <rect x={ANCHO - 118} y={ALTO - 21} width="112" height="16" rx="8" fill="rgba(31, 42, 46, 0.65)" />
            <text x={ANCHO - 62} y={ALTO - 9.5} textAnchor="middle" className="oxidacion-rotulo">
              bandas de hierro
            </text>
          </g>
        )}

        {/* La noche: un velo oscuro, la luna y unas estrellas. No para los toques. */}
        <rect className="oxidacion-noche" width={ANCHO} height={ALTO} fill="#0b1736" style={{ opacity: deDia ? 0 : 0.55 }} />
        <g className="oxidacion-luna" style={{ opacity: deDia ? 0 : 1 }}>
          <circle cx="40" cy="28" r="10" fill="#f4f1d6" />
          <circle cx="36" cy="25" r="2.2" fill="#ddd8b8" />
          <circle cx="44" cy="31" r="1.6" fill="#ddd8b8" />
          {[
            [92, 14],
            [128, 40],
            [168, 12],
            [214, 32],
            [252, 10],
            [72, 56],
            [286, 50],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="1.3" fill="#fff" />
          ))}
        </g>

        {suenos.map((z) => (
          <text key={z.id} className="oxidacion-zzz" x={z.x} y={z.y} textAnchor="middle">
            z z z
          </text>
        ))}

        {ozono && (
          <g className="oxidacion-aparece">
            <rect x="6" y="7" width="98" height="16" rx="8" fill="rgba(31, 42, 46, 0.6)" />
            <text x="55" y="18.5" textAnchor="middle" className="oxidacion-rotulo">
              capa de ozono
            </text>
          </g>
        )}
      </svg>

      <div className="oxidacion-medidor" aria-label={`Oxígeno en el aire: ${Math.round(nivel * 100)} %`}>
        <span className="oxidacion-medidor-etiqueta">Oxígeno en el aire</span>
        <span className="oxidacion-medidor-barra">
          <span style={{ width: `${nivel * 100}%` }} />
        </span>
      </div>
      <p className="nota oxidacion-nota">{nota}</p>
    </MarcoReto>
  );
}
