import type { ContenidoParada } from "../contenido/paradas";
import { Mural, type Hallazgo } from "./DescubreElMural";

// Parada 19, reto para mayores: la misma foto del mural que el de peques, con ocho detalles
// más pequeños. Zonas medidas el 30-oct sobre la foto con una cuadrícula de un 1 %. Donde se
// solapan (el conductor sobre el caballo, la vaca con manchas dentro del rebaño) gana la más
// pequeña. Ni las jirafas (no salen en la foto) ni el gigante blanco: son la misión, que se
// hace mirando la pared de verdad.
const DETALLES: Hallazgo[] = [
  { id: "caballo", nombre: "El caballo al galope", etiqueta: "El caballo al galope", x0: 5, x1: 24.5, y0: 34, y1: 66 },
  { id: "conductor", nombre: "El conductor", etiqueta: "El conductor", x0: 21, x1: 25, y0: 5, y1: 50 },
  { id: "rueda", nombre: "La rueda", etiqueta: "La rueda", x0: 24.3, x1: 28, y0: 47, y1: 64 },
  { id: "bailan", nombre: "Los que bailan", etiqueta: "Los que bailan", x0: 31, x1: 45, y0: 22, y1: 66 },
  {
    id: "pastores",
    nombre: "Los pastores",
    etiqueta: "Los pastores",
    x0: 65.5,
    x1: 68.5,
    y0: 57,
    y1: 83,
    otras: [{ x0: 75.8, x1: 78, y0: 72, y1: 89 }],
  },
  { id: "manchas", nombre: "La vaca con manchas", etiqueta: "La vaca con manchas", x0: 68.3, x1: 76, y0: 60, y1: 91 },
  {
    id: "rebano",
    nombre: "El rebaño",
    etiqueta: "El rebaño",
    x0: 71.5,
    x1: 85,
    y0: 25,
    y1: 75,
    otras: [{ x0: 67.5, x1: 71.5, y0: 25, y1: 42 }],
  },
  { id: "barcos", nombre: "Los barcos", etiqueta: "Los barcos", x0: 85, x1: 100, y0: 28, y1: 82 },
];

export default function DetallesDelMural({ parada }: { parada: ContenidoParada }) {
  return <Mural parada={parada} hallazgos={DETALLES} titulo={parada.reto ?? "Detalles del mural"} />;
}
