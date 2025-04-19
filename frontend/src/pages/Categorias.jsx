import React, { useEffect, useState } from "react";
import { fetchCategorias, fetchProductosPorCategoria } from "../utils/api";
import { useCarrito } from "../contexts/CarritoContext";
import Alerta from '../components/Alerta'; // Import the Alerta component

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productos, setProductos] = useState([]);
  const [catSeleccionada, setCatSeleccionada] = useState(null);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [errorProductos, setErrorProductos] = useState(null);

  const { agregarAlCarrito, alertaGlobal, setAlertaGlobal } = useCarrito();

  useEffect(() => {
    fetchCategorias()
      .then((data) => setCategorias(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoriaClick = (cat) => {
    setCatSeleccionada(cat);
    setProductos([]);
    setLoadingProductos(true);
    setErrorProductos(null);
    fetchProductosPorCategoria(cat.id)
      .then(data => setProductos(data))
      .catch(e => setErrorProductos(e.message))
      .finally(() => setLoadingProductos(false));
  };

  if (loading) return <div className="text-center text-white py-12">Cargando categorías...</div>;
  if (error) return <div className="text-center text-red-400 py-12">{error}</div>;

  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      {alertaGlobal && <Alerta tipo={alertaGlobal.tipo} mensaje={alertaGlobal.mensaje} onClose={() => setAlertaGlobal(null)} />}
      <h2 className="text-3xl font-bold text-white mb-6">Categorías</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`bg-white/10 rounded-lg shadow-lg p-6 flex flex-col items-center w-full focus:outline-none transition border-2 ${catSeleccionada && catSeleccionada.id === cat.id ? 'border-purple-500' : 'border-transparent'}`}
            onClick={() => handleCategoriaClick(cat)}
          >
            <h3 className="text-xl font-semibold mb-2 text-white">{cat.nombre || cat.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{cat.descripcion || cat.description}</p>
          </button>
        ))}
      </div>
      {/* Mostrar productos de la categoría seleccionada */}
      {catSeleccionada && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-4">Productos en "{catSeleccionada.nombre || catSeleccionada.name}"</h3>
          {loadingProductos ? (
            <div className="text-center text-white py-8">Cargando productos...</div>
          ) : errorProductos ? (
            <div className="text-center text-red-400 py-8">{errorProductos}</div>
          ) : productos.length === 0 ? (
            <div className="text-center text-white py-8">No hay productos en esta categoría.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {productos.map(producto => (
                <div
                  key={producto.id}
                  className="bg-white/10 rounded-lg shadow-lg p-6 flex flex-col items-center"
                >
                  <img
                    src={producto.image_url || producto.imagen || producto.image}
                    alt={producto.nombre || producto.name}
                    className="w-24 h-24 object-cover rounded mb-3 bg-white"
                    onError={e => e.target.style.display='none'}
                  />
                  <div className="font-semibold text-white text-lg mb-1">{producto.nombre || producto.name}</div>
                  <div className="text-gray-400 text-sm mb-2">{producto.descripcion || producto.description}</div>
                  <div className="text-purple-300 font-bold mb-2">${producto.precio || producto.price}</div>
                  <button
                    className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded transition font-bold"
                    onClick={() => agregarAlCarrito(producto, 1)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
