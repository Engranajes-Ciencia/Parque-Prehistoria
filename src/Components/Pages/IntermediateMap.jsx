import React, { useMemo } from "react";
import "./IntermediateMap.css";

// Detecta la ruta base de Vite (ej: /Parque-Prehistoria/)
const BASE = import.meta.env.BASE_URL;

// Lista de fondos con ruta correcta
const fondosMapa = [
  `${BASE}assets/form-fondo/fondo1.png`,
  `${BASE}assets/form-fondo/fondo2.png`,
  `${BASE}assets/form-fondo/fondo3.png`,
  `${BASE}assets/form-fondo/fondo4.png`,
  `${BASE}assets/form-fondo/fondo5.png`,
  `${BASE}assets/form-fondo/fondo6.png`,
];

const IntermediateMap = ({ nextStop, onContinue, onBack }) => {
  const isLastStop = !nextStop;

  <p style={{ color: "red" }}>
  isLastStop: {String(isLastStop)}
</p>
console.log("NEXT STOP 👉", nextStop);




  const fondoAleatorio = useMemo(() => {
    return fondosMapa[Math.floor(Math.random() * fondosMapa.length)];
  }, []);

  return (
    <div
      className="intermediate-map"
      style={{
        backgroundImage: `url(${fondoAleatorio})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="map-card">
        <h2>{isLastStop ? "Fin del recorrido" : "Caminad a la siguiente Parada"}</h2>

        <h3 className="next-stop-title">{nextStop?.titulo}</h3>

        {/* 👉 SOLO mostramos el mapa si NO es la última parada */}
        {!isLastStop && (
          <div className="map-placeholder">
            <div
              className="inter-map-top-label"
              style={{
                top: nextStop?.labelPos?.top ?? "20%",
                left: nextStop?.labelPos?.left ?? "50%",
                transform: "translateX(-50%)",
              }}
            >
              Dirigíos aquí
            </div>

            <img
              src={nextStop?.imagenAlternativa}
              alt="Mapa"
              className="map-img"
            />
          </div>
        )}

        {/* Mensaje final */}
        {isLastStop && (
          <p className="final-message">
            Has completado la visita 🎉  
            ¡Gracias por explorar el parque!
          </p>
        )}

        <div className="nav-controls-map">
          {isLastStop ? (
            <>
              <button className="btn-secondary" onClick={onBack}>
                Volver al mapa
              </button>
              <button className="btn-primary" onClick={onContinue}>
                Finalizar visita 🎓
              </button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={onBack}>
                Volver
              </button>
              <button className="btn-primary" onClick={onContinue}>
                Continuar →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntermediateMap;







