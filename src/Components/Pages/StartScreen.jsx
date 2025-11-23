import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './StartScreen.css';

const StartScreen = () => {
    const navigate = useNavigate();
    const audioRef = useRef(null);

    const playInstructions = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    // Use inline style for background image to handle relative path correctly in production
    // or use a class if we are sure about the path. 
    // Best way: import the image if possible, but it's in public.
    // So we use relative path "assets/..." which resolves to repo root.
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
                        🔊 Instrucciones
                    </button>
                    <button className="btn-primary" onClick={() => navigate('/visit')}>
                        Iniciar Visita
                    </button>
                </div>

                {/* Relative path to audio in public folder */}
                <audio ref={audioRef} src="sounds/vozPortadaESP.mp3" />
            </div>
        </div>
    );
};

export default StartScreen;
