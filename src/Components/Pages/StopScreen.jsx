import React, { useRef, useEffect, useState } from 'react';
import './StopScreen.css';
import sabiasQueData from '../../config/data/sabias_que.json';

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

    const sabiasQueText = sabiasQueData[stop.id];

    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        const baseUrl = import.meta.env.BASE_URL;

        // Check if we have a generated image for this stop (currently 1-7)
        if (stop.id <= 7) {
            setBackgroundImage(`${baseUrl}assets/images/stops/stop_${stop.id}.png`);
        } else {
            // Fallback to random image for other stops
            const backgroundImages = [
                `${baseUrl}assets/images/nogenially/craneos.png`,
                `${baseUrl}assets/images/nogenially/arboles.png`,
                `${baseUrl}assets/images/nogenially/bienvenida.jpeg`,
                `${baseUrl}assets/images/nogenially/dinos.png`,
                `${baseUrl}assets/images/nogenially/laetoli.png`,
                `${baseUrl}assets/images/nogenially/meganeura.png`,
                `${baseUrl}assets/images/nogenially/origen.png`,
                `${baseUrl}assets/images/nogenially/pangea.png`,
                `${baseUrl}assets/images/nogenially/sahara.png`,
                `${baseUrl}assets/images/nogenially/sedentario.png`
            ];
            const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
            setBackgroundImage(randomImage);
        }
    }, [stop]);

    return (
        <div className="stop-screen" style={{ backgroundImage: `url(${backgroundImage})` }}>
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

                    {sabiasQueText && (
                        <div className="did-you-know">
                            <h3>¿Sabías qué...</h3>
                            <p>{sabiasQueText}</p>
                        </div>
                    )}
                </div>

                <div className="nav-controls">
                    <button className="nav-btn prev" onClick={onPrev}>
                        <span className="nav-arrow">←</span> Anterior
                    </button>
                    <button className="nav-btn next" onClick={onNext}>
                        Siguiente <span className="nav-arrow">→</span>
                    </button>
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
