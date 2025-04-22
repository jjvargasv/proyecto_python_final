import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Página de administración para eliminar un producto específico
export default function AdminProductoEliminar() {
  // Obtiene el ID del producto desde la URL
  const { id } = useParams();
  // Estado para almacenar los datos del producto
  const [producto, setProducto] = useState(null);
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para mostrar mensajes de error
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Efecto para cargar los datos del producto al montar el componente
  useEffect(() => {
    // Realiza una solicitud GET al servidor para obtener los datos del producto
    fetch(`http://localhost:8000/api/products/${id}/`)
      .then((res) => res.json())
      .then(setProducto)
      .catch(() => setError("No se pudo cargar el producto"))
      .finally(() => setLoading(false));
  }, [id]);

  // Función para eliminar el producto
  async function handleEliminar() {
    // Pregunta al usuario si está seguro de eliminar el producto
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      // Obtiene el token de autenticación del usuario
      const token = localStorage.getItem("token");
      // Realiza una solicitud DELETE al servidor para eliminar el producto
      const res = await fetch(`http://localhost:8000/api/products/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      // Verifica si la solicitud fue exitosa
      if (!res.ok) throw new Error("No se pudo eliminar");
      // Redirige al usuario a la página de productos
      navigate("/admin/productos");
    } catch (err) {
      // Muestra un mensaje de error si ocurre
      setError(err.message);
    }
  }

  // Renderizado condicional mientras se cargan los datos o si hay error
  if (loading) return <div className="text-white text-center py-8">Cargando...</div>;
  if (error) return <div className="text-red-400 text-center py-8">{error}</div>;
  if (!producto) return null;

  // Renderizado principal de la página de eliminación de producto
  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Eliminar Producto</h2>
      <div className="bg-white/10 rounded-lg shadow-lg p-8 flex flex-col items-center">
        {/* Imagen principal del producto */}
        <img src={producto.images && producto.images[0]?.image} alt={producto.name} className="w-32 h-32 object-cover rounded mb-4" />
        {/* Nombre del producto */}
        <h3 className="text-xl font-semibold mb-2 text-white">{producto.name}</h3>
        {/* Precio del producto */}
        <p className="text-lg text-purple-200 mb-2">${producto.price}</p>
        <div className="flex gap-4 mt-4">
          {/* Botón para eliminar */}
          <button className="px-6 py-2 rounded bg-red-700 text-white hover:bg-red-800 transition" onClick={handleEliminar}>Eliminar</button>
          {/* Botón para cancelar */}
          <button className="px-6 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 transition" onClick={() => navigate("/admin/productos")}>Cancelar</button>
        </div>
        {/* Mensaje de error si ocurre */}
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      </div>
    </section>
  );
}
