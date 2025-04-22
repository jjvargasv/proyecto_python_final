// Este componente queda como el principal para mostrar productos en listados y catálogos.
// Se mantiene porque es simple, uniforme y fácil de mantener.

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MiniGaleria from "./MiniGaleria";
import { agregarFavorito, eliminarFavorito, fetchFavoritos } from "../utils/favoritosAPI";
import useToast from "../hooks/useToast";

// Componente para mostrar una tarjeta de producto individual
export default function CardProductos({ producto, onAddToCart }) {
  // Estado para manejar si el producto es favorito
  const [esFavorito, setEsFavorito] = useState(false);
  // Estado para animación del ícono de favorito
  const [heartAnim, setHeartAnim] = useState(false);
  // Estado para controlar si está cargando la acción de favorito
  const [loadingFav, setLoadingFav] = useState(false);
  // Estado para almacenar el ID del favorito
  const [favoritoId, setFavoritoId] = useState(null);

  // Instancia de la función de navegación
  const navigate = useNavigate();
  // Instancia del hook para mostrar notificaciones tipo toast
  const { showToast, ToastComponent } = useToast();

  // Efecto para verificar si el producto es favorito al montar el componente
  useEffect(() => {
    async function checkFavorito() {
      try {
        // Llamada a la API para obtener los favoritos del usuario
        const favoritos = await fetchFavoritos();
        // Busca el favorito que corresponde al producto actual
        const fav = favoritos.find(f => String(f.producto.id) === String(producto.id));
        if (fav) {
          // Si el producto es favorito, actualiza el estado
          setEsFavorito(true);
          setFavoritoId(fav.id);
        } else {
          // Si el producto no es favorito, actualiza el estado
          setEsFavorito(false);
          setFavoritoId(null);
        }
      } catch {
        // Si hay un error, actualiza el estado a no favorito
        setEsFavorito(false);
        setFavoritoId(null);
      }
    }
    checkFavorito();
    // eslint-disable-next-line
  }, [producto.id]);

  // Función para manejar el click en el ícono de favorito
  async function handleFavorito(e) {
    e.stopPropagation();
    setLoadingFav(true);
    setHeartAnim(true);
    try {
      if (esFavorito && favoritoId) {
        // Si el producto es favorito, llama a la API para eliminar el favorito
        await eliminarFavorito(favoritoId);
        setEsFavorito(false);
        setFavoritoId(null);
        showToast("Quitado de favoritos", "info");
      } else {
        // Si el producto no es favorito, llama a la API para agregar el favorito
        const nuevo = await agregarFavorito(producto.id);
        setEsFavorito(true);
        setFavoritoId(nuevo.id);
        showToast("Agregado a favoritos", "success");
      }
    } catch (err) {
      // Si hay un error, muestra una notificación de error
      showToast("Error al actualizar favoritos", "error");
    } finally {
      setLoadingFav(false);
      setTimeout(() => setHeartAnim(false), 300);
    }
  }

  // Renderizado de la tarjeta de producto
  return (
    <div
      className="bg-white/10 rounded-lg shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer mb-6 w-full max-w-xs mx-auto sm:max-w-full sm:mx-0"
      onClick={() => navigate(`/productos/${producto.id}`)}
    >
      {/* Botón para marcar/desmarcar como favorito */}
      <button
        className={`absolute top-2 right-2 text-2xl ${esFavorito ? "text-red-500" : "text-gray-300"} transition-transform duration-200 "${heartAnim ? "scale-125" : "scale-100"}"`}
        title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
        style={{ zIndex: 2 }}
        onClick={handleFavorito}
        disabled={loadingFav}
        aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        {esFavorito ? "♥" : "♡"}
      </button>
      {/* Galería de imágenes del producto */}
      <MiniGaleria
        imagenes={producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes : (producto.images && producto.images.length > 0 ? producto.images : (producto.image_url || producto.imagen || producto.image ? [{ image: producto.image_url || producto.imagen || producto.image }] : []))}
        alt={producto.nombre || producto.name}
        size={96}
        className="sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
      />
      {/* Nombre del producto */}
      <h3 className="text-base font-bold text-purple-100 mt-2 mb-1 text-center truncate w-full md:text-lg lg:text-xl" title={producto.nombre || producto.name}>
        {(producto.nombre || producto.name).length > 20 ? (producto.nombre || producto.name).slice(0, 20) + '…' : (producto.nombre || producto.name)}
      </h3>
      {/* Precio del producto */}
      <div className="text-lg font-bold text-purple-200 mb-2 md:text-xl lg:text-2xl">
        {Number(producto.precio || producto.price).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
      </div>
      {/* Botón para agregar al carrito */}
      {typeof onAddToCart === 'function' && (!producto.existencias || producto.existencias < 1) ? null : (
        <button
          className={`w-full px-3 py-1 rounded-lg font-bold transition-colors mt-auto ${!producto.existencias || producto.existencias < 1 ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-800 text-white"} md:py-2 md:text-base lg:text-lg`}
          onClick={e => { e.stopPropagation(); !(!producto.existencias || producto.existencias < 1) && onAddToCart(producto); }}
          disabled={!producto.existencias || producto.existencias < 1}
        >
          Agregar al carrito
        </button>
      )}
      {/* Componente para mostrar notificaciones tipo toast */}
      <ToastComponent />
    </div>
  );
}
