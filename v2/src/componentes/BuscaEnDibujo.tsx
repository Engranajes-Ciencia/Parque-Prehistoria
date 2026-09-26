import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { Dicho } from "../contenido/guion";
import type { PoseAlba } from "./Alba";
import MarcoReto, { useAlba } from "./MarcoReto";

// Motor de juego «encuentra cosas en un dibujo»: pistas en el suelo de Laetoli, diferencias
// entre dos cráneos… El dibujo es un SVG (o una imagen dentro de él) y cada cosa que hay que
// encontrar es una zona rectangular en sus mismas unidades.

export interface ZonaBuscar {
  id: string;
  nombre: string;
  x: number;
  y: number;
  width: number;
  height: number;
  dicho: Dicho;
  /** false: al encontrarla no se enmarca (para zonas que ocupan casi todo el dibujo). */
  marco?: boolean;
}

interface Props {
  parada: number;
  titulo: string;
  pose?: PoseAlba;
  viewBox: string;
  etiqueta: string;
  dibujo: ReactNode;
  zonas: ZonaBuscar[];
  inicio: Dicho;
  final: Dicho;
  nota: string;
}

export default function BuscaEnDibujo(p: Props) {
  const { mensaje, decir, final, terminar, acabado } = useAlba(p.inicio, p.parada);
  const [halladas, setHalladas] = useState<string[]>([]);
  const ya = useRef<string[]>([]); // al instante: dos toques seguidos no deben pisarse
  const [fallo, setFallo] = useState<{ x: number; y: number } | null>(null);
  // Grosores proporcionales al dibujo: igual se ven en un SVG de 360 que en una imagen de 1536.
  const ancho = Number(p.viewBox.split(/\s+/)[2]) || 360;

  const tocar = (e: MouseEvent<SVGSVGElement>) => {
    if (acabado) return;
    const m = e.currentTarget.getScreenCTM();
    if (!m) return;
    const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    // Si dos zonas se solapan, gana la más pequeña: es la pista más concreta.
    const z = p.zonas
      .filter((z) => q.x >= z.x && q.x <= z.x + z.width && q.y >= z.y && q.y <= z.y + z.height)
      .sort((a, b) => a.width * a.height - b.width * b.height)[0];
    if (!z) {
      setFallo({ x: q.x, y: q.y });
      setTimeout(() => setFallo(null), 600);
      return;
    }
    if (ya.current.includes(z.id)) return decir(z.dicho);
    const nuevas = [...ya.current, z.id];
    ya.current = nuevas;
    setHalladas(nuevas);
    if (nuevas.length === p.zonas.length) terminar(z.dicho, p.final);
    else decir(z.dicho);
  };

  return (
    <MarcoReto parada={p.parada} titulo={p.titulo} mensaje={mensaje} decir={decir} final={final} pose={p.pose ?? "lupa"}>
      <div className="mural-lista">
        {p.zonas.map((z) => (
          <span key={z.id} className={halladas.includes(z.id) ? "hecho" : ""}>
            {halladas.includes(z.id) ? "✔" : "?"} {z.nombre}
          </span>
        ))}
      </div>
      <svg className="busca" viewBox={p.viewBox} role="img" aria-label={p.etiqueta} onClick={tocar}>
        {p.dibujo}
        {p.zonas
          .filter((z) => halladas.includes(z.id) && z.marco !== false)
          .map((z) => (
            <rect
              key={z.id}
              className="busca-hallada"
              x={z.x}
              y={z.y}
              width={z.width}
              height={z.height}
              rx={ancho * 0.02}
              strokeWidth={ancho * 0.011}
            />
          ))}
        {fallo && <circle className="busca-fallo" cx={fallo.x} cy={fallo.y} r={ancho * 0.04} strokeWidth={ancho * 0.011} />}
      </svg>
      <p className="nota">{p.nota}</p>
    </MarcoReto>
  );
}
