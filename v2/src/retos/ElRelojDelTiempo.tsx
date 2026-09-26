import OrdenarTarjetas from "../componentes/OrdenarTarjetas";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 1: el orden grande de la historia de la vida, en cuatro tarjetas (lote 7).
const img = (n: number) => <img src={`img/p01/tarjeta-${n}.webp`} alt="" draggable={false} />;

export default function ElRelojDelTiempo({ parada }: { parada: ContenidoParada }) {
  return (
    <OrdenarTarjetas
      parada={parada}
      tituloPorDefecto="El reloj del tiempo"
      pose="reloj"
      tarjetas={[
        { paso: 3, nombre: "Dinosaurios", dibujo: img(3) },
        { paso: 1, nombre: "Microbios en el agua", dibujo: img(1) },
        { paso: 4, nombre: "Personas pintando", dibujo: img(4) },
        { paso: 2, nombre: "Animales en el mar", dibujo: img(2) },
      ]}
      rotuloPiezas="Las tarjetas, desordenadas"
      rotuloSitios="¿Qué pasó primero?"
    />
  );
}
