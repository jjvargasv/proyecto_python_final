import React from "react";
import MiniGaleria from "./MiniGaleria";

export default function CardInicio({ producto, onClick }) {
  console.log('CardInicio producto:', producto);
  return (
    <div
      className="bg-gradient-to-br from-purple-600 to-indigo-700 shadow-xl rounded-2xl p-4 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer group"
      onClick={() => onClick && onClick()}
    >
      <MiniGaleria
        imagenes={producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : (producto.images && producto.images.length > 0 ? producto.images : (producto.image_url || producto.imagen || producto.image ? [{ image: producto.image_url || producto.imagen || producto.image }] : []))}
        alt={producto.nombre || producto.name}
        size={90}
        rounded={true}
      />
      <h3 className="text-lg font-bold text-white mb-1 truncate w-full text-center">
        {producto.nombre || producto.name}
      </h3>
      <div className="text-sm text-indigo-200 mb-1 text-center line-clamp-2">
        {producto.descripcion || producto.description}
      </div>
      <div className="text-xl font-bold text-yellow-200 mb-2">
        {Number(producto.precio || producto.price).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
      </div>
      <button
        className="bg-white/20 hover:bg-indigo-400 text-white px-4 py-1 rounded-full font-semibold transition-colors shadow-md mt-auto"
        onClick={e => { e.stopPropagation(); onClick && onClick(); }}
      >
        Ver detalle
      </button>
    </div>
  );
}
