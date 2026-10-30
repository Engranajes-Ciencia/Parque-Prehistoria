import { useRef, useState, type PointerEvent } from "react";
import type { Dicho } from "../contenido/guion";
import type { PoseAlba } from "./Alba";
import MarcoReto, { useAlba } from "./MarcoReto";

// Motor de juego «rompecabezas»: una ilustración partida en filas × columnas piezas
// desordenadas. Se cambian dos piezas de sitio tocando una y luego otra, o arrastrando una
// encima de otra. La pieza que cae en su sitio se queda fija (brilla un momento), para que
// los peques vean que avanzan. Pensado para 2×3 (peques) y 3×4 o 4×4 (mayores).

interface Props {
  parada: number;
  titulo: string;
  pose?: PoseAlba;
  /** Ruta de la imagen y su proporción (ancho / alto), para recortar bien las piezas. */
  imagen: string;
  proporcion: number;
  filas: number;
  columnas: number;
  /** Se enseña la imagen entera en pequeño, como en la tapa de la caja. */
  modelo: "siempre" | "boton";
  frases: {
    inicio: Dicho;
    /** Cuando ya está colocada la mitad de las piezas. */
    mitad: Dicho;
    /** Lo que explica Alba al poner la última pieza (antes de «¡Reto superado!»). */
    ultima: Dicho;
    final: Dicho;
  };
  etiqueta: string;
  nota: string;
}

/** Una permutación en la que casi ninguna pieza empieza en su sitio (como mucho, `libres`). */
function desordenar(n: number, libres: number): number[] {
  for (let intento = 0; intento < 200; intento++) {
    const p = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    if (p.filter((v, i) => v === i).length <= libres) return p;
  }
  return Array.from({ length: n }, (_, i) => (i + 1) % n);
}

