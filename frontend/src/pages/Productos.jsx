import React, { useEffect, useState } from "react";
import { fetchProductos } from "../api";
import { useCarrito } from "../contexts/CarritoContext";
import { useNavigate } from "react-router-dom";
import CarruselImagenes from "../components/CarruselImagenes";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { agregarAlCarrito } = useCarrito();
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos()
      .then((data) => {
        setProductos(
          data.map((prod) => ({
            id: prod.id,
            nombre: prod.nombre || prod.name,
            descripcion: prod.descripcion || prod.description,
            precio: prod.precio || prod.price,
            existencias: prod.existencias || prod.stock,
            imagen: (prod.imagen || prod.image || "").trim(),
            imagenes: prod.images || [],
            categoria: prod.categoria || prod.category,
          }))
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function handleAgregar(prod) {
    agregarAlCarrito(prod, 1);
    setMensaje(`✔️ ${prod.nombre} agregado al carrito`);
    setTimeout(() => setMensaje(""), 1800);
  }

  if (loading) return <div className="text-center text-white py-12">Cargando productos...</div>;
  if (error) return <div className="text-center text-red-400 py-12">{error}</div>;

  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Productos</h2>
      {mensaje && <div className="mb-4 text-green-400 bg-white/10 rounded px-4 py-2 shadow text-center animate-bounce">{mensaje}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productos.map((prod) => (
          <div key={prod.id} className="bg-white/10 rounded-lg shadow-lg p-6 flex flex-col items-center">
            {/* Carrusel de imágenes si hay varias */}
            {prod.imagenes && prod.imagenes.length > 0 ? (
              <CarruselImagenes imagenes={prod.imagenes} alt={prod.nombre} onClickImagen={() => navigate(`/productos/${prod.id}`)} />
            ) : prod.imagen ? (
              <img src={prod.imagen} alt={prod.nombre} className="w-32 h-32 object-cover rounded mb-4 cursor-pointer" onClick={() => navigate(`/productos/${prod.id}`)} />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-700 rounded mb-4 text-white cursor-pointer" onClick={() => navigate(`/productos/${prod.id}`)}>Sin imagen</div>
            )}
            <h3 className="text-xl font-semibold mb-2 text-white cursor-pointer" onClick={() => navigate(`/productos/${prod.id}`)}>{prod.nombre}</h3>
            <p className="text-sm text-gray-400 mb-2">{prod.descripcion}</p>
            <p className="text-lg text-purple-200 mb-4">{Number(prod.precio).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded transition" onClick={() => handleAgregar(prod)}>
                Agregar al carrito
              </button>
              <button className="px-4 py-2 bg-white text-purple-700 border border-purple-700 rounded transition" onClick={() => navigate(`/productos/${prod.id}`)}>Ver más</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
