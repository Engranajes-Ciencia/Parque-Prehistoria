import { useEffect, useRef, useState, type PointerEvent as EventoPuntero } from "react";
import type { Dicho } from "../contenido/guion";
import type { PoseAlba } from "./Alba";
import MarcoReto, { useAlba } from "./MarcoReto";
import "./linterna.css";

// Motor de juego «linterna»: una ilustración a oscuras y un círculo de luz cálida que sigue al
// dedo (y aparece donde se toca la primera vez). Hay que encontrar cosas escondidas, cada una
// con una o varias zonas rectangulares en píxeles de la imagen. Una cosa se encuentra cuando
// el centro de la luz se queda en su zona PERMANENCIA milisegundos (aunque el dedo ya se haya
// levantado: la luz se queda donde estaba) o al darle un toque, porque donde se toca ya hay
// luz. Lo encontrado se queda alumbrado. La espera va con setTimeout, no con
// requestAnimationFrame: aunque el navegador frene las animaciones, se puede ganar. El temblor
// de la llama es solo CSS.

export interface Zona {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CosaEscondida {
  id: string;
  nombre: string;
  /** Una o varias zonas (p. ej., cada mano pintada), en píxeles de la imagen. */
  zonas: Zona[];
  dicho: Dicho;
}

interface Props {
  parada: number;
  titulo: string;
  pose?: PoseAlba;
  imagen: string;
  /** Tamaño de la imagen, en píxeles: las zonas y el recorte van en esas mismas unidades. */
  ancho: number;
  alto: number;
  /** La parte de la imagen que se ve (si no se da, entera). */
  recorte?: Zona;
  /** Radio de la luz, en píxeles de la imagen. */
  radio: number;
  cosas: CosaEscondida[];
  inicio: Dicho;
  final: Dicho;
  etiqueta: string;
  nota: string;
}

const PERMANENCIA = 400; // ms con el centro de la luz encima para dar una cosa por encontrada
const TOQUE = 350; // un toque: el dedo baja y sube en menos de esto, casi sin moverse

const dentro = (z: Zona, x: number, y: number) => x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height;

export default function Linterna(p: Props) {
  const { mensaje, decir, final, terminar, acabado } = useAlba(p.inicio, p.parada);
  const r = p.recorte ?? { x: 0, y: 0, width: p.ancho, height: p.alto };
  const [luz, setLuz] = useState<{ x: number; y: number } | null>(null);
  const [halladas, setHalladas] = useState<string[]>([]);
  const ya = useRef<string[]>([]); // al instante: dos hallazgos seguidos no deben pisarse
  const [destello, setDestello] = useState<string | null>(null);
  const espera = useRef<{ id: string; reloj: ReturnType<typeof setTimeout> } | null>(null);
  const dedo = useRef<{ id: number; x: number; y: number; t: number; lejos: boolean } | null>(null);
  const ganado = useRef(false);

  const olvidarEspera = () => {
    if (espera.current) clearTimeout(espera.current.reloj);
    espera.current = null;
  };
  // Al salir del juego no puede quedar una espera que encuentre algo en otra pantalla.
  useEffect(() => olvidarEspera, []);

  /** La cosa que hay en (x, y). Si dos zonas se solapan, gana la más pequeña (la más concreta). */
  const cosaEn = (x: number, y: number, soloPendientes: boolean) => {
    let mejor: CosaEscondida | null = null;
    let area = Infinity;
    for (const c of p.cosas) {
      if (soloPendientes && ya.current.includes(c.id)) continue;
      for (const z of c.zonas) {
        if (dentro(z, x, y) && z.width * z.height < area) {
          mejor = c;
          area = z.width * z.height;
        }
      }
    }
    return mejor;
  };

  const hallar = (c: CosaEscondida) => {
    if (ganado.current || ya.current.includes(c.id)) return;
    const nuevas = [...ya.current, c.id];
    ya.current = nuevas;
    setHalladas(nuevas);
    setDestello(c.id);
    if (nuevas.length === p.cosas.length) {
      ganado.current = true;
      olvidarEspera();
      dedo.current = null;
      terminar(c.dicho, p.final);
    } else {
      decir(c.dicho);
    }
  };

  /** La luz está en (x, y): si se queda PERMANENCIA ms sobre una cosa sin encontrar, se encuentra. */
  const vigilar = (x: number, y: number) => {
    const c = cosaEn(x, y, true);
    if (espera.current && c && espera.current.id === c.id) return; // sigue encima: el reloj sigue
    olvidarEspera();
    if (c)
      espera.current = {
        id: c.id,
        reloj: setTimeout(() => {
          espera.current = null;
          hallar(c);
        }, PERMANENCIA),
      };
  };

  /** Del dedo a píxeles de la imagen, sin salirse de la parte que se ve. */
  const punto = (e: EventoPuntero<SVGSVGElement>) => {
    const m = e.currentTarget.getScreenCTM();
    if (!m) return null;
    const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return {
      x: Math.min(r.x + r.width, Math.max(r.x, q.x)),
      y: Math.min(r.y + r.height, Math.max(r.y, q.y)),
    };
  };

  const empezar = (e: EventoPuntero<SVGSVGElement>) => {
    // Un solo dedo a la vez. Un toque «primario» nuevo sí vale: si se perdió el final del
    // anterior, el juego no puede quedarse sin responder.
    if (acabado || ganado.current || (dedo.current && !e.isPrimary)) return;
    const q = punto(e);
    if (!q) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* el dedo ya se levantó */
    }
    dedo.current = { id: e.pointerId, x: q.x, y: q.y, t: Date.now(), lejos: false };
    setLuz(q);
    vigilar(q.x, q.y);
  };

