import React from 'react';
import './IntermediateMap.css';

const IntermediateMap = ({ nextStop, nextStopIndex, onContinue, onBack }) => {
    return (
        <div className="intermediate-map">
            <div className="map-card">
                <h2>Siguiente Parada</h2>
                <h3 className="next-stop-title">{nextStop?.titulo}</h3>

                <div className="map-placeholder">
                    {/* Placeholder for map image. 
                    Ideally this would be a dynamic map showing the path. 
                    For now, a static image or the next stop's image. 
                */}
                    <img src={nextStop?.imagenAlternativa} alt="Mapa" className="map-img" />
                    <p className="map-instruction">Dirígete hacia la parada {nextStopIndex}</p>
                </div>

                <div className="nav-controls-map">
                    <button className="btn-secondary" onClick={onBack}>Volver</button>
                    <button className="btn-primary" onClick={onContinue}>Continuar →</button>
                </div>
            </div>
        </div>
    );
};

export default IntermediateMap;
