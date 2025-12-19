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

    // 3️⃣ Fuente
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // 4️⃣ Fecha
    const today = new Date().toLocaleDateString("es-ES");

    // 5️⃣ Escribir el NOMBRE (ajusta coordenadas si quieres)
    page.drawText(name.toUpperCase(), {
      x: 200,
      y: 370,
      size: 24,
      font,
      color: rgb(0, 0, 0), // rojo similar al diploma
    });

    // 6️⃣ Escribir la FECHA
    page.drawText(today, {
      x: 380,
      y: 190,
      size: 24,
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

  return (
    <div className="final-screen">
      <div className="final-card">
        <h1>¡Has completado la visita! 🎉</h1>

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
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              className="final-tag"
              disabled={!name}
              onClick={downloadDiploma}
            >
              Descargar Diploma
            </button>
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






