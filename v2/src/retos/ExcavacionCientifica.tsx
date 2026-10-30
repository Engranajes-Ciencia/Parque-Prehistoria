import { useEffect, useRef, useState, type PointerEvent as EventoPuntero, type ReactNode } from "react";
import MarcoReto, { useAlba } from "../componentes/MarcoReto";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";
import "./ExcavacionCientifica.css";

// Parada 13, reto para mayores. El mismo arenero de 4×4 que «¡A excavar!» (columnas A-D de
// izquierda a derecha, filas 1-4 de arriba abajo), con seis hallazgos en casillas fijas y el
// paso que da un científico de verdad: antes de seguir excavando, APUNTAR dónde estaba cada
// cosa. Al destapar un hallazgo hay que elegir su letra (arriba) y su número (al lado); si
// acierta, se anota en el cuaderno de campo con su número de registro y Alba cuenta qué nos
// dice. Mientras un hallazgo espera a que lo apunten, no sale el siguiente.
//
// Rigor: en Atapuerca, de cada pieza se anotan el cuadro y la profundidad (X, Y y Z); aquí,
// solo la casilla, y Alba lo dice al pedir el primer apunte. El yacimiento es genérico: las
// frases no atribuyen ningún hallazgo a una cueva ni a una especie concretas (los hogares de
// Atapuerca, por ejemplo, son de niveles mucho más modernos que los bifaces de la Sima).

const COLUMNAS = ["A", "B", "C", "D"];
const FILAS = ["1", "2", "3", "4"];
const DESCUBIERTO = 0.4; // fracción de la casilla rascada para dar el hallazgo por encontrado

interface Hallazgo {
  id: string;
  /** Etiqueta de su frase en el guion. */
  etiqueta: string;
  /** Lo que se escribe en el cuaderno. */
  nombre: string;
  col: number;
  fila: number;
  dibujo: ReactNode;
}

const hueso = "#efe6d0";
const trazo = "#6b5a3e";

// El borde retocado de la raedera: festones hacia fuera entre estos puntos.
const BORDE_RAEDERA = "Q62.8 16.7 63 24 Q68.8 28.7 67 36 Q70.5 42.3 66 48 Q67.2 55.5 61 60 Q59.5 67.7 52 70 Q48 77 40 77";

