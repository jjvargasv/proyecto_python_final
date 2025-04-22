import React, { useEffect, useState } from "react";
import { fetchProductos } from "../api";
import { useCarrito } from "../contexts/CarritoContext";
import CardProductos from "../components/CardProductos";

// Página principal para mostrar todos los productos disponibles en la tienda
export default function Productos() {
  // Estado para almacenar la lista de productos
  const [productos, setProductos] = useState([]);
  // Estado para controlar si se están cargando los productos
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores de carga
  const [error, setError] = useState(null);
  // Hook personalizado para manejar el carrito
  const { agregarAlCarrito } = useCarrito();
  // Estado para mostrar mensajes de éxito o información
  const [mensaje, setMensaje] = useState("");

  // Efecto para cargar los productos al montar el componente
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

  // Función para agregar un producto al carrito y mostrar mensaje
  function handleAgregar(prod) {
    agregarAlCarrito(prod, 1);
    setMensaje(`✔️ ${prod.nombre} agregado al carrito`);
    setTimeout(() => setMensaje(""), 1800);
  }

  // Sección de carga: muestra un mensaje mientras se cargan los productos
  if (loading) return <div className="text-center text-white py-12">Cargando productos...</div>;
  // Sección de error: muestra un mensaje de error si ocurre un problema al cargar los productos
  if (error) return <div className="text-center text-red-400 py-12">{error}</div>;

  return (
    // Sección principal de la página: muestra la lista de productos
    <section className="w-full max-w-6xl mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Productos</h2>
      {/* Mensaje de éxito al agregar al carrito */}
      {mensaje && <div className="mb-4 text-green-400 bg-white/10 rounded px-4 py-2 shadow text-center animate-bounce">{mensaje}</div>}
      {/* Grid responsivo para mostrar las tarjetas de producto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productos.map((producto) => (
          <CardProductos
            key={producto.id}
            producto={producto}
            onAddToCart={handleAgregar}
          />
        ))}
      </div>
    </section>
  );
}
