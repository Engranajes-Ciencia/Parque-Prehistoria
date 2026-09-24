import "./FinalScreen.css";
import { useState } from "react";

const FinalScreen = ({ onBack }) => {
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);

  const downloadDiploma = async () => {
    if (generating) return;
    setGenerating(true);
    try {
    // pdf-lib se carga bajo demanda para aligerar el bundle inicial
    const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");

    // 1️⃣ Cargar el PDF original
    const response = await fetch(
      `${import.meta.env.BASE_URL}assets/diploma/diploma.pdf`
    );
    if (!response.ok) throw new Error(`No se pudo cargar el diploma (${response.status})`);
    const existingPdfBytes = await response.arrayBuffer();

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // 2️⃣ Obtener la primera página
    const page = pdfDoc.getPages()[0];

    // 3️⃣ Fuente y medidas
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const text = name.toUpperCase();
    const textSize = 90;
    const { width } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, textSize);

    // 4️⃣ Fecha
    const today = new Date().toLocaleDateString("es-ES");
    const dateSize = 60;
    const dateWidth = font.widthOfTextAtSize(today, dateSize);

    // 5️⃣ Escribir el NOMBRE (Centrado horizontalmente)
    page.drawText(text, {
      x: (width / 2) - (textWidth / 2),
      y: 780,
      size: textSize,
      font,
      color: rgb(0, 0, 0),
    });

    // 6️⃣ Escribir la FECHA (Centrada horizontalmente)
    page.drawText(today, {
      x: (width / 2) - (dateWidth / 2),
      y: 1520,
      size: dateSize,
      font,
      color: rgb(0, 0, 0),
    });

    // 7️⃣ Descargar
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "diploma-personalizado.pdf";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("Error generando el diploma:", error);
      alert("No se pudo generar el diploma. Comprueba la conexión e inténtalo de nuevo.");
    } finally {
      setGenerating(false);
    }
  };

  const today = new Date().toLocaleDateString("es-ES");

  return (
    <div className="final-screen">
      <div className="final-card">
        <h1>🎉 ¡Has completado la visita! 🎉</h1>
        <p className="final-date">Fecha: {today}</p>

        {!showForm && (
          <button
            className="final-tag"
            onClick={() => setShowForm(true)}
          >
            Generar diploma
          </button>
        )}

        {showForm && (
          <div className="diploma-form">
            <button
              className="final-tag"
              disabled={!name.trim() || generating}
              onClick={downloadDiploma}
            >
              {generating ? "Generando..." : "Descargar diploma"}
            </button>

            <input
              type="text"
              placeholder="Nombre de la familia o equipo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="final-actions">
          <button className="btn-secondary" onClick={onBack}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalScreen;






