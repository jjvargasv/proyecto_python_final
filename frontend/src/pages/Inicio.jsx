import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFeaturedProducts } from "../utils/api";
import ReseñasInicio from "../components/ReseñasInicio";
import FormReseña from "../components/FormReseña";

function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

export default function Inicio() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts()
      .then(data => {
        setFeatured(data);
        setLoading(false);
      })
      .catch(err => {
        setError("No se pudieron cargar los productos destacados");
        setLoading(false);
      });
    setShowForm(isLoggedIn());
  }, []);

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white py-12">
      {/* Hero principal */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Bienvenido a ALFAREROJT</h1>
        <p className="text-lg md:text-2xl mb-6 font-light">Tu tienda de anime y sublimación favorita</p>
        <Link to="/productos">
          <button className="px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-full shadow-lg text-lg transition">Explorar productos</button>
        </Link>
      </div>
      {/* Productos destacados reales */}
      <div className="w-full max-w-5xl mb-8">
        <h2 className="text-2xl font-bold mb-4">Productos destacados</h2>
        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">{error}</div>
        ) : featured.length === 0 ? (
          <div className="text-center py-8">No hay productos destacados.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featured.map(producto => (
              <div key={producto.id} className="bg-white/10 rounded-lg shadow-lg p-6 flex flex-col items-center">
                {producto.image ? (
                  <img src={producto.image} alt={producto.name} className="w-32 h-32 object-cover rounded-full mb-4" />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-tr from-purple-400 to-pink-300 rounded-full mb-4"></div>
                )}
                <h3 className="text-xl font-semibold mb-2">{producto.name}</h3>
                <p className="text-lg text-purple-200 mb-4">${producto.price}</p>
                <Link to={`/productos/${producto.id}`}><button className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded transition">Ver más</button></Link>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Galería/Video */}
      <div className="w-full max-w-4xl mb-8">
        <iframe className="w-full aspect-video rounded-lg shadow-lg" src="https://www.youtube.com/embed/1QYpQ9VqfY8" title="Anime Video" allowFullScreen></iframe>
      </div>
      {/* Beneficios */}
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-2">🚚</span>
          <p>Envío gratis</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-2">🔒</span>
          <p>Pago seguro</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-2">🤝</span>
          <p>Atención personalizada</p>
        </div>
      </div>
      {/* Suscripción */}
      <form className="flex flex-col md:flex-row items-center gap-2 bg-white/10 p-4 rounded-lg mb-8 w-full max-w-xl mx-auto">
        <input type="email" placeholder="Tu email" className="flex-1 px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none" />
        <button type="submit" className="px-6 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition">Suscribirse al boletín</button>
      </form>
      {/* CTA secundarios */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/productos"><button className="px-4 py-2 bg-purple-800 text-white rounded">Ver catálogo completo</button></Link>
        <Link to="/contacto"><button className="px-4 py-2 bg-white text-purple-800 border border-purple-800 rounded">Contáctanos</button></Link>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded">Síguenos en redes</button></a>
      </div>
      <ReseñasInicio />
      {showForm && <FormReseña />}
    </section>
  );
}
