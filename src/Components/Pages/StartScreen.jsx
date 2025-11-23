import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartScreen.css'; // We will create this

const StartScreen = () => {
    const navigate = useNavigate();
    const audioRef = useRef(null);

    const playInstructions = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    return (
        <div className="start-screen">
            <div className="start-content">
                <h1 className="app-title">Prehistoria</h1>
                <p className="app-subtitle">Una aventura en el tiempo</p>

                <div className="button-group">
                    <button className="btn-secondary" onClick={playInstructions}>
                        🔊 Instrucciones
                    </button>
                    <button className="btn-primary" onClick={() => navigate('/visit')}>
                        Iniciar Visita
                    </button>
                </div>

                {/* Hidden audio element for instructions. 
            TODO: Check if there is a specific instruction audio file. 
            Using a placeholder or the first stop audio if none exists. 
            User mentioned "audio con las instrucciones". I'll assume a file exists or use a placeholder.
        */}
                <audio ref={audioRef} src="/sounds/vozPortadaESP.mp3" />
            </div>
        </div>
    );
};

export default StartScreen;
