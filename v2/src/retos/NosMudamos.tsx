import Repartir from "../componentes/Repartir";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 17: qué se lleva un grupo nómada en la mudanza y qué no puede tener (lote 7).
const img = (n: string) => <img src={`img/p17/${n}.webp`} alt="" draggable={false} />;

export default function NosMudamos({ parada }: { parada: ContenidoParada }) {
  return (
    <Repartir
      parada={parada}
      tituloPorDefecto="¡Nos mudamos!"
      tarjetas={[
        { id: "pieles", nombre: "Pieles de la tienda", dibujo: img("pieles"), destino: "llevar" },
        { id: "casa", nombre: "Casa de piedra", dibujo: img("casa-piedra"), destino: "queda" },
        { id: "herramientas", nombre: "Herramientas de piedra", dibujo: img("herramientas"), destino: "llevar" },
        { id: "lanza", nombre: "Lanza", dibujo: img("lanza"), destino: "llevar" },
        { id: "campo", nombre: "Campo de trigo", dibujo: img("campo-trigo"), destino: "queda" },
        { id: "collar", nombre: "Collar de conchas", dibujo: img("collar"), destino: "llevar" },
      ]}
      grupos={[
        { id: "llevar", nombre: "Nos lo llevamos", dibujo: "🎒", etiqueta: "Acierto nos lo llevamos" },
        { id: "queda", nombre: "Se queda aquí", dibujo: "📍", etiqueta: "Acierto se queda" },
      ]}
      rotuloPiezas="¿Qué hacemos con esto?"
      rotuloSitios="La mudanza"
    />
  );
}
