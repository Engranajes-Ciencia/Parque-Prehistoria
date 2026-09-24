import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../Styles/Layout/Header.css";

function Header() {
  const navigate = useNavigate();
  const [modoOscuro, setModoOscuro] = useState(false);
  const { i18n } = useTranslation();

  const [logoClickCount, setLogoClickCount] = useState(0);
  const logoClickTimer = useRef(null);
  const RUTA_SECRETA_ADMIN = "/admin"; // la que hayas definido

  const handleLogoClick = () => {
    setLogoClickCount(prevCount => prevCount + 1);

    // Reiniciar el contador si pasa demasiado tiempo entre clics
    clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => {
      setLogoClickCount(0);
    }, 2000); // Ej: 1.5 segundos para hacer los clics
  };

  useEffect(() => {
    if (logoClickCount >= 6) { // Acceder después de 5 clics
      setLogoClickCount(0); // Resetear contador
      clearTimeout(logoClickTimer.current); // Limpiar timer
      navigate(RUTA_SECRETA_ADMIN);
    }
  }, [logoClickCount, navigate, RUTA_SECRETA_ADMIN]);


  // Efecto para inicializar el tema oscuro y el volumen del audio
  useEffect(() => {
    // Restaurar el modo oscuro desde localStorage
    const savedTheme = localStorage.getItem("modoOscuro");
    const isDark = savedTheme === "true";
    setModoOscuro(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);


  // Toggle para cambiar entre modo oscuro y claro
  const toggleModoOscuro = () => {
    const nuevoEstadoModoOscuro = !modoOscuro; 
    setModoOscuro(nuevoEstadoModoOscuro);
    document.documentElement.classList.toggle("dark", nuevoEstadoModoOscuro);
    localStorage.setItem("modoOscuro", nuevoEstadoModoOscuro);
  };


  // Toggle para cambiar el idioma
  const toggleLanguage = () => {
    const nuevoIdioma = i18n.language === "es" ? "en" : "es"; 
    i18n.changeLanguage(nuevoIdioma);
  };


  // Activar modo kiosco (pantalla completa)
  const activarKiosco = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen(); // Safari
    else if (el.msRequestFullscreen) el.msRequestFullscreen(); // IE/Edge
  };



  return (
    <header className="header">

      <div className="header-left-section">
        <div className="branding" onClick={handleLogoClick} >
          {/* Usar import.meta.env.BASE_URL para rutas de assets estáticos */}
          <img
            src={`${import.meta.env.BASE_URL}assets/images/Logo-principal.png`}
            alt="Logo empresa"
            className="logo"
          />
        </div>

      <h1 className="titulo-header">
        
        <span className="linea1">Parque de la</span><br />
  <span className="linea2">Prehistoria</span>
      </h1>
    </div>

      <div className="botones-header">
        {/* Botones con tooltips y navegación */}
        <button className="icon-btn" onClick={() => navigate("/")}>
          🏠
        </button>

        

        {/* BOTÓN: Escáner QR */}
        <button
          className="icon-btn"
          onClick={() => navigate("/escanerQR")}
        >
          📷 
        </button>


        <button className="icon-btn" onClick={activarKiosco}>
          🖥️
        </button>

        <button className="icon-btn" onClick={toggleModoOscuro}>
          {modoOscuro ? "☀️" : "🌙"}
        </button>

        <button className="icon-btn" onClick={toggleLanguage}>
          {i18n.language === "es" ? "🇪🇸" : "🇬🇧"}
        </button>

        
        
      </div>
    </header>
  );
}

export default Header;
