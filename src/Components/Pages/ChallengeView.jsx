import React from 'react';
import './ChallengeView.css';

const ChallengeView = ({ url, onFinish }) => {
    return (
        <div className="challenge-view">
            <div className="challenge-container">
                <iframe
                    src={url}
                    title="Reto Genially"
                    className="genially-iframe"
                    allowFullScreen
                ></iframe>

                <button className="btn-close-challenge" onClick={onFinish}>
                    Terminar Reto y Continuar
                </button>
            </div>
        </div>
    );
};

export default ChallengeView;
