import React, { useEffect, useState } from "react";
import { fetchCategorias, fetchProductosPorCategoria } from "../utils/api";
import { useCarrito } from "../contexts/CarritoContext";
import Alerta from '../components/Alerta'; // Import the Alerta component
import CardCategoria from "../components/CardCategoria"; // Import the CardCategoria component
import { useNavigate } from "react-router-dom";

// Página para mostrar todas las categorías disponibles
export default function Categorias() {
  // Estado para almacenar la lista de categorías
  const [categorias, setCategorias] = useState([]);
  // Estado para manejar la carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Estado para almacenar los productos de la categoría seleccionada
  const [productos, setProductos] = useState([]);
  // Estado para almacenar la categoría seleccionada
  const [catSeleccionada, setCatSeleccionada] = useState(null);
  // Estado para manejar la carga de productos
  const [loadingProductos, setLoadingProductos] = useState(false);
  // Estado para manejar errores de productos
  const [errorProductos, setErrorProductos] = useState(null);

  // Contexto para manejar el carrito
  const { alertaGlobal, setAlertaGlobal } = useCarrito();
  // Hook para navegar entre páginas
  const navigate = useNavigate();

  // Efecto para cargar las categorías desde la API al montar el componente
  useEffect(() => {
    async function cargarCategorias() {
      try {
        // Llama a la función que maneja compatibilidad con /categories/ y /categorias/
        const data = await fetchCategorias();
        setCategorias(data);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar las categorías. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    }
    cargarCategorias();
  }, []);

  // Función para manejar clic en una categoría
  function handleCategoriaClick(cat) {
    // Actualiza la categoría seleccionada
    setCatSeleccionada(cat);
    // Resetea los productos y errores
    setProductos([]);
    setErrorProductos(null);
    // Carga los productos de la categoría seleccionada
    setLoadingProductos(true);
    fetchProductosPorCategoria(cat.id)
      .then(data => setProductos(data))
      .catch(e => setErrorProductos(e.message))
      .finally(() => setLoadingProductos(false));
  };

  // Renderizado de la página de categorías
  if (loading) return <div className="text-center text-white py-12">Cargando categorías...</div>;
  if (error) return <div className="text-center text-red-400 py-12">{error}</div>;

  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh] bg-gradient-to-br from-[#211044] via-[#3b1d63] to-[#1e1550] animate-fadein">
      {alertaGlobal && <Alerta tipo={alertaGlobal.tipo} mensaje={alertaGlobal.mensaje} onClose={() => setAlertaGlobal(null)} />}
      <h2 className="text-3xl font-bold text-white mb-6">Categorías</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categorias.map((cat, idx) => (
          <div key={cat.id} className="bg-white/10 rounded-lg shadow-lg p-4 flex flex-col items-center mb-6 w-full max-w-xs mx-auto sm:max-w-none sm:mx-0">
            <button
              className={`bg-white/10 rounded-lg shadow-md p-3 flex flex-col items-center w-full focus:outline-none transition border-2 hover:scale-110 hover:bg-purple-400/40 hover:shadow-2xl duration-200 ${catSeleccionada && catSeleccionada.id === cat.id ? 'border-purple-500' : 'border-transparent'} animate-fadein`}
              style={{ minHeight: '90px', minWidth: '120px', maxWidth: '180px', animationDelay: `${idx * 60}ms` }}
              onClick={() => handleCategoriaClick(cat)}
            >
              <h3 className="text-base font-semibold mb-1 text-white truncate w-full">{(cat.nombre || cat.name).length > 18 ? (cat.nombre || cat.name).slice(0, 18) + '…' : (cat.nombre || cat.name)}</h3>
              <p className="text-xs text-gray-300 text-center line-clamp-2">{cat.descripcion || cat.description}</p>
            </button>
          </div>
        ))}
      </div>
      {/* Mostrar productos de la categoría seleccionada */}
      {catSeleccionada && (
        <div className="mt-12 animate-fadein">
          <h3 className="text-2xl font-bold text-white mb-4">Productos en "{catSeleccionada.nombre || catSeleccionada.name}"</h3>
          {loadingProductos ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-purple-200 h-16 w-16"></div>
            </div>
          ) : errorProductos ? (
            <div className="text-center text-red-400 py-12">{errorProductos}</div>
          ) : productos.length === 0 ? (
            <div className="text-center text-white py-12">No hay productos en esta categoría.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {productos.map((prod, idx) => (
                <div key={prod.id} className="animate-fadein" style={{ animationDelay: `${idx * 60}ms` }}>
                  <CardCategoria producto={prod} onClick={() => navigate(`/productos/${prod.id}`)} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
