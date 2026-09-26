import { ir } from "../App";
import Barra from "../componentes/Barra";
import DescargarVisita from "../componentes/DescargarVisita";
import MapaParque from "../componentes/MapaParque";
import { PARADAS, RECORRIDO } from "../contenido/paradas";
import { useEstado } from "../estado";

export default function Recorrido({ editar = false }: { editar?: boolean }) {
  const { pegatinas } = useEstado();
  return (
    <main className="pantalla">
      <Barra titulo={editar ? "Colocar las paradas" : "El recorrido"} volver="/" />
      {!editar && <DescargarVisita />}
      <MapaParque editar={editar} />
      <p className="aviso-prueba">Mapa provisional: el dibujo definitivo está en preparación.</p>
      <h2 className="recorrido-cabecera">Todas las paradas</h2>
      <ol className="recorrido">
        {RECORRIDO.map((p) => {
          const abierta = p.id in PARADAS;
          return (
            <li key={p.id}>
              <button
                className={`recorrido-parada ${abierta ? "abierta" : ""}`}
                disabled={!abierta}
                onClick={() => ir(`/parada/${p.id}`)}
              >
                <span className="recorrido-numero">{p.etiqueta ?? p.id}</span>
                <span className="recorrido-titulo">{p.titulo}</span>
                <span className="recorrido-estado">
                  {pegatinas.includes(p.id) ? "⭐" : abierta ? "›" : "pronto"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
