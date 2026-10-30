import { useRef, useState, type ReactNode } from "react";
import type { Dicho } from "../contenido/guion";
import type { PoseAlba } from "./Alba";
import MarcoReto, { useAlba } from "./MarcoReto";

// Motor de juego «parejas» (memory): cartas boca abajo; se levantan de dos en dos y, si son
// pareja, se quedan boca arriba y Alba explica por qué. Las dos cartas de una pareja pueden ser
// distintas (un lobo y un perro): es una pareja de parientes, no de dibujos iguales.

export interface CartaMemory {
  nombre: string;
  dibujo: ReactNode;
}

export interface ParejaMemory {
  id: string;
  a: CartaMemory;
  b: CartaMemory;
  dicho: Dicho;
}

interface Props {
  parada: number;
  titulo: string;
  pose?: PoseAlba;
  parejas: ParejaMemory[];
  inicio: Dicho;
  final: Dicho;
  /** Columnas de la rejilla (4 por defecto). */
  columnas?: number;
  nota: string;
}

interface Carta extends CartaMemory {
  clave: string;
  pareja: string;
}

function barajar<T>(lista: T[]): T[] {
  const l = [...lista];
  for (let i = l.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [l[i], l[j]] = [l[j], l[i]];
  }
  return l;
}

export default function Memory(p: Props) {
  const { mensaje, decir, final, terminar, acabado } = useAlba(p.inicio, p.parada);
  const [cartas] = useState<Carta[]>(() =>
    barajar(p.parejas.flatMap((pa) => [{ ...pa.a, clave: `${pa.id}-a`, pareja: pa.id }, { ...pa.b, clave: `${pa.id}-b`, pareja: pa.id }])),
  );
  const [arriba, setArribaEstado] = useState<string[]>([]); // las que están boca arriba sin pareja aún
  const arribaYa = useRef<string[]>([]); // lo mismo, al instante (dos toques seguidos no se pisan)
  const setArriba = (l: string[]) => {
    arribaYa.current = l;
    setArribaEstado(l);
  };
  const [halladas, setHalladas] = useState<string[]>([]); // ids de pareja
  const ya = useRef<string[]>([]);
  const ocupado = useRef(false); // mientras se enseñan dos que no son pareja

  const levantar = (c: Carta) => {
    const levantadas = arribaYa.current;
    if (acabado || ocupado.current || ya.current.includes(c.pareja) || levantadas.includes(c.clave)) return;
    if (!levantadas.length) return setArriba([c.clave]);
    const primera = cartas.find((x) => x.clave === levantadas[0])!;
    setArriba([primera.clave, c.clave]);
    if (primera.pareja === c.pareja) {
      const nuevas = [...ya.current, c.pareja];
      ya.current = nuevas;
      setHalladas(nuevas);
      setArriba([]);
      const dicho = p.parejas.find((pa) => pa.id === c.pareja)!.dicho;
      if (nuevas.length === p.parejas.length) terminar(dicho, p.final);
      else decir(dicho);
    } else {
      ocupado.current = true;
      setTimeout(() => {
        ocupado.current = false;
        setArriba([]);
      }, 1100);
    }
  };

  return (
    <MarcoReto parada={p.parada} titulo={p.titulo} mensaje={mensaje} decir={decir} final={final} pose={p.pose ?? "piensa"}>
      <div className="memory" style={{ gridTemplateColumns: `repeat(${p.columnas ?? 4}, 1fr)` }}>
        {cartas.map((c) => {
          const vista = halladas.includes(c.pareja) || arriba.includes(c.clave);
          return (
            <button
              key={c.clave}
              className={`memory-carta ${vista ? "vista" : ""} ${halladas.includes(c.pareja) ? "hallada" : ""}`}
              onClick={() => levantar(c)}
              aria-label={vista ? c.nombre : "Carta boca abajo"}
            >
              <span className="memory-dorso" aria-hidden="true" />
              <span className="memory-cara" aria-hidden={!vista}>
                <span className="memory-dibujo">{c.dibujo}</span>
                <span className="memory-nombre">{c.nombre}</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="nota">{p.nota}</p>
    </MarcoReto>
  );
}
