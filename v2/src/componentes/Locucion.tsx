import { useEffect, useRef, useState } from "react";
import type { Modo } from "../estado";
import { callar, locutar, pausar, reanudar, usePista } from "../voz";

interface Props {
  todos: string[];
  peques: string[];
  pistas: { todos: string; peques: string };
  modoInicial: Modo;
}

type Estado = "parado" | "sonando" | "pausado";

export default function Locucion({ todos, peques, pistas, modoInicial }: Props) {
  const [modo, setModo] = useState<Modo>(modoInicial);
  const [estado, setEstado] = useState<Estado>("parado");
  const [frase, setFrase] = useState(-1);
  const [verTexto, setVerTexto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  const parrafos = modo === "todos" ? todos : peques;
  const clave = modo === "todos" ? pistas.todos : pistas.peques;
  const { frases, grabada } = usePista(clave, parrafos);

  useEffect(() => callar, []);

  useEffect(() => {
    const contenedor = caja.current;
    const actual = contenedor?.querySelector<HTMLElement>(".frase.actual");
    if (contenedor && actual) {
      // Posición de la frase DENTRO de la caja. (Con offsetTop se medía desde la página, no
      // desde la caja, y el texto saltaba al final en cada frase: lo vio Álvaro el 26-sep.)
      const dentro = actual.getBoundingClientRect().top - contenedor.getBoundingClientRect().top + contenedor.scrollTop;
      contenedor.scrollTo({ top: Math.max(0, dentro - contenedor.clientHeight / 3), behavior: "smooth" });
    }
  }, [frase]);

  const parar = () => {
    callar();
    setEstado("parado");
    setFrase(-1);
  };

  const cambiarModo = (m: Modo) => {
    parar();
    setModo(m);
  };

  const escuchar = () => {
    setEstado("sonando");
    setVerTexto(true);
    locutar(clave, parrafos, modo === "peques" ? "alba" : "narrador", {
      alEmpezarFrase: setFrase,
      alTerminar: () => {
        setEstado("parado");
        setFrase(-1);
      },
    });
  };

  const principal = () => {
    if (estado === "parado") return escuchar();
    if (estado === "sonando") {
      pausar();
      return setEstado("pausado");
    }
    reanudar();
    setEstado("sonando");
  };

  const etiqueta =
    estado === "sonando" ? "Pausar" : estado === "pausado" ? "Seguir" : modo === "peques" ? "Escuchar a Alba" : "Escuchar la explicación";

  return (
    <section className="tarjeta locucion">
      <div className="selector" role="tablist" aria-label="Versión de la explicación">
        <button role="tab" aria-selected={modo === "todos"} className={modo === "todos" ? "activo" : ""} onClick={() => cambiarModo("todos")}>
          Para todos
        </button>
        <button role="tab" aria-selected={modo === "peques"} className={modo === "peques" ? "activo" : ""} onClick={() => cambiarModo("peques")}>
          Para peques
        </button>
      </div>

      <button className={`boton-reproducir ${estado}`} onClick={principal}>
        <span className="icono">{estado === "sonando" ? "❚❚" : "▶"}</span>
        {etiqueta}
      </button>

      <div className="locucion-pie">
        <button className="enlace" onClick={() => setVerTexto(!verTexto)}>
          {verTexto ? "Ocultar el texto" : "Leer el texto"}
        </button>
        {estado !== "parado" && (
          <button className="enlace" onClick={parar}>
            Parar
          </button>
        )}
      </div>

      {verTexto && (
        <div className="subtitulos" ref={caja}>
          {frases.map((f, i) => (
            <span key={i} className={`frase ${i === frase ? "actual" : ""} ${frase > i ? "dicha" : ""}`}>
              {f}{" "}
            </span>
          ))}
        </div>
      )}

      {!grabada && <p className="nota">Este texto aún no tiene audio grabado: suena la voz del navegador.</p>}
    </section>
  );
}
