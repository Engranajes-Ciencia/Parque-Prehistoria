import "./FinalScreen.css";
import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const FinalScreen = ({ onBack, onFinish }) => {
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const downloadDiploma = async () => {
    // 1️⃣ Cargar el PDF original
    const existingPdfBytes = await fetch(
      `${import.meta.env.BASE_URL}assets/diploma/diploma.pdf`
    ).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // 2️⃣ Obtener la primera página
    const page = pdfDoc.getPages()[0];

    // 3️⃣ Fuente y medidas
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const text = name.toUpperCase();
    const textSize = 24;
    const { width } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, textSize);

    // 4️⃣ Fecha
    const today = new Date().toLocaleDateString("es-ES");
    const dateSize = 24;
    const dateWidth = font.widthOfTextAtSize(today, dateSize);

    // 5️⃣ Escribir el NOMBRE (Centrado horizontalmente)
    page.drawText(text, {
      x: (width / 2) - (textWidth / 2),
      y: 1000,
      size: textSize,
      font,
      color: rgb(0, 0, 0),
    });

    // 6️⃣ Escribir la FECHA (Centrada horizontalmente)
    page.drawText(today, {
      x: (width / 2) - (dateWidth / 2),
      y: 1490,
      size: dateSize,
      font,
      color: rgb(0, 0, 0),
    });

    // 7️⃣ Descargar
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "diploma-personalizado.pdf";
    link.click();
  };

  const today = new Date().toLocaleDateString("es-ES");

  return (
    <div className="final-screen">
      <div className="final-card">
        <h1>¡Has completado la visita! 🎉</h1>
        <p className="final-date">Fecha: {today}</p>

        {!showForm && (
          <button
            className="final-tag"
            onClick={() => setShowForm(true)}
          >
            🎓 Descargar Diploma
          </button>
        )}

        {showForm && (
          <div className="diploma-form">
            <button
              className="final-tag"
              disabled={!name}
              onClick={downloadDiploma}
            >
              Descargar Diploma
            </button>

            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="final-actions">
          <button className="btn-secondary" onClick={onBack}>
            Volver
          </button>
          <button className="btn-primary" onClick={onFinish}>
            Finalizar visita
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalScreen;