export default function Rompecabezas(p: Props) {
  const total = p.filas * p.columnas;
  const { mensaje, decir, final, terminar, acabado } = useAlba(p.frases.inicio, p.parada);
  // orden[casilla] = pieza que hay en esa casilla. La pieza i va en la casilla i.
  const [orden, setOrden] = useState(() => desordenar(total, 0));
  const [elegida, setElegida] = useState<number | null>(null);
  const [recien, setRecien] = useState<number[]>([]);
  const [verModelo, setVerModelo] = useState(false);
  const mitadDicha = useRef(false);
  const arrastre = useRef<{ desde: number; id: number; movido: boolean } | null>(null);
  // Tras cambiar dos piezas arrastrando, el navegador manda además un «click» a la primera:
  // no debe dejarla elegida.
  const ignorarClic = useRef(false);
  const tablero = useRef<HTMLDivElement>(null);

  const fija = (o: number[], casilla: number) => o[casilla] === casilla;

  const cambiar = (a: number, b: number) => {
    if (acabado || a === b || fija(orden, a) || fija(orden, b)) return;
    const nuevo = [...orden];
    [nuevo[a], nuevo[b]] = [nuevo[b], nuevo[a]];
    setOrden(nuevo);
    setElegida(null);
    const encajadas = [a, b].filter((c) => fija(nuevo, c));
    if (encajadas.length) {
      setRecien(encajadas);
      setTimeout(() => setRecien([]), 700);
    }
    const bien = nuevo.filter((v, i) => v === i).length;
    if (bien === total) terminar(p.frases.ultima, p.frases.final);
    else if (!mitadDicha.current && bien >= total / 2) {
      mitadDicha.current = true;
      decir(p.frases.mitad);
    }
  };

  const tocar = (casilla: number) => {
    if (ignorarClic.current) {
      ignorarClic.current = false;
      return;
    }
    if (acabado || fija(orden, casilla)) return;
    if (elegida === null) setElegida(casilla);
    else if (elegida === casilla) setElegida(null);
    else cambiar(elegida, casilla);
  };

  // Arrastrar una pieza encima de otra: al soltar, se mira qué casilla hay debajo del dedo.
  const casillaEn = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-casilla]");
    return el && tablero.current?.contains(el) ? Number(el.dataset.casilla) : null;
  };
  const empezar = (e: PointerEvent<HTMLButtonElement>, casilla: number) => {
    if (acabado || arrastre.current || fija(orden, casilla)) return;
    arrastre.current = { desde: casilla, id: e.pointerId, movido: false };
    try {
      e.currentTarget.releasePointerCapture(e.pointerId); // el «pointerup» debe llegar a la casilla de debajo
    } catch {
      /* algunos navegadores no capturan: da igual */
    }
  };
  const mover = (e: PointerEvent<HTMLDivElement>) => {
    const a = arrastre.current;
    if (!a || a.id !== e.pointerId) return;
    const c = casillaEn(e.clientX, e.clientY);
    if (c !== null && c !== a.desde) a.movido = true;
  };
  const soltar = (e: PointerEvent<HTMLDivElement>) => {
    const a = arrastre.current;
    if (!a || a.id !== e.pointerId) return;
    arrastre.current = null;
    const c = casillaEn(e.clientX, e.clientY);
    if (a.movido && c !== null && c !== a.desde) {
      ignorarClic.current = true;
      setTimeout(() => (ignorarClic.current = false), 400);
      cambiar(a.desde, c);
    }
  };

  const fondo = (pieza: number) => {
    const col = pieza % p.columnas;
    const fila = Math.floor(pieza / p.columnas);
    return {
      backgroundImage: `url(${p.imagen})`,
      backgroundSize: `${p.columnas * 100}% ${p.filas * 100}%`,
      backgroundPosition: `${p.columnas > 1 ? (col / (p.columnas - 1)) * 100 : 0}% ${p.filas > 1 ? (fila / (p.filas - 1)) * 100 : 0}%`,
    };
  };

  return (
    <MarcoReto parada={p.parada} titulo={p.titulo} mensaje={mensaje} decir={decir} final={final} pose={p.pose ?? "piensa"}>
      <div className="rompe">
        <div
          ref={tablero}
          className={`rompe-tablero ${acabado ? "completo" : ""}`}
          style={{
            aspectRatio: String(p.proporcion),
            width: `min(100%, ${Math.round(52 * p.proporcion)}vh)`,
            gridTemplateColumns: `repeat(${p.columnas}, 1fr)`,
            gridTemplateRows: `repeat(${p.filas}, 1fr)`,
          }}
          role="group"
          aria-label={p.etiqueta}
          onPointerMove={mover}
          onPointerUp={soltar}
          onPointerCancel={() => (arrastre.current = null)}
        >
          {orden.map((pieza, casilla) => (
            <button
              key={casilla}
              data-casilla={casilla}
              className={[
                "rompe-pieza",
                fija(orden, casilla) ? "fija" : "",
                elegida === casilla ? "elegida" : "",
                recien.includes(casilla) ? "recien" : "",
              ].join(" ")}
              style={fondo(pieza)}
              aria-label={`Pieza ${pieza + 1}${fija(orden, casilla) ? ", en su sitio" : ""}`}
              aria-pressed={elegida === casilla}
              onClick={() => tocar(casilla)}
              onPointerDown={(e) => empezar(e, casilla)}
            />
          ))}
        </div>
        <div className="rompe-lado">
          {(p.modelo === "siempre" || verModelo) && (
            <img className="rompe-modelo" src={p.imagen} alt="Así queda el dibujo" style={{ aspectRatio: String(p.proporcion) }} />
          )}
          {p.modelo === "boton" && !acabado && (
            <button className="boton secundario rompe-ver" onClick={() => setVerModelo(!verModelo)}>
              {verModelo ? "Ocultar el dibujo" : "👁 Ver el dibujo"}
            </button>
          )}
        </div>
      </div>
      <p className="nota">{p.nota}</p>
    </MarcoReto>
  );
}
