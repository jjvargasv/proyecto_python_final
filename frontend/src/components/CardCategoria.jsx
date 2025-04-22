import React from "react";
import MiniGaleria from "./MiniGaleria";

// Componente para mostrar una tarjeta de producto en la vista de categorías
export default function CardCategoria({ producto, onClick }) {
  // La función devuelve una tarjeta visual con imagen, nombre y precio del producto
  return (
    <div
      // Estilos de la tarjeta: fondo, sombra, redondeado, padding, flexbox, transición y cursor
      className="bg-white/10 hover:bg-purple-300/20 shadow-md rounded-xl p-4 flex flex-col items-center transition-transform duration-200 hover:scale-105 cursor-pointer group w-56 min-h-[200px] max-w-56 justify-between animate-fadein"
      // Evento de clic para la tarjeta
      onClick={onClick}
    >
      {/* Galería de imágenes del producto */}
      <MiniGaleria
        // Imágenes del producto: si existe la propiedad "imagenes", se utiliza; de lo contrario, se busca en "images" o "image_url"
        imagenes={producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : (producto.images && producto.images.length > 0 ? producto.images : (producto.image_url || producto.imagen || producto.image ? [{ image: producto.image_url || producto.imagen || producto.image }] : []))}
        // Texto alternativo para la imagen
        alt={producto.nombre || producto.name}
        // Tamaño de la imagen
        size={80}
        // Imagen redondeada
        rounded={true}
      />
      {/* Nombre del producto */}
      <h3
        // Estilos del nombre del producto: texto, fuente, color, margen y truncamiento
        className="text-base font-bold text-white mt-2 mb-1 text-center truncate w-full"
        // Título del nombre del producto
        title={producto.nombre || producto.name}
      >
        {/* Si el nombre del producto es demasiado largo, se trunca a 20 caracteres y se agrega un indicador de truncamiento */}
        {(producto.nombre || producto.name).length > 20 ? (producto.nombre || producto.name).slice(0, 20) + '…' : (producto.nombre || producto.name)}
      </h3>
      {/* Precio del producto */}
      <div
        // Estilos del precio del producto: texto, fuente, color y margen
        className="text-lg font-bold text-white mb-4"
      >
        {/* Formateamos el precio como moneda colombiana con máximo 0 decimales */}
        {Number(producto.precio || producto.price).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
      </div>
      {/* Botón para ver el producto */}
      <button
        // Estilos del botón: fondo, texto, padding, redondeado, fuente y transición
        className="bg-white/40 hover:bg-purple-400/70 text-white px-3 py-1 rounded-full font-semibold transition-colors shadow mt-auto"
      >
        Ver producto
      </button>
    </div>
  );
}
