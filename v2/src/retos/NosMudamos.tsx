import Repartir from "../componentes/Repartir";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 17: qué se lleva un grupo nómada en la mudanza y qué no puede tener.
// Dibujos PROVISIONALES (emojis) hasta el lote 7.
export default function NosMudamos({ parada }: { parada: ContenidoParada }) {
  return (
    <Repartir
      parada={parada}
      tituloPorDefecto="¡Nos mudamos!"
      tarjetas={[
        { id: "pieles", nombre: "Pieles de la tienda", dibujo: "⛺", destino: "llevar" },
        { id: "casa", nombre: "Casa de piedra", dibujo: "🛖", destino: "queda" },
        { id: "herramientas", nombre: "Herramientas de piedra", dibujo: "🪨", destino: "llevar" },
        { id: "lanza", nombre: "Lanza", dibujo: "🗡️", destino: "llevar" },
        { id: "campo", nombre: "Campo de trigo", dibujo: "🌾", destino: "queda" },
        { id: "collar", nombre: "Collar de conchas", dibujo: "📿", destino: "llevar" },
      ]}
      grupos={[
        { id: "llevar", nombre: "Nos lo llevamos", dibujo: "🎒", etiqueta: "Acierto nos lo llevamos" },
        { id: "queda", nombre: "Se queda aquí", dibujo: "📍", etiqueta: "Acierto se queda" },
      ]}
      rotuloPiezas="¿Qué hacemos con esto?"
      rotuloSitios="La mudanza"
      nota="Dibujos provisionales: llegarán las ilustraciones."
    />
  );
}
