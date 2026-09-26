import { useState, type ReactNode } from "react";
import { dichoDelReto, type Dicho } from "../contenido/guion";
import type { ContenidoParada } from "../contenido/paradas";
import type { PoseAlba } from "./Alba";
import Emparejar from "./Emparejar";

// Ordenar tarjetas en los huecos 1.º, 2.º, 3.º… Las frases salen del guion con las etiquetas
// «Al empezar», «Tarjeta N», «Fallo» y «Al terminar». Las tarjetas se muestran desordenadas
// en el orden en que vienen en la lista.

export interface Tarjeta {
  /** Su posición correcta, empezando por 1. */
  paso: number;
  nombre: string;
  dibujo: ReactNode;
}

interface Props {
  parada: ContenidoParada;
  tituloPorDefecto: string;
  tarjetas: Tarjeta[];
  rotuloPiezas: string;
  rotuloSitios: string;
  pose?: PoseAlba;
  nota?: string;
}

export default function OrdenarTarjetas({ parada, tituloPorDefecto, tarjetas, rotuloPiezas, rotuloSitios, pose, nota }: Props) {
  const dicho = (e: string) => dichoDelReto(parada.guion, parada.id, e);
  const pasos = tarjetas.map((t) => String(t.paso)).sort();
  const [frases] = useState(() => ({
    inicio: dicho("Al empezar"),
    fallo: dicho("Fallo"),
    final: dicho("Al terminar"),
    tarjeta: Object.fromEntries(pasos.map((n) => [n, dicho(`Tarjeta ${n}`)])) as Record<string, Dicho>,
  }));
  return (
    <Emparejar
      parada={parada.id}
      titulo={parada.reto ?? tituloPorDefecto}
      pose={pose}
      piezas={tarjetas.map((t) => ({ id: `t${t.paso}`, nombre: t.nombre, dibujo: t.dibujo, destino: String(t.paso) }))}
      sitios={pasos.map((n) => ({ id: n, nombre: `${n}.º` }))}
      columnas={pasos.length}
      rotuloPiezas={rotuloPiezas}
      rotuloSitios={rotuloSitios}
      frases={{ inicio: frases.inicio, fallo: frases.fallo, final: frases.final, acierto: (p) => frases.tarjeta[p.destino] }}
      nota={nota}
    />
  );
}
