import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchProductos } from "../api";

export default function AdminProductos({ isSuperuser }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSuperuser) return;
    fetchProductos()
      .then(setProductos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [isSuperuser]);

  if (!isSuperuser) return <div className="text-red-400 text-center py-8">Acceso denegado. Solo para administradores.</div>;
  if (loading) return <div className="text-white text-center py-8">Cargando productos...</div>;
  if (error) return <div className="text-red-400 text-center py-8">{error}</div>;

  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Gestión de Productos</h2>
      <button className="mb-4 px-4 py-2 bg-green-700 text-white rounded" onClick={() => navigate("/admin/productos/nuevo")}>Nuevo Producto</button>
      <Link to="/admin/categorias" className="mb-4 ml-4 px-4 py-2 bg-blue-700 text-white rounded inline-block">Gestionar Categorías</Link>
      <Link to="/admin/imagenes" className="mb-4 ml-4 px-4 py-2 bg-blue-700 text-white rounded inline-block">Gestionar Imágenes</Link>
      <Link to="/admin/usuarios" className="mb-4 ml-4 px-4 py-2 bg-blue-700 text-white rounded inline-block">Gestionar Usuarios</Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productos.map((prod) => (
          <div key={prod.id} className="bg-white/10 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <img src={(prod.imagen || (prod.images && prod.images[0]?.image)) || ""} alt={prod.nombre || prod.name} className="w-32 h-32 object-cover rounded mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">{prod.nombre || prod.name}</h3>
            <p className="text-lg text-purple-200 mb-2">${prod.precio || prod.price}</p>
            <div className="flex gap-2 mt-2">
              <Link to={`/admin/productos/editar/${prod.id}`} className="px-3 py-1 bg-blue-600 text-white rounded">Editar</Link>
              <Link to={`/admin/productos/eliminar/${prod.id}`} className="px-3 py-1 bg-red-600 text-white rounded">Eliminar</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
