import React, { useMemo } from "react";
import "./IntermediateMap.css";
import { fondoAleatorio } from "../../config/fondos";

const IntermediateMap = ({ nextStop, onContinue, onBack }) => {
  const fondo = useMemo(() => fondoAleatorio(), []);

  // VisitController solo muestra este componente cuando hay una parada siguiente;
  // si no la hay, se muestra FinalScreen.
  if (!nextStop) return null;

  return (
    <div
      className="intermediate-map"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="map-card">
        <h2>Caminad a la siguiente parada</h2>

        <h3 className="next-stop-title">{nextStop.titulo}</h3>

        <div className="map-placeholder">
          <div
            className="inter-map-top-label"
            style={{
              top: nextStop.labelPos?.top ?? "20%",
              left: nextStop.labelPos?.left ?? "50%",
              transform: "translateX(-50%)",
            }}
          >
            Dirigíos aquí
          </div>

          <img
            src={nextStop.imagenAlternativa}
            alt="Mapa"
            className="map-img"
          />
        </div>

        <div className="nav-controls-map">
          <button className="btn-secondary" onClick={onBack}>
            Volver
          </button>
          <button className="btn-primary" onClick={onContinue}>
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntermediateMap;
