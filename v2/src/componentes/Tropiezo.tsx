import { Component, type ReactNode } from "react";
import { ir } from "../navegacion";

// Red de seguridad por pantalla: si una pantalla falla al dibujarse (un guion mal editado,
// un navegador raro…), se ve este aviso con salida en lugar de la app entera en blanco.
// En App va con key={ruta}: al cambiar de pantalla, se vuelve a intentar.

interface Estado {
  fallo: boolean;
}

export default class Tropiezo extends Component<{ children: ReactNode }, Estado> {
  state: Estado = { fallo: false };

  static getDerivedStateFromError(): Estado {
    return { fallo: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Fallo en la pantalla:", error);
  }

  render() {
    if (!this.state.fallo) return this.props.children;
    return (
      <main className="pantalla">
        <section className="tarjeta">
          <h2>¡Uy! Esta pantalla se ha atascado</h2>
          <p>Probad a volver al recorrido. Si sigue pasando, recargad la página: lo conseguido (pegatinas y misiones) no se pierde.</p>
          <button className="boton grande" onClick={() => ir("/recorrido", true)}>
            Volver al recorrido
          </button>
          <button className="boton secundario" onClick={() => location.reload()}>
            Recargar
          </button>
        </section>
      </main>
    );
  }
}
