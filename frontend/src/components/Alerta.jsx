import React from "react";

export default function Alerta({ tipo = "info", mensaje, onClose }) {
  const colores = {
    exito: "bg-green-100 border-green-400 text-green-800",
    error: "bg-red-100 border-red-400 text-red-800",
    info: "bg-blue-100 border-blue-400 text-blue-800",
    advertencia: "bg-yellow-100 border-yellow-400 text-yellow-800",
  };

  return (
    <div
      className={`border-l-4 p-4 mb-4 rounded shadow transition-all flex items-center justify-between ${colores[tipo] || colores.info}`}
      role="alert"
    >
      <span>{mensaje}</span>
      {onClose && (
        <button
          className="ml-4 text-xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
      )}
    </div>
  );
}
