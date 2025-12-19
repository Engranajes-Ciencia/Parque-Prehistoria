import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import actividades from "../../config/data/actividades.json";
import { marcarActividadComoCompletada } from "../../config/utils/localStorage";
import { validarAvatar, validarNombre } from "../../config/utils/validations";
import { useTranslation } from "react-i18next";
import "../../Styles/Pages/Actividad.css";
import { fondoAleatorio } from "../../config/fondos";

/**
 * Actividad.jsx
 * Componente completo y auto-contenido para mostrar una actividad/parada.
 * - Orden correcto de hooks
 * - Manejo de audios (principal + alternativo) sin solapamiento
 * - Fondo por actividad (o aleatorio si no hay)
 * - Validaciones de acceso
 * - Traducciones con useMemo
 */

function Actividad() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("pages");

  // -------------------------------------------------------------------
  // Datos de la actividad (HOOKS -> deben ir arriba)
  // -------------------------------------------------------------------
  const actividad = useMemo(() => {
    const parsedId = Number(id);
    if (Number.isNaN(parsedId)) return null;
    return actividades.find((a) => a.id === parsedId) || null;
  }, [id]);

  // Variables desde localStorage (no son hooks)
  const avatar = localStorage.getItem("avatar");
  const nombre = localStorage.getItem("nombre");
  const accesoQR = localStorage.getItem("accesoQR");

  // -------------------------------------------------------------------
  // Controles de audio (refs y estados)
  // -------------------------------------------------------------------
  const audioRef = useRef(null); // audio principal (ESP)
  const audioAltRef = useRef(null); // audio alternativo (ENG)

  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioAltPlaying, setIsAudioAltPlaying] = useState(false);

  // Pausar el otro audio cuando uno empieza
  const pauseOtherAudio = useCallback((currentRef) => {
    // Si se lanza el principal, pausar alternativo
    if (
      currentRef === audioRef.current &&
      audioAltRef.current &&
      !audioAltRef.current.paused
    ) {
      audioAltRef.current.pause();
      setIsAudioAltPlaying(false);
    }

    // Si se lanza el alternativo, pausar principal
    if (
      currentRef === audioAltRef.current &&
      audioRef.current &&
      !audioRef.current.paused
    ) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    pauseOtherAudio(audioRef.current);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn("Autoplay bloqueado (audio principal):", e);
          setIsPlaying(true); // el estado puede reflejar intento de reproducción
        });
    }
  }, [isPlaying, pauseOtherAudio]);

  const toggleAudioAlt = useCallback(() => {
    if (!audioAltRef.current) return;
    pauseOtherAudio(audioAltRef.current);

    if (isAudioAltPlaying) {
      audioAltRef.current.pause();
      setIsAudioAltPlaying(false);
    } else {
      audioAltRef.current
        .play()
        .then(() => setIsAudioAltPlaying(true))
        .catch((e) => {
          console.warn("Autoplay bloqueado (audio alternativo):", e);
          setIsAudioAltPlaying(true);
        });
    }
  }, [isAudioAltPlaying, pauseOtherAudio]);

  // Al desmontar / cambiar de actividad, pausar todo
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try { audioRef.current.pause(); } catch {}
        setIsPlaying(false);
      }
      if (audioAltRef.current) {
        try { audioAltRef.current.pause(); } catch {}
        setIsAudioAltPlaying(false);
      }
    };
  }, [id]);

  // -------------------------------------------------------------------
  // Helpers: obtener URL de assets (soporta Vite / public)
  // -------------------------------------------------------------------
  const getAssetUrl = useCallback((path) => {
    if (!path) return "";
    // Si path ya empieza por http o /, lo respetamos; si no, lo convertimos según BASE_URL
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return path; // assets en public
    return `${import.meta.env.BASE_URL}${path}`;
  }, []);

  // -------------------------------------------------------------------
  // Traducciones específicas de la parada (useMemo para rendimiento)
  // -------------------------------------------------------------------
  const traduccionActividad = useMemo(() => {
    // Si id no es válido o no hay traducciones, devolvemos objeto vacío para evitar crashes
    try {
      return t(`${id}`, { returnObjects: true }) || {};
    } catch (e) {
      return {};
    }
  }, [id, t]);

  // -------------------------------------------------------------------
  // Validación acceso: QR, nombre y avatar
  // (Se hace *después* de declarar hooks)
  // -------------------------------------------------------------------
  useEffect(() => {
    if (accesoQR !== "true" || !validarNombre(nombre) || !validarAvatar(avatar)) {
      // Si no tiene acceso, redirigimos al escáner (mostramos aviso)
      alert(t("actividad.accesoDenegado"));
      navigate("/EscanerQR");
    }
    // Marcar como completada, si existe la actividad
    if (actividad) {
      marcarActividadComoCompletada(Number(id));
    }
  }, [id, navigate, avatar, nombre, accesoQR, actividad, t]);

  // -------------------------------------------------------------------
  // Si no hay actividad válida: mostramos fallback sencillo
  // -------------------------------------------------------------------
  if (!actividad) {
    return (
      <div
        className="actividad-container"
        style={{
          backgroundImage: `url(${fondoAleatorio()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <p className="error-msg">{t("actividad.errorActividadNoEncontrada")}</p>
        <button className="btn-volver-mapa" onClick={() => navigate("/")}>
          {t("actividad.volverInicio")}
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // Datos derivados (después de que actividad exista)
  // -------------------------------------------------------------------
  const fondoImageUrl = actividad.imagenFondo || actividad.imagenAlternativa || fondoAleatorio();
  const avatarImgSrc = `assets/avatars/${avatar}.png`; // asumimos ruta en public o getAssetUrl si lo deseas
  const tieneGenially =
    actividad.geniallyURL && actividad.geniallyURL.trim() !== "" && actividad.geniallyURL !== "#";

  // -------------------------------------------------------------------
  // RENDER PRINCIPAL
  // -------------------------------------------------------------------
  return (
    <div
      className="actividad-container"
      style={{
        backgroundImage: `url("${getAssetUrl(fondoImageUrl)}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="saludo-titulo">
        <div className="titulo-mensaje">
          <h3>{traduccionActividad.titulo}</h3>

          {traduccionActividad.avatarDialogo?.mensaje &&
            traduccionActividad.avatarDialogo.mensaje !== "#" && (
              <p>{traduccionActividad.avatarDialogo.mensaje}</p>
            )}
        </div>

        <div className="actividad-header">
          <img
            src={getAssetUrl(avatarImgSrc)}
            alt={t("altText.avatar")}
            className="avatar-actividad"
          />
          <div>
            <h2 className="saludo1">{t("actividad.saludo", { nombre })}</h2>
            {traduccionActividad.avatarDialogo?.dialogo && (
              <p className="dialogo">{traduccionActividad.avatarDialogo.dialogo}</p>
            )}
          </div>
        </div>
      </div>

      {/* Controles de audio */}
      {actividad.audio && (
        <div className="audio-button-container">
          <button
            onClick={toggleAudio}
            className={`audio-button ${isPlaying ? "playing" : ""}`}
            aria-label={isPlaying ? t("actividad.pausarAudio") : t("actividad.reproducirAudio")}
          >
            <i className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play"}`}></i>{" "}
            {isPlaying ? t("actividad.pausarAudio") : t("actividad.reproducirAudio")}
          </button>

          <audio
            ref={audioRef}
            src={getAssetUrl(actividad.audio)}
            preload="auto"
            onEnded={() => setIsPlaying(false)}
          />

          {actividad.audioENG && (
            <>
              <button
                onClick={toggleAudioAlt}
                className={`audio-button-alt ${isAudioAltPlaying ? "playing" : ""}`}
                aria-label={isAudioAltPlaying ? t("actividad.pausarAudioENG") : t("actividad.reproducirAudioENG")}
              >
                <i className={`fa-solid ${isAudioAltPlaying ? "fa-pause" : "fa-play"}`}></i>{" "}
                {isAudioAltPlaying ? t("actividad.pausarAudioENG") : t("actividad.reproducirAudioENG")}
              </button>

              <audio
                ref={audioAltRef}
                src={getAssetUrl(actividad.audioENG)}
                preload="auto"
                onEnded={() => setIsAudioAltPlaying(false)}
              />
            </>
          )}
        </div>
      )}

      {/* Sabías que */}
      {traduccionActividad.avatarDialogo?.sabiasQue &&
        traduccionActividad.avatarDialogo.sabiasQue !== "#" && (
          <p className="sabiasque">
            <strong>{t("actividad.sabiasQue")}</strong> {traduccionActividad.avatarDialogo.sabiasQue}
          </p>
        )}

      {/* Genially o botón siguiente */}
      {tieneGenially ? (
        <div className="actividad-genially">
          <iframe
            src={actividad.geniallyURL}
            width="100%"
            height="clamp(300px, 70vh, 700px)"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title={`genially-${actividad.id}`}
          />
        </div>
      ) : (
        <div className="actividad-siguiente">{/* aquí podrías poner botón para siguiente qr o contenido alternativo */}</div>
      )}

      {/* Botón volver mapa */}
      <div className="navigation-footer">
        <button className="btn-volver" onClick={() => navigate("/entre-actividad")}>
          <i className="fa-solid fa-map-location-dot"></i> {t("actividad.verMapaActividad")}
        </button>
      </div>
    </div>
  );
}

export default Actividad;