  const mover = (e: EventoPuntero<SVGSVGElement>) => {
    const d = dedo.current;
    if (!d || d.id !== e.pointerId || ganado.current) return;
    const q = punto(e);
    if (!q) return;
    if (Math.hypot(q.x - d.x, q.y - d.y) > p.radio * 0.3) d.lejos = true;
    setLuz(q);
    vigilar(q.x, q.y);
  };

  const soltar = (e: EventoPuntero<SVGSVGElement>) => {
    const d = dedo.current;
    if (!d || d.id !== e.pointerId) return;
    dedo.current = null;
    // Un toque corto, sin arrastrar, sobre una cosa: se encuentra al momento (ahí ya hay luz).
    // Sobre una ya encontrada, Alba repite lo que es.
    if (e.type !== "pointerup" || d.lejos || Date.now() - d.t > TOQUE || ganado.current) return;
    const c = cosaEn(d.x, d.y, true) ?? cosaEn(d.x, d.y, false);
    if (!c) return;
    if (ya.current.includes(c.id)) {
      decir(c.dicho);
    } else {
      olvidarEspera();
      hallar(c);
    }
  };

  const encontradas = p.cosas.filter((c) => halladas.includes(c.id));
  const brilla = p.cosas.find((c) => c.id === destello);
  const proporcion = r.width / r.height;

  return (
    <MarcoReto parada={p.parada} titulo={p.titulo} mensaje={mensaje} decir={decir} final={final} pose={p.pose ?? "lupa"}>
      <ul className="lin-lista" aria-label="Lo que hay que encontrar">
        {p.cosas.map((c) => {
          const hecho = halladas.includes(c.id);
          return (
            <li key={c.id} className={hecho ? "hecho" : ""}>
              <b aria-hidden="true">{hecho ? "✔" : "?"}</b>
              {c.nombre}
            </li>
          );
        })}
      </ul>
      <div
        className="lin-marco"
        // Tan ancha como quepa sin que la cueva pase por debajo de la pantalla.
        style={{ width: `min(100%, 420px, max(200px, calc((100vh - var(--lin-reserva)) * ${proporcion.toFixed(3)})))` }}
      >
        <svg
          className={`linterna${acabado ? " encendida" : ""}`}
          viewBox={`${r.x} ${r.y} ${r.width} ${r.height}`}
          role="img"
          aria-label={p.etiqueta}
          onPointerDown={empezar}
          onPointerMove={mover}
          onPointerUp={soltar}
          onPointerCancel={soltar}
          onLostPointerCapture={soltar}
        >
          <defs>
            {/* Agujero en la oscuridad: negro en el centro (la máscara la quita), nada en el borde. */}
            <radialGradient id="lin-hueco">
              <stop offset="0" stopColor="#000" stopOpacity="1" />
              <stop offset="0.45" stopColor="#000" stopOpacity="0.95" />
              <stop offset="0.75" stopColor="#000" stopOpacity="0.55" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="lin-calida">
              <stop offset="0" stopColor="#ffcf7d" stopOpacity="0.35" />
              <stop offset="0.6" stopColor="#ffb054" stopOpacity="0.15" />
              <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
            </radialGradient>
            <mask id="lin-mascara" maskUnits="userSpaceOnUse" x={r.x} y={r.y} width={r.width} height={r.height}>
              <rect x={r.x} y={r.y} width={r.width} height={r.height} fill="#fff" />
              {encontradas.flatMap((c) =>
                c.zonas.map((z, i) => (
                  <ellipse
                    key={`${c.id}-${i}`}
                    cx={z.x + z.width / 2}
                    cy={z.y + z.height / 2}
                    rx={z.width * 0.62}
                    ry={z.height * 0.62}
                    fill="url(#lin-hueco)"
                    opacity="0.8"
                  />
                )),
              )}
              {luz && (
                <g transform={`translate(${luz.x} ${luz.y})`}>
                  <circle className="lin-llama" r={p.radio} fill="url(#lin-hueco)" />
                </g>
              )}
            </mask>
          </defs>
          <image href={p.imagen} width={p.ancho} height={p.alto} />
          <rect className="lin-oscuridad" x={r.x} y={r.y} width={r.width} height={r.height} mask="url(#lin-mascara)" />
          {luz && !acabado && <circle className="lin-calidez" cx={luz.x} cy={luz.y} r={p.radio} fill="url(#lin-calida)" />}
          {brilla?.zonas.map((z, i) => (
            <rect
              key={`${brilla.id}-${i}`}
              className="lin-destello"
              x={z.x}
              y={z.y}
              width={z.width}
              height={z.height}
              rx={r.width * 0.02}
              strokeWidth={r.width * 0.01}
            />
          ))}
          {!luz && !acabado && (
            <circle className="lin-invita" cx={r.x + r.width / 2} cy={r.y + r.height / 2} r={p.radio * 0.4} strokeWidth={r.width * 0.008} />
          )}
        </svg>
      </div>
      <p className="nota">{p.nota}</p>
    </MarcoReto>
  );
}
