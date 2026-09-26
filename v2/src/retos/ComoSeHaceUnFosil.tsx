import OrdenarTarjetas from "../componentes/OrdenarTarjetas";
import type { ContenidoParada } from "../contenido/paradas";

// La historia de un fósil en cuatro tarjetas (ilustraciones del lote 6).
const img = (n: number) => <img src={`img/p03/fosil-${n}.webp`} alt="" draggable={false} />;

export default function ComoSeHaceUnFosil({ parada }: { parada: ContenidoParada }) {
  return (
    <OrdenarTarjetas
      parada={parada}
      tituloPorDefecto="¿Cómo se hace un fósil?"
      pose="lupa"
      tarjetas={[
        { paso: 3, nombre: "Se vuelve piedra", dibujo: img(3) },
        { paso: 1, nombre: "Nada en el mar", dibujo: img(1) },
        { paso: 4, nombre: "¡Aparece!", dibujo: img(4) },
        { paso: 2, nombre: "Lo tapa el barro", dibujo: img(2) },
      ]}
      rotuloPiezas="Las tarjetas, desordenadas"
      rotuloSitios="¿Qué pasa primero?"
    />
  );
}
