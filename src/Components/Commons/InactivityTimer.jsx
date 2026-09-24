import { useEffect } from "react";

const InactivityTimer = ({ timeout = 900000, onTimeout }) => {
  useEffect(() => {
    if (typeof onTimeout !== "function") return;

    let timerId = null;

    const resetTimer = () => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        onTimeout(); // Ejecuta la función si pasa el tiempo de inactividad.
      }, timeout);
    };

    const events = ["touchstart", "touchmove", "pointerdown", "keydown", "scroll"];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerId) clearTimeout(timerId);
    };
  }, [timeout, onTimeout]);

  return null;
};

export default InactivityTimer;
