import Repartir from "../componentes/Repartir";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 14: lo que los neandertales hacían (con pruebas sólidas) y los mitos. Lo debatido
// (su lenguaje, encender fuego desde cero, los adornos) se queda fuera del juego: ver guion.
// Tarjetas del lote 7. Las de los mitos venían tachadas (un «spoiler»): se usan sin la cruz y la
// app la pone encima cuando se colocan en «Es un mito». Las «-b» son las del lote 7 bis,
// rehechas sin la cruz (27-sep).
const img = (n: string) => <img src={`img/p14/${n}.webp`} alt="" draggable={false} />;

export default function VerdadOMito({ parada }: { parada: ContenidoParada }) {
  return (
    <Repartir
      parada={parada}
      tituloPorDefecto="¿Verdad o mito?"
      tarjetas={[
        { id: "hogueras", nombre: "Hacer hogueras", dibujo: img("hoguera"), destino: "verdad" },
        { id: "nudillos", nombre: "Andar con los nudillos en el suelo", dibujo: img("nudillos-b"), destino: "mito" },
        { id: "piedras", nombre: "Tallar piedras", dibujo: img("tallar"), destino: "verdad" },
        { id: "herido", nombre: "Cuidar a un herido", dibujo: img("cuidar"), destino: "verdad" },
        { id: "dinosaurio", nombre: "Montar en dinosaurio", dibujo: img("dinosaurio-b"), destino: "mito" },
        { id: "cazar", nombre: "Cazar animales grandes", dibujo: img("cazar"), destino: "verdad" },
      ]}
      grupos={[
        { id: "verdad", nombre: "Lo hacían", dibujo: "✅", etiqueta: "Acierto lo hacían" },
        { id: "mito", nombre: "Es un mito", dibujo: "❌", sello: "✖", etiqueta: "Acierto mito" },
      ]}
      rotuloPiezas="¿Qué hacían los neandertales?"
      rotuloSitios="¿Verdad o mito?"
    />
  );
}
