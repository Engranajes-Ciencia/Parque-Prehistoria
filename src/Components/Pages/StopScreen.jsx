import React, { useRef, useEffect } from 'react';
import './StopScreen.css';

const StopScreen = ({ stop, onNext, onPrev, stopIndex, totalStops }) => {
    const audioGeneralRef = useRef(null);
    const audioKidsRef = useRef(null);

    // Reset audios when stop changes
    useEffect(() => {
        if (audioGeneralRef.current) {
            audioGeneralRef.current.pause();
            audioGeneralRef.current.currentTime = 0;
        }
        if (audioKidsRef.current) {
            audioKidsRef.current.pause();
            audioKidsRef.current.currentTime = 0;
        }
    }, [stop]);

    const playGeneral = () => {
        if (audioKidsRef.current) audioKidsRef.current.pause();
        if (audioGeneralRef.current) audioGeneralRef.current.play();
    };

    const playKids = () => {
        if (audioGeneralRef.current) audioGeneralRef.current.pause();
        if (audioKidsRef.current) audioKidsRef.current.play();
    };

    return (
        <div className="stop-screen" style={{ backgroundImage: `url(${stop.imagenAlternativa})` }}>
            <div className="stop-overlay">
                <div className="stop-header">
                    <span className="stop-counter">Parada {stopIndex + 1} / {totalStops}</span>
                    <h2 className="stop-title">{stop.titulo}</h2>
                </div>

                <div className="stop-content-card">
                    <p className="stop-location">{stop.ubicacion}</p>

                    <div className="audio-controls">
                        <button className="btn-audio" onClick={playGeneral}>
                            🎧 Audio General
                        </button>
                        <button className="btn-audio" onClick={playKids}>
                            🧒 Audio Infantil
                        </button>
                    </div>

                    <div className="did-you-know">
                        <h3>¿Sabías qué...</h3>
                        <p>Aquí iría el texto de curiosidades si existiera en el JSON, o un texto genérico.</p>
                    </div>
                </div>

                <div className="nav-controls">
                    <button className="nav-btn prev" onClick={onPrev}>←</button>
                    <button className="nav-btn next" onClick={onNext}>→</button>
                </div>

                <audio ref={audioGeneralRef} src={stop.audio} />
                <audio ref={audioKidsRef} src={stop.audioENG} /> {/* User noted audioENG is actually kids audio */}
            </div>
        </div>
    );
};

export default StopScreen;
