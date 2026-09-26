import { ir } from "../App";
import { useEstado } from "../estado";

export default function Barra({ titulo, volver }: { titulo: string; volver: string }) {
  const { pegatinas } = useEstado();
  return (
    <header className="barra">
      <button className="barra-volver" onClick={() => ir(volver)} aria-label="Volver">
        ‹
      </button>
      <h1 className="barra-titulo">{titulo}</h1>
      <button className="barra-album" onClick={() => ir("/album")} aria-label="Álbum de pegatinas">
        ⭐ {pegatinas.length}
      </button>
    </header>
  );
}
