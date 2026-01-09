import React from 'react';
import './ChallengePrompt.css';

const ChallengePrompt = ({ onYes, onNo, onBack }) => {
    return (
        <div className="challenge-prompt">
            <div className="prompt-card">
                <h2>¡Desafío Disponible!</h2>
                <p>¿Quieres realizar un juego antes de continuar?</p>

                <div className="prompt-actions">
                    <button className="btn-primary" onClick={onYes}>¡Sí, vamos!</button>
                    <button className="btn-secondary" onClick={onNo}>No, volver al mapa</button>
                </div>

                <button className="btn-text" onClick={onBack}>Volver</button>
            </div>
        </div>
    );
};

export default ChallengePrompt;
