import { ir } from "../App";
import Alba from "../componentes/Alba";
import { actualizar, useEstado, type Modo } from "../estado";
import { SALUDO_ALBA } from "../contenido/paradas";
import { locutar } from "../voz";

export default function Inicio() {
  const { modo } = useEstado();

  const elegir = (m: Modo) => {
    actualizar({ modo: m });
    ir("/recorrido");
  };

  return (
    <main className="pantalla inicio">
      <p className="inicio-parque">Parque de Ciencias Prehistóricas</p>
      <div className="inicio-alba">
        <Alba pose="saluda" />
        <div className="bocadillo">
          {SALUDO_ALBA.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <button className="boton-oir" onClick={() => locutar("comun-saludo", SALUDO_ALBA, "alba")}>
            🔊 Escuchar a Alba
          </button>
        </div>
      </div>

      <section className="tarjeta pregunta">
        <h2>¿Venís con peques de 4 a 6 años?</h2>
        <p className="nota">Así sabremos qué explicación os pongo primero. Se puede cambiar en cualquier parada.</p>
        <button className={`boton grande ${modo === "peques" ? "elegido" : ""}`} onClick={() => elegir("peques")}>
          Sí, venimos con peques
        </button>
        <button className={`boton grande secundario ${modo === "todos" ? "elegido" : ""}`} onClick={() => elegir("todos")}>
          No, todos tenemos 7 años o más
        </button>
      </section>

      <p className="aviso-prueba">Versión de prueba</p>
    </main>
  );
}