const HALLAZGOS: Hallazgo[] = [
  {
    id: "bifaz",
    etiqueta: "Bifaz",
    nombre: "Bifaz",
    col: 1,
    fila: 0,
    dibujo: (
      <g>
        <path d="M42 8 Q64 36 62 58 Q58 80 42 82 Q26 80 22 58 Q20 36 42 8 Z" fill="#9a9486" stroke="#4f4b43" strokeWidth="3" />
        <path d="M42 14 L36 40 L46 52 L38 70 M52 36 L46 52 M30 56 L38 70 M54 62 L46 52" stroke="#6d685e" strokeWidth="2" fill="none" />
      </g>
    ),
  },
  {
    id: "diente",
    etiqueta: "Diente",
    nombre: "Diente",
    col: 3,
    fila: 1,
    dibujo: (
      <path
        d="M22 30 Q20 12 34 14 Q42 10 50 14 Q64 12 62 30 Q60 42 56 48 L54 78 Q50 84 47 76 L44 54 L40 54 L37 76 Q34 84 30 78 L28 48 Q24 42 22 30 Z"
        fill={hueso}
        stroke={trazo}
        strokeWidth="3"
      />
    ),
  },
  {
    id: "hueso",
    etiqueta: "Hueso con marcas",
    nombre: "Hueso",
    col: 0,
    fila: 1,
    dibujo: (
      <g transform="rotate(-30 42 42)">
        <path
          d="M18 34 Q8 28 12 20 Q18 14 24 22 L60 22 Q66 14 72 20 Q76 28 66 34 Q76 40 72 48 Q66 54 60 46 L24 46 Q18 54 12 48 Q8 40 18 34 Z"
          fill={hueso}
          stroke={trazo}
          strokeWidth="3"
        />
        {/* Marcas de corte: rayas finas, paralelas y juntas, como las que deja un filo de piedra. */}
        <path d="M33 25 L36 33 M38 25 L41 33 M43 25 L46 33 M48 25 L51 33" stroke="#5a4630" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "carbones",
    etiqueta: "Carbones",
    nombre: "Hoguera",
    col: 2,
    fila: 2,
    dibujo: (
      <g>
        <ellipse cx="42" cy="48" rx="36" ry="28" fill="#5b3b22" opacity="0.45" />
        <path d="M20 44 L30 38 L36 46 L28 54 Z M50 54 L62 50 L66 60 L54 64 Z" fill="#1d1a18" />
        <path d="M44 30 L56 34 L54 44 L42 42 Z M30 62 L38 60 L40 68 L32 70 Z" fill="#2a2522" />
        <path
          transform="rotate(20 46 52)"
          d="M30 50 Q26 46 29 43 Q32 41 34 45 L52 45 Q54 41 57 43 Q60 46 56 50 Q60 54 57 57 Q54 59 52 55 L34 55 Q32 59 29 57 Q26 54 30 50 Z"
          fill="#6e6259"
          stroke="#2a2522"
          strokeWidth="2"
        />
      </g>
    ),
  },
  {
    id: "raedera",
    etiqueta: "Raedera",
    nombre: "Raedera",
    col: 1,
    fila: 3,
    dibujo: (
      <g>
        <path d={`M24 16 L56 14 ${BORDE_RAEDERA} Q26 76 20 56 Q16 36 24 16 Z`} fill="#bba27a" stroke="#6b5233" strokeWidth="3" strokeLinejoin="round" />
        {/* El bulbo del golpe que la arrancó y las ondas que dejó al propagarse. */}
        <path d="M33 20 Q40 27 47 20" fill="none" stroke="#8d7148" strokeWidth="2" />
        <path d="M28 34 Q42 44 56 32 M26 48 Q42 60 58 46 M30 62 Q42 70 52 62" fill="none" stroke="#9c835a" strokeWidth="1.6" />
      </g>
    ),
  },
  {
    id: "oso",
    etiqueta: "Oso",
    nombre: "Oso",
    col: 3,
    fila: 3,
    dibujo: (
      <g>
        <g stroke={trazo} strokeWidth="3" strokeLinejoin="round">
          <path d="M16 58 L60 56 L66 48 L72 52 L68 62 Q44 68 18 64 Z" fill={hueso} />
          {/* Cráneo de oso de las cavernas: frente abombada, en escalón sobre el hocico. */}
          <path d="M8 47 L12 40 L32 36 Q36 26 46 21 Q60 15 72 22 Q80 28 80 38 L76 46 L62 50 L16 53 L9 51 Z" fill={hueso} />
          <path d="M16 52 L18 63 L22 52.5 Z M20 58 L21 51 L24 57.5 Z" fill="#fbf7ea" strokeWidth="1.5" />
        </g>
        <circle cx="40" cy="36" r="5" fill={trazo} />
        <circle cx="10" cy="45.5" r="1.8" fill={trazo} />
        <path d="M30 53 L31 56 M36 53 L37 56 M42 52 L43 55 M48 52 L49 55" stroke={trazo} strokeWidth="2" />
      </g>
    ),
  },
];

const casillaDe = (h: Hallazgo) => `${COLUMNAS[h.col]}${FILAS[h.fila]}`;

function Dibujo({ h, className }: { h: Hallazgo; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 84 90" aria-hidden="true">
      {h.dibujo}
    </svg>
  );
}

function pintarArena(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#e3bd76";
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < (w * h) / 40; i++) {
    const t = Math.random();
    ctx.fillStyle = t < 0.5 ? "rgba(160,112,52,0.35)" : t < 0.8 ? "rgba(255,240,200,0.45)" : "rgba(120,84,40,0.5)";
    ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
}

export default function ExcavacionCientifica({ parada }: { parada: ContenidoParada }) {
  const [frases] = useState(() => {
    const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
    return {
      inicio: dicho("Al empezar"),
      apuntalo: dicho("Apúntalo"),
      equivocada: dicho("Casilla equivocada"),
      final: dicho("Al terminar"),
      hallazgo: Object.fromEntries(HALLAZGOS.map((h) => [h.id, dicho(h.etiqueta)])) as Record<string, Dicho>,
    };
  });
  const { mensaje, decir, final, terminar, acabado } = useAlba(frases.inicio, parada.id);
  const [pendiente, setPendiente] = useState<string | null>(null); // destapado, sin apuntar
  const [apuntados, setApuntados] = useState<string[]>([]); // en orden: su número de registro
  const [letra, setLetra] = useState<number | null>(null);
  const [numero, setNumero] = useState<number | null>(null);
  const [sacudida, setSacudida] = useState(false);

  const lienzo = useRef<HTMLCanvasElement>(null);
  const ultimo = useRef(new Map<number, { x: number; y: number }>()); // por dedo: dos dedos, dos trazos
  const trazos = useRef(0);
  const hallados = useRef<string[]>([]);
  const esperando = useRef<string | null>(null); // el mismo que `pendiente`, al instante
  const eleccion = useRef<{ letra: number | null; numero: number | null }>({ letra: null, numero: null });
  const anotados = useRef<string[]>([]);
  // Mientras Alba explica un hallazgo, el siguiente espera turno (como en «¡A excavar!»). Si
  // algo la interrumpe, el seguro libera el turno a los 12 s.
  const ocupada = useRef(false);
  const seguro = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const temblor = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      clearTimeout(seguro.current);
      clearTimeout(temblor.current);
    },
    [],
  );

  useEffect(() => {
    const c = lienzo.current!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
    // willReadFrequently: revisar() lee los píxeles a menudo; así el navegador no sufre.
    pintarArena(c.getContext("2d", { willReadFrequently: true })!, c.width, c.height);
  }, []);

  const casilla = (h: Hallazgo) => {
    const c = lienzo.current!;
    const lado = c.width / 4;
    return { x: h.col * lado, y: h.fila * lado, lado };
  };

  const libre = () => {
    ocupada.current = false;
    clearTimeout(seguro.current);
    revisar();
  };

  // ¿Ha quedado a la vista algún hallazgo? Solo si no hay otro esperando su apunte y Alba no
  // está explicando el anterior.
  const revisar = () => {
    const c = lienzo.current;
    if (!c || ocupada.current || esperando.current) return;
    const ctx = c.getContext("2d")!;
    for (const h of HALLAZGOS) {
      if (hallados.current.includes(h.id)) continue;
      const { x, y, lado } = casilla(h);
      const datos = ctx.getImageData(x, y, lado, lado).data;
      let vacios = 0;
      let total = 0;
      for (let i = 3; i < datos.length; i += 16) {
        total++;
        if (datos[i] < 40) vacios++;
      }
      if (vacios / total >= DESCUBIERTO) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "#000";
        ctx.fillRect(x, y, lado, lado);
        hallados.current = [...hallados.current, h.id];
        esperando.current = h.id;
        setPendiente(h.id);
        // La primera vez, Alba explica por qué se apunta; después basta con el cuaderno.
        if (hallados.current.length === 1) decir(frases.apuntalo);
        return;
      }
    }
  };

  const rascar = (e: EventoPuntero<HTMLCanvasElement>) => {
    if (acabado || (e.type === "pointermove" && e.buttons === 0)) return;
    const c = lienzo.current!;
    const r = c.getBoundingClientRect();
    const k = c.width / r.width;
    const p = { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
    const ctx = c.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineWidth = c.width * 0.09;
    ctx.beginPath();
    const desde = ultimo.current.get(e.pointerId) ?? p;
    ctx.moveTo(desde.x, desde.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ultimo.current.set(e.pointerId, p);
    if (++trazos.current % 10 === 0) revisar();
  };

  const comprobar = (col: number, fila: number) => {
    const h = HALLAZGOS.find((x) => x.id === esperando.current);
    eleccion.current = { letra: null, numero: null };
    setLetra(null);
    setNumero(null);
    if (!h) return;
    if (h.col !== col || h.fila !== fila) {
      setSacudida(true);
      clearTimeout(temblor.current);
      temblor.current = setTimeout(() => setSacudida(false), 450);
      decir(frases.equivocada);
      return;
    }
    esperando.current = null;
    setPendiente(null);
    const nuevos = [...anotados.current, h.id];
    anotados.current = nuevos;
    setApuntados(nuevos);
    if (nuevos.length === HALLAZGOS.length) {
      terminar(frases.hallazgo[h.id], frases.final);
      return;
    }
    ocupada.current = true;
    clearTimeout(seguro.current);
    seguro.current = setTimeout(libre, 12000);
    decir(frases.hallazgo[h.id], libre);
  };

  // Se elige la letra y el número en cualquier orden; con los dos, se comprueba. La elección
  // vive también en una ref: dos toques seguidos no esperan a que se repinte la pantalla.
  const elegir = (tipo: "letra" | "numero", v: number) => {
    if (acabado || !esperando.current) return;
    const e = { ...eleccion.current, [tipo]: v };
    if (e.letra === null || e.numero === null) {
      eleccion.current = e;
      if (tipo === "letra") setLetra(v);
      else setNumero(v);
      return;
    }
    comprobar(e.letra, e.numero);
  };

  const enEspera = HALLAZGOS.find((h) => h.id === pendiente);
  const puedeApuntar = !!enEspera && !acabado;

  return (
    <MarcoReto
      parada={parada.id}
      titulo={parada.reto ?? "Excavación científica"}
      mensaje={mensaje}
      decir={decir}
      final={final}
      pose="lupa"
    >
      <div className="excav-c">
        <div className="excavacion">
          <div className="excavacion-columnas">
            {COLUMNAS.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <div className="excavacion-filas">
            {FILAS.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <div className="excavacion-arenero">
            {HALLAZGOS.map((h) => (
              <svg
                key={h.id}
                className="hallazgo"
                viewBox="0 0 84 90"
                style={{ left: `${h.col * 25}%`, top: `${h.fila * 25}%` }}
                aria-hidden="true"
              >
                {h.dibujo}
              </svg>
            ))}
            <canvas
              ref={lienzo}
              aria-label="Arenero de excavación de cuatro por cuatro casillas"
              onPointerDown={(e) => {
                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {
                  /* el dedo ya se levantó */
                }
                ultimo.current.delete(e.pointerId);
                rascar(e);
              }}
              onPointerMove={rascar}
              onPointerUp={(e) => {
                ultimo.current.delete(e.pointerId);
                revisar();
              }}
              onPointerCancel={(e) => ultimo.current.delete(e.pointerId)}
            />
            <svg className="excavacion-cuerdas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {[25, 50, 75].map((v) => (
                <g key={v}>
                  <line x1={v} y1="0" x2={v} y2="100" />
                  <line x1="0" y1={v} x2="100" y2={v} />
                </g>
              ))}
            </svg>
            {enEspera && (
              <span className="excav-c-marca" style={{ left: `${enEspera.col * 25}%`, top: `${enEspera.fila * 25}%` }} aria-hidden="true" />
            )}
            {HALLAZGOS.filter((h) => apuntados.includes(h.id)).map((h) => (
              <span key={h.id} className="excavacion-apunte" style={{ left: `${h.col * 25}%`, top: `${h.fila * 25}%` }}>
                ✔ {casillaDe(h)}
              </span>
            ))}
          </div>
        </div>

        <section className="excav-c-cuaderno" aria-label="Cuaderno de campo">
          <h3>Cuaderno</h3>
          <ol>
            {HALLAZGOS.map((_, i) => {
              const h = HALLAZGOS.find((x) => x.id === apuntados[i]);
              return (
                <li key={i} className={h ? "lleno" : ""}>
                  <span className="excav-c-num">{i + 1}</span>
                  {h ? (
                    <>
                      <Dibujo h={h} className="excav-c-mini" />
                      <span className="excav-c-dato">
                        <b>{casillaDe(h)}</b>
                        <small>{h.nombre}</small>
                      </span>
                    </>
                  ) : (
                    <span className="excav-c-vacio">…</span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <div className={`excav-c-registro ${puedeApuntar ? "activo" : ""} ${sacudida ? "sacudida" : ""}`}>
        <div className="excav-c-pide" aria-live="polite">
          {enEspera ? <Dibujo h={enEspera} className="excav-c-pide-dibujo" /> : <span className="excav-c-pala" aria-hidden="true">🖌️</span>}
          <p>{enEspera ? "¿En qué casilla está?" : "Sigue excavando"}</p>
        </div>
        <div className="excav-c-botones">
          <div className="excav-c-fila" role="group" aria-label="Letra: la de arriba">
            {COLUMNAS.map((l, i) => (
              <button
                key={l}
                className="excav-c-opcion letra"
                aria-pressed={letra === i}
                disabled={!puedeApuntar}
                onClick={() => elegir("letra", i)}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="excav-c-fila" role="group" aria-label="Número: el del lado">
            {FILAS.map((n, i) => (
              <button
                key={n}
                className="excav-c-opcion numero"
                aria-pressed={numero === i}
                disabled={!puedeApuntar}
                onClick={() => elegir("numero", i)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="nota">
        Rasca la arena con el dedo. Cuando asome algo, apunta su casilla: la letra de arriba y el número del lado. Hay seis hallazgos.
      </p>
    </MarcoReto>
  );
}
