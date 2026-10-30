import Repartir from "../componentes/Repartir";
import type { ContenidoParada } from "../contenido/paradas";

// Parada 17, reto para mayores: la mudanza con tres grupos. Lo que se lleva, lo que se queda
// (y encontrarán los arqueólogos) y lo que todavía no existía para unos nómadas del
// Paleolítico: la casa de piedra, el campo de trigo y la vasija de barro llegaron con los
// primeros agricultores. Dibujos del lote 7 y, para las cartas nuevas, emoji.
const img = (n: string) => <img src={`img/p17/${n}.webp`} alt="" draggable={false} />;
const emoji = (e: string) => <span className="tarjeta-emoji" aria-hidden="true">{e}</span>;

export default function LaGranMudanza({ parada }: { parada: ContenidoParada }) {
  return (
    <Repartir
      parada={parada}
      tituloPorDefecto="La gran mudanza"
      tarjetas={[
        { id: "pieles", nombre: "Pieles de la tienda", dibujo: img("pieles"), destino: "llevar" },
        { id: "casa", nombre: "Casa de piedra", dibujo: img("casa-piedra"), destino: "aun-no" },
        { id: "hogar", nombre: "Piedras del hogar", dibujo: emoji("🪨"), destino: "queda" },
        { id: "herramientas", nombre: "Herramientas de piedra", dibujo: img("herramientas"), destino: "llevar" },
        { id: "vasija", nombre: "Vasija de barro", dibujo: emoji("🏺"), destino: "aun-no" },
        { id: "restos", nombre: "Huesos de la comida", dibujo: emoji("🦴"), destino: "queda" },
        { id: "lanza", nombre: "Lanza", dibujo: img("lanza"), destino: "llevar" },
        { id: "campo", nombre: "Campo de trigo", dibujo: img("campo-trigo"), destino: "aun-no" },
        { id: "collar", nombre: "Collar de conchas", dibujo: img("collar"), destino: "llevar" },
      ]}
      grupos={[
        { id: "llevar", nombre: "Nos lo llevamos", dibujo: "🎒", etiqueta: "Acierto nos lo llevamos" },
        { id: "queda", nombre: "Se queda aquí", dibujo: "📍", etiqueta: "Acierto se queda" },
        { id: "aun-no", nombre: "Aún no existía", dibujo: "⏳", etiqueta: "Acierto aún no existía" },
      ]}
      rotuloPiezas="¿Qué hacemos con esto?"
      rotuloSitios="La mudanza"
    />
  );
}
