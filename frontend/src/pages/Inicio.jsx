// Importa las librerías necesarias para el funcionamiento de la página
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchFeaturedProducts } from "../utils/api";
import CardInicio from "../components/CardInicio";
import FavoritosDestacados from "../components/FavoritosDestacados";

// Página principal de inicio de la tienda
export default function Inicio() {
  // Estado para almacenar el historial de navegación
  const navigate = useNavigate();
  
  // Estado para almacenar los productos destacados
  const [featured, setFeatured] = useState([]);
  // Estado para manejar la carga de los productos destacados
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores en la carga de los productos destacados
  const [error, setError] = useState(null);
  
  // Estado para almacenar los productos más vistos
  const [mostViewed, setMostViewed] = useState([]);
  // Estado para manejar la carga de los productos más vistos
  const [loadingMostViewed, setLoadingMostViewed] = useState(true);
  // Estado para manejar errores en la carga de los productos más vistos
  const [errorMostViewed, setErrorMostViewed] = useState(null);

  // Efecto para cargar los productos destacados y más vistos al montar el componente
  useEffect(() => {
    // Llama a la función que maneja la carga de los productos destacados
    fetchFeaturedProducts()
      .then(data => {
        setFeatured(data);
        setLoading(false);
      })
      .catch(err => {
        setError("No se pudieron cargar los productos destacados");
        setLoading(false);
      });
    
    // Llama a la función que maneja la carga de los productos más vistos
    fetch('http://localhost:8000/api/products/?ordering=-views_count')
      .then(res => res.json())
      .then(data => {
        // Ordena de mayor a menor vistas (por si el backend no lo hace)
        const ordenados = [...data].sort((a, b) => (b.views_count ?? 0) - (a.views_count ?? 0));
        setMostViewed(ordenados);
        setLoadingMostViewed(false);
      })
      .catch(() => { setErrorMostViewed('No se pudieron cargar los más vistos'); setLoadingMostViewed(false); });
  }, []);

  // Limita a 8 productos más vistos y destacados
  const mostViewedLimited = mostViewed.slice(0, 8);
  const featuredLimited = featured.slice(0, 8);

  // Renderizado de la página de inicio
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#211044] via-[#3b1d63] to-[#1e1550] text-white py-12 animate-fadein">
      {/* Hero principal */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Bienvenido a ALFAREROJT</h1>
        <p className="text-lg md:text-2xl mb-6 font-light">Tu tienda de anime y sublimación favorita</p>
        <Link to="/productos">
          <button className="px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-full shadow-lg text-lg transition">Explorar productos</button>
        </Link>
      </div>
      {/* Favoritos destacados (solo si hay) */}
      <FavoritosDestacados />
      {/* Productos más vistos */}
      <div className="w-full max-w-5xl mb-8">
        <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wide uppercase">Productos más vistos</h2>
        {loadingMostViewed ? (
          <div className="flex justify-center items-center min-h-[120px]">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-purple-200 h-12 w-12"></div>
          </div>
        ) : errorMostViewed ? (
          <div className="text-red-400 text-center py-8">{errorMostViewed}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mostViewedLimited.map(producto => (
              <CardInicio key={producto.id} producto={producto} onClick={() => navigate(`/productos/${producto.id}`)} />
            ))}
          </div>
        )}
      </div>
      {/* Productos destacados */}
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-white mb-2 mt-8">Productos destacados</h2>
        {loading ? (
          <div className="flex justify-center items-center min-h-[120px]">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-purple-200 h-12 w-12"></div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">{error}</div>
        ) : featuredLimited.length === 0 ? (
          <div className="text-center py-8">No hay productos destacados.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {featuredLimited.map((prod, idx) => (
              <div key={prod.id} className="animate-fadein" style={{ animationDelay: `${idx * 60}ms` }}>
                <CardInicio producto={prod} onClick={() => navigate(`/productos/${prod.id}`)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
