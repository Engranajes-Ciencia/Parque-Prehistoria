import React, { useRef, useEffect, useState } from 'react';
import './StopScreen.css';

const StopScreen = ({ stop, onNext, onPrev, stopIndex, totalStops }) => {
    const audioGeneralRef = useRef(null);
    const audioKidsRef = useRef(null);
    // Track playing state to update UI if needed (optional, but good for button feedback)
    const [isPlayingGeneral, setIsPlayingGeneral] = useState(false);
    const [isPlayingKids, setIsPlayingKids] = useState(false);

    // Reset audios when stop changes
    useEffect(() => {
        if (audioGeneralRef.current) {
            audioGeneralRef.current.pause();
            audioGeneralRef.current.currentTime = 0;
            setIsPlayingGeneral(false);
        }
        if (audioKidsRef.current) {
            audioKidsRef.current.pause();
            audioKidsRef.current.currentTime = 0;
            setIsPlayingKids(false);
        }
    }, [stop]);

    const toggleGeneral = () => {
        if (audioKidsRef.current) {
            audioKidsRef.current.pause();
            setIsPlayingKids(false);
        }

        if (audioGeneralRef.current) {
            if (audioGeneralRef.current.paused) {
                audioGeneralRef.current.play();
                setIsPlayingGeneral(true);
            } else {
                audioGeneralRef.current.pause();
                setIsPlayingGeneral(false);
            }
        }
    };

    const toggleKids = () => {
        if (audioGeneralRef.current) {
            audioGeneralRef.current.pause();
            setIsPlayingGeneral(false);
        }

        if (audioKidsRef.current) {
            if (audioKidsRef.current.paused) {
                audioKidsRef.current.play();
                setIsPlayingKids(true);
            } else {
                audioKidsRef.current.pause();
                setIsPlayingKids(false);
            }
        }
    };

    // Handle audio ending to reset state
    const handleEnded = (type) => {
        if (type === 'general') setIsPlayingGeneral(false);
        if (type === 'kids') setIsPlayingKids(false);
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
                        <button
                            className={`btn-audio ${isPlayingGeneral ? 'playing' : ''}`}
                            onClick={toggleGeneral}
                        >
                            {isPlayingGeneral ? '⏸️ Pausar General' : '🎧 Audio General'}
                        </button>
                        <button
                            className={`btn-audio ${isPlayingKids ? 'playing' : ''}`}
                            onClick={toggleKids}
                        >
                            {isPlayingKids ? '⏸️ Pausar Infantil' : '🧒 Audio Infantil'}
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

                <audio
                    ref={audioGeneralRef}
                    src={stop.audio}
                    onEnded={() => handleEnded('general')}
                />
                <audio
                    ref={audioKidsRef}
                    src={stop.audioENG}
                    onEnded={() => handleEnded('kids')}
                />
            </div>
        </div>
    );
};

export default StopScreen;
