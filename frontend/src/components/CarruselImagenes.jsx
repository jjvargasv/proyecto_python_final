import React, { useState } from "react";

export default function CarruselImagenes({ imagenes = [], alt = "Imagen producto", onClickImagen }) {
  const [actual, setActual] = useState(0);
  if (!imagenes.length) return null;

  const avanzar = (e) => {
    e.stopPropagation();
    setActual((prev) => (prev + 1) % imagenes.length);
  };
  const retroceder = (e) => {
    e.stopPropagation();
    setActual((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div className="relative w-32 h-32 mb-4 flex items-center justify-center group cursor-pointer" onClick={onClickImagen}>
      <img
        src={imagenes[actual].image}
        alt={alt + ' ' + (actual + 1)}
        className="w-32 h-32 object-cover rounded border-2 border-purple-300 transition-all duration-200"
      />
      {imagenes.length > 1 && (
        <>
          <button
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
            onClick={retroceder}
            aria-label="Imagen anterior"
            type="button"
          >
            &#8592;
          </button>
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
            onClick={avanzar}
            aria-label="Imagen siguiente"
            type="button"
          >
            &#8594;
          </button>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {imagenes.map((_, idx) => (
              <span key={idx} className={`w-2 h-2 rounded-full ${actual === idx ? 'bg-purple-400' : 'bg-white/40'} inline-block`}></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
