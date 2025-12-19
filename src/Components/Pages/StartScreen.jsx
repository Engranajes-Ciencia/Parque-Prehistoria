import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartScreen.css';

const StartScreen = () => {
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playInstructions = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {
                console.warn("Autoplay bloqueado por el navegador");
            });
        }

        setIsPlaying(!isPlaying);
    };

    const bgStyle = {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('assets/images/nogenially/bienvenida.jpeg')`
    };

    return (
        <div className="start-screen" style={bgStyle}>
            <div className="start-content">
                <h1 className="app-title">Prehistoria</h1>
                <p className="app-subtitle">Una aventura en el tiempo</p>

                <div className="button-group">
                    <button className="btn-secondary" onClick={playInstructions}>
                        {isPlaying ? "⏸️ Pausar audio" : "🔊 Instrucciones"}
                    </button>

                    <button className="btn-primary" onClick={() => navigate('/visit')}>
                        Iniciar Visita
                    </button>
                </div>

                <audio ref={audioRef} src="sounds/vozPortadaESP.mp3" />
            </div>
        </div>
    );
};

export default StartScreen;

