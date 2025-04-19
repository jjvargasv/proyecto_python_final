import React, { useEffect, useState } from "react";

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrdenes() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No autenticado");
        const res = await fetch("http://localhost:8000/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudo obtener el historial");
        const data = await res.json();
        setOrdenes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrdenes();
  }, []);

  if (loading) return <div className="text-white text-center py-10">Cargando órdenes...</div>;
  if (error) return <div className="text-red-400 text-center py-10">Error: {error}</div>;

  return (
    <section className="container mx-auto py-10 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Mis Órdenes</h2>
      {ordenes.length === 0 ? (
        <div className="text-gray-300">No tienes órdenes realizadas.</div>
      ) : (
        <div className="bg-white/10 rounded-lg shadow-lg p-6">
          <ul className="divide-y divide-purple-900">
            {ordenes.map((orden) => (
              <li key={orden.id} className="py-4">
                <div className="text-white font-semibold">Orden #{orden.id}</div>
                <div className="text-gray-400 text-sm mb-2">Fecha: {orden.fecha || orden.created_at}</div>
                <ul className="ml-4 list-disc text-gray-300">
                  {orden.items.map((item) => (
                    <li key={item.id}>
                      {item.producto_nombre || item.product_name} x {item.cantidad}
                    </li>
                  ))}
                </ul>
                <div className="text-purple-300 font-bold mt-2">Total: {Number(orden.total).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
