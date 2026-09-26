import Alba from "../componentes/Alba";
import Barra from "../componentes/Barra";
import Pegatina from "../componentes/Pegatina";
import { RECORRIDO } from "../contenido/paradas";
import { useEstado } from "../estado";
import { CLAVE_MANO } from "../retos/ManoEnLaCueva";

function leerMano() {
  try {
    return localStorage.getItem(CLAVE_MANO);
  } catch {
    return null;
  }
}

export default function Album() {
  const { pegatinas } = useEstado();
  const mano = leerMano();
  return (
    <main className="pantalla">
      <Barra titulo="Mis pegatinas" volver="/recorrido" atras />
      <div className="album-cabecera">
        <Alba pose="celebra" className="album-alba" />
        <p>
          Llevas <strong>{pegatinas.length}</strong> {pegatinas.length === 1 ? "pegatina" : "pegatinas"}. ¡Supera
          los retos para conseguir más!
        </p>
      </div>
      <ul className="album">
        {RECORRIDO.map((p) => (
          <li key={p.id} className={pegatinas.includes(p.id) ? "conseguida" : ""}>
            {pegatinas.includes(p.id) ? <Pegatina parada={p.id} /> : <span className="album-hueco">{p.etiqueta ?? p.id}</span>}
          </li>
        ))}
      </ul>
      {mano && (
        <section className="tarjeta album-mano">
          <h2>Tu mano en la cueva</h2>
          <img src={mano} alt="La mano que pintaste en la cueva" />
        </section>
      )}
    </main>
  );
}
