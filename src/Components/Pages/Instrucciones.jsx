import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Instrucciones.css';

const Instrucciones = () => {
    const navigate = useNavigate();

    return (
        <div className="instrucciones-page">
            <div className="instrucciones-overlay">
                
                <h1 className="instrucciones-title">¿Cómo usar la App?</h1>

                <div className="instrucciones-content">
                    {/* Tarjeta 1: Parada */}
                    <div className="instruccion-item glass-card card-parada">
                        <div className="instruccion-number">1</div>
                        <div className="instruccion-text">
                            <h3>Número y Título de Parada</h3>
                            <p>Te indica en qué punto del recorrido te encuentras y qué estás viendo.</p>
                        </div>
                    </div>

                    {/* Tarjeta 2: Audios */}
                    <div className="instruccion-item glass-card card-audios">
                        <div className="instruccion-number">2</div>
                        <div className="instruccion-text">
                            <h3>Audios Explicativos</h3>
                            <p>Escucha la información general o una versión especial para los más pequeños.</p>
                        </div>
                    </div>

                    {/* Tarjeta 3: Sabías qué */}
                    <div className="instruccion-item glass-card card-sabias">
                        <div className="instruccion-number">3</div>
                        <div className="instruccion-text">
                            <h3>¿Sabías qué...?</h3>
                            <p>Descubre datos curiosos ocultos en cada parada pulsando este botón.</p>
                        </div>
                    </div>

                    {/* Tarjeta 4: Navegación */}
                    <div className="instruccion-item glass-card card-navegacion">
                        <div className="instruccion-number">4</div>
                        <div className="instruccion-text">
                            <h3>Mapas y Desafíos</h3>
                            <p>Avanza a la siguiente parada usando el mapa y completa los retos para terminar la visita.</p>
                        </div>
                    </div>
                </div>

                <div className="instrucciones-footer">
                    <button className="btn-primary" onClick={() => navigate('/')}>
                        ¡Entendido!
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Instrucciones;
