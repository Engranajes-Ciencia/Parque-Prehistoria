import Repartir from "../componentes/Repartir";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 14: lo que los neandertales hacían (con pruebas sólidas) y los mitos. Lo debatido
// (su lenguaje, encender fuego desde cero, los adornos) se queda fuera del juego: ver guion.
// Dibujos PROVISIONALES (emojis) hasta el lote 7.
export default function VerdadOMito({ parada }: { parada: ContenidoParada }) {
  return (
    <Repartir
      parada={parada}
      tituloPorDefecto="¿Verdad o mito?"
      tarjetas={[
        { id: "hogueras", nombre: "Hacer hogueras", dibujo: "🔥", destino: "verdad" },
        { id: "nudillos", nombre: "Andar encorvados, con los nudillos en el suelo", dibujo: "🦍", destino: "mito" },
        { id: "piedras", nombre: "Tallar piedras", dibujo: "🪨", destino: "verdad" },
        { id: "herido", nombre: "Cuidar a un herido", dibujo: "🩹", destino: "verdad" },
        { id: "dinosaurio", nombre: "Montar en dinosaurio", dibujo: "🦖", destino: "mito" },
        { id: "cazar", nombre: "Cazar animales grandes", dibujo: "🦬", destino: "verdad" },
      ]}
      grupos={[
        { id: "verdad", nombre: "Lo hacían", dibujo: "✅", etiqueta: "Acierto lo hacían" },
        { id: "mito", nombre: "Es un mito", dibujo: "❌", etiqueta: "Acierto mito" },
      ]}
      rotuloPiezas="¿Qué hacían los neandertales?"
      rotuloSitios="¿Verdad o mito?"
      nota="Dibujos provisionales: llegarán las ilustraciones."
    />
  );
}
