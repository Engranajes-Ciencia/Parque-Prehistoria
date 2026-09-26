import { ir, volver as volverA } from "../navegacion";
import { useEstado } from "../estado";

/**
 * `volver`: la pantalla «de arriba» (de un juego, su parada; de una parada, el recorrido).
 * `atras`: volver a la pantalla anterior, sea cual sea (el álbum se abre desde cualquier sitio).
 */
export default function Barra({ titulo, volver, atras = false }: { titulo: string; volver: string; atras?: boolean }) {
  const { pegatinas } = useEstado();
  return (
    <header className="barra">
      <button className="barra-volver" onClick={() => volverA(volver, atras)} aria-label="Volver">
        ‹
      </button>
      <h1 className="barra-titulo">{titulo}</h1>
      <button className="barra-album" onClick={() => ir("/album")} aria-label="Álbum de pegatinas">
        ⭐ {pegatinas.length}
      </button>
    </header>
  );
}
