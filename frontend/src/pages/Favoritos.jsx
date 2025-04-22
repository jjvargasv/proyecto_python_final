// Página para mostrar los productos favoritos del usuario
import React, { useEffect, useState } from "react";
import { fetchFavoritos, eliminarFavorito } from "../utils/favoritosAPI";
import { useNavigate } from "react-router-dom";

export default function Favoritos() {
  // Estado para almacenar los favoritos
  const [favoritos, setFavoritos] = useState([]);
  // Estado para controlar la carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Hook para navegar entre páginas
  const navigate = useNavigate();

  // Efecto para cargar los favoritos al montar el componente
  useEffect(() => {
    // Llamada a la API para obtener los favoritos
    fetchFavoritos()
      .then(data => {
        console.log("Favoritos API response:", data);
        // Actualiza el estado con los favoritos obtenidos
        setFavoritos(data);
      })
      .catch(e => {
        // Maneja errores al cargar favoritos
        setError(e.message);
        console.error("Error al cargar favoritos:", e);
      })
      .finally(() => {
        // Finaliza la carga
        setLoading(false);
      });
  }, []);

  // Función para eliminar un producto de favoritos
  async function handleEliminar(favoritoId) {
    // Pregunta al usuario si está seguro de eliminar el favorito
    if (!window.confirm("¿Eliminar de favoritos?")) return;
    try {
      // Llamada a la API para eliminar el favorito
      await eliminarFavorito(favoritoId);
      // Actualiza el estado eliminando el favorito
      setFavoritos(favoritos.filter(f => f.id !== favoritoId));
    } catch (e) {
      // Maneja errores al eliminar favorito
      setError(e.message);
    }
  }

  // Muestra mensaje de carga si es necesario
  if (loading) return <div className="text-center text-white py-12">Cargando favoritos...</div>;
  // Muestra mensaje de error si es necesario
  if (error) return <div className="text-center text-red-400 py-12">{error}</div>;
  // Muestra mensaje si no hay favoritos
  if (!Array.isArray(favoritos)) return <div className="text-center text-red-400 py-12">La respuesta de favoritos no es un array válido.</div>;
  if (favoritos.length === 0) return <div className="text-center text-gray-300 py-12">No tienes productos favoritos.</div>;

  return (
    // Sección para mostrar los favoritos
    <section className="w-full max-w-5xl mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Favoritos</h2>
      {/* Grid para mostrar las tarjetas de productos favoritos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {favoritos.map((fav) => (
          <div key={fav.id} className="bg-white/10 rounded-lg shadow-lg p-4 flex flex-col items-center mb-6 w-full max-w-xs mx-auto sm:max-w-none sm:mx-0">
            {/* Imagen del producto favorito */}
            <img src={fav.producto.image_url || fav.producto.image} alt={fav.producto.name} className="w-32 h-32 object-cover rounded mb-2" />
            {/* Nombre y precio del producto favorito */}
            <h3 className="text-base font-bold text-purple-100 mt-2 mb-1 text-center truncate w-full md:text-lg lg:text-xl" title={fav.producto.nombre || fav.producto.name}>
              {(fav.producto.nombre || fav.producto.name).length > 20 ? (fav.producto.nombre || fav.producto.name).slice(0, 20) + '…' : (fav.producto.nombre || fav.producto.name)}
            </h3>
            <div className="text-purple-200 mb-2">
              {Number(fav.producto.precio || fav.producto.price).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
            </div>
            {/* Botón para eliminar de favoritos */}
            <button className="px-3 py-1 bg-red-600 text-white rounded mb-2 w-full" onClick={() => handleEliminar(fav.id)}>Eliminar</button>
            {/* Botón para ver detalles del producto */}
            <button className="px-3 py-1 bg-purple-700 text-white rounded w-full" onClick={() => navigate(`/productos/${fav.producto.id}`)}>Ver producto</button>
          </div>
        ))}
      </div>
    </section>
  );
}
