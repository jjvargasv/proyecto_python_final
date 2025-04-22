import React, { useState } from "react";

export default function MiniGaleria({ imagenes = [], alt = "Imagen del producto", size = 64, rounded = true }) {
  const [imgIdx, setImgIdx] = useState(0);
  if (!imagenes || imagenes.length === 0) {
    return (
      <div style={{ width: size, height: size }} className={`bg-gradient-to-tr from-purple-400 to-pink-300 ${rounded ? 'rounded' : ''}`}></div>
    );
  }
  // Efecto: Zoom al hacer hover sobre la imagen principal
  return (
    <div className="flex flex-col items-center">
      <div
        className={`overflow-hidden ${rounded ? 'rounded' : ''} shadow-lg border-2 border-purple-400 transition-transform duration-200`}
        style={{ width: size, height: size, position: 'relative' }}
      >
        <img
          src={imagenes[imgIdx].image}
          alt={alt}
          className={`object-cover w-full h-full transition-transform duration-300 hover:scale-125 ${rounded ? 'rounded' : ''}`}
          style={{ cursor: imagenes.length > 1 ? 'pointer' : 'default' }}
        />
        {/* Flechas de navegación si hay más de una imagen */}
        {imagenes.length > 1 && (
          <>
            <button
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-purple-700 text-white rounded-full p-1 text-xs z-10"
              style={{ lineHeight: 1 }}
              onClick={e => { e.stopPropagation(); setImgIdx(idx => (idx - 1 + imagenes.length) % imagenes.length); }}
              aria-label="Anterior"
            >&#8592;</button>
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-purple-700 text-white rounded-full p-1 text-xs z-10"
              style={{ lineHeight: 1 }}
              onClick={e => { e.stopPropagation(); setImgIdx(idx => (idx + 1) % imagenes.length); }}
              aria-label="Siguiente"
            >&#8594;</button>
          </>
        )}
      </div>
      {imagenes.length > 1 && (
        <div className="flex gap-1 justify-center mt-2">
          {imagenes.map((img, idx) => (
            <img
              key={idx}
              src={img.image}
              alt={alt + ' mini ' + (idx + 1)}
              className={`object-cover border-2 ${imgIdx === idx ? 'border-purple-600' : 'border-gray-400'} cursor-pointer ${rounded ? 'rounded' : ''}`}
              style={{ width: size / 3, height: size / 3 }}
              onClick={() => setImgIdx(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
