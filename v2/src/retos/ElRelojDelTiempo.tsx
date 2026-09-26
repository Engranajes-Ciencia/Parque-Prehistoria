import OrdenarTarjetas from "../componentes/OrdenarTarjetas";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 1: el orden grande de la historia de la vida, en cuatro tarjetas.
// Dibujos PROVISIONALES (emojis) hasta que lleguen las ilustraciones del lote 7.
export default function ElRelojDelTiempo({ parada }: { parada: ContenidoParada }) {
  return (
    <OrdenarTarjetas
      parada={parada}
      tituloPorDefecto="El reloj del tiempo"
      pose="reloj"
      tarjetas={[
        { paso: 3, nombre: "Dinosaurios", dibujo: "🦕" },
        { paso: 1, nombre: "Microbios en el agua", dibujo: "🦠" },
        { paso: 4, nombre: "Personas pintando", dibujo: "🖐️" },
        { paso: 2, nombre: "Animales en el mar", dibujo: "🐚" },
      ]}
      rotuloPiezas="Las tarjetas, desordenadas"
      rotuloSitios="¿Qué pasó primero?"
      nota="Dibujos provisionales: llegarán las ilustraciones."
    />
  );
}
