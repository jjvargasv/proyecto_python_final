import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminProductoEliminar() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${id}/`)
      .then((res) => res.json())
      .then(setProducto)
      .catch(() => setError("No se pudo cargar el producto"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleEliminar() {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/products/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      navigate("/admin/productos");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="text-white text-center py-8">Cargando...</div>;
  if (error) return <div className="text-red-400 text-center py-8">{error}</div>;
  if (!producto) return null;

  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Eliminar Producto</h2>
      <div className="bg-white/10 rounded-lg shadow-lg p-8 flex flex-col items-center">
        <img src={producto.images && producto.images[0]?.image} alt={producto.name} className="w-32 h-32 object-cover rounded mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-white">{producto.name}</h3>
        <p className="text-lg text-purple-200 mb-2">${producto.price}</p>
        <div className="flex gap-4 mt-4">
          <button className="px-6 py-2 rounded bg-red-700 text-white hover:bg-red-800 transition" onClick={handleEliminar}>Eliminar</button>
          <button className="px-6 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 transition" onClick={() => navigate("/admin/productos")}>Cancelar</button>
        </div>
        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      </div>
    </section>
  );
}
