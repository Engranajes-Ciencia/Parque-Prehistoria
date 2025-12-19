import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ACTIVIDADES } from "../constants";
import { getActividadesCompletadas, getAvatar, getNombre } from "../utils/localStorage";
import { useDraggableLabel } from "../hooks/useDraggableLabel";
import { fondoAleatorio } from "../../config/fondos";


const EntreActividades = () => {
  const { t } = useTranslation("pages");
  const navigate = useNavigate();

  const completadas = getActividadesCompletadas();
  const avatar = getAvatar();
  const nombre = getNombre();
  const ultimaCompletada = completadas.at(-1) ?? null;

  const progressPercentage = (completadas.length / ACTIVIDADES.length) * 100;

  // Nuestro hook
  const { mapRef, labelRef, pos, onPointerDown } = useDraggableLabel();

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed flex flex-col items-center p-4 md:p-8 font-sans overflow-x-hidden"
      style={{
        backgroundImage: `url(${fondoAleatorio()})`,
      }}
    >
      {/* Título */}
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] animate-fade-in-down text-center">
        {t("entreActividades.mapa")}
      </h2>

      {/* Información del guía */}
      <div className="flex flex-col items-center mb-6 animate-fade-in-up w-full max-w-2xl">
        <div className="relative group">
          <img
            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatar}`}
            alt="avatar"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-yellow-400 bg-white shadow-lg p-1 mb-4 transition-transform group-hover:scale-110"
          />
        </div>

        <div className="bg-yellow-50 border-l-8 border-yellow-400 rounded-lg p-4 shadow-lg w-full text-center">
          <p className="text-lg text-slate-800 font-semibold">
            {t("entreActividades.guiaTexto", {
              nombre,
              completadas: completadas.length,
              totalActividades: ACTIVIDADES.length,
            })}
          </p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="w-full max-w-2xl h-6 bg-slate-200/30 backdrop-blur-sm border-2 border-green-200 rounded-full overflow-hidden mb-10 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-600 text-xs text-white font-bold flex items-center justify-end px-3 transition-all duration-700"
          style={{ width: `${progressPercentage}%` }}
        >
          {Math.round(progressPercentage)}%
        </div>
      </div>

      {/* Contenedor del mapa */}
      <div
        ref={mapRef}
        className="relative w-full max-w-4xl aspect-video rounded-3xl border-8 border-white/20 bg-white shadow-2xl overflow-hidden mb-10"
      >
        <img
          src="/img/mapa.png"
          alt="Mapa"
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Etiqueta arrastrable */}
        {ultimaCompletada !== null && (
          <div
            ref={labelRef}
            onPointerDown={onPointerDown}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            className="absolute z-50 bg-purple-600 text-white px-4 py-2 rounded-xl font-bold cursor-grab active:cursor-grabbing shadow-lg"
          >
            {t("entreActividades.siguiente")}
          </div>
        )}

        {/* Marcadores */}
        {ACTIVIDADES.map((act) => {
          const done = completadas.includes(act.id);

          return (
            <div
              key={act.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${act.posX}%`, top: `${act.posY}%` }}
            >
              {!done && <span className="absolute inset-0 rounded-full bg-orange-400 opacity-75 animate-ping"></span>}

              <div
                className={`w-10 h-10 rounded-full border-4 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform ${
                  done ? "bg-green-500 border-green-200" : "bg-orange-500 border-white"
                }`}
              >
                <span className="font-bold text-white">{act.id}</span>
              </div>

              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {act.titulo}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botones */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl pb-10">
        <Boton onClick={() => navigate("/final")} color="bg-emerald-700" icon="🎉">
          {t("entreActividades.final")}
        </Boton>

        <Boton onClick={() => navigate("/EscanerQR")} color="bg-blue-600" icon="📷">
          {t("entreActividades.escanear")}
        </Boton>

        <Boton onClick={() => navigate("/vitrina-virtual")} color="bg-amber-600" icon="🏅">
          {t("entreActividades.medallas")}
        </Boton>
      </div>
    </div>
  );
};
const Boton = ({ children, onClick, color, icon }) => (
  <button
    onClick={onClick}
    className={`${color} text-white py-3 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-3 min-w-[200px] border-b-4 border-black/20`}
  >
    {children}
    <span className="text-xl">{icon}</span>
  </button>
);

export default EntreActividades;
