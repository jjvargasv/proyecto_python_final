import React, { useEffect, useState } from "react";

export default function HistorialCompras() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [productosOrden, setProductosOrden] = useState([]);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'activos', 'completados', 'cancelados'

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

  async function handleVerDetalleOrden(orden) {
    setOrdenSeleccionada(orden);
    setProductosOrden(orden.items || []);
  }

  const ordenesFiltradas = ordenes.filter((orden) => {
    if (filtro === 'todos') return true;
    if (filtro === 'activos') return orden.status !== 'completed' && orden.status !== 'cancelled';
    if (filtro === 'completados') return orden.status === 'completed';
    if (filtro === 'cancelados') return orden.status === 'cancelled';
    return true;
  });

  return (
    <section className="container mx-auto py-10 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Historial de compras</h2>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setFiltro('todos')} className={`px-4 py-2 rounded font-bold ${filtro === 'todos' ? 'bg-purple-700 text-white' : 'bg-white/20 text-purple-200'}`}>Todos</button>
        <button onClick={() => setFiltro('activos')} className={`px-4 py-2 rounded font-bold ${filtro === 'activos' ? 'bg-purple-700 text-white' : 'bg-white/20 text-purple-200'}`}>Activos</button>
        <button onClick={() => setFiltro('completados')} className={`px-4 py-2 rounded font-bold ${filtro === 'completados' ? 'bg-purple-700 text-white' : 'bg-white/20 text-purple-200'}`}>Completados</button>
        <button onClick={() => setFiltro('cancelados')} className={`px-4 py-2 rounded font-bold ${filtro === 'cancelados' ? 'bg-purple-700 text-white' : 'bg-white/20 text-purple-200'}`}>Cancelados</button>
      </div>
      {loading ? (
        <div className="text-white text-center py-10">Cargando historial...</div>
      ) : error ? (
        <div className="text-red-400 text-center py-10">Error: {error}</div>
      ) : (
        <div className="w-full max-w-3xl bg-white/10 rounded-lg shadow-lg p-8 mt-4">
          {ordenesFiltradas.length === 0 ? (
            <div className="text-gray-300">No tienes compras registradas.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {ordenesFiltradas.map((orden, i) => (
                <div key={orden.id} className="bg-white/10 rounded-lg shadow-lg p-4 flex flex-col items-center mb-6 w-full max-w-xs mx-auto sm:max-w-none sm:mx-0">
                  <h4 className="text-lg font-bold text-purple-300 mb-2">Orden #{orden.id}</h4>
                  <div className="text-gray-300 mb-2">Fecha: {new Date(orden.created_at).toLocaleString()}</div>
                  <div className="text-gray-300 mb-2">Total: ${orden.total || orden.total_price || "-"}</div>
                  <div className="text-gray-300 mb-2">Estado: {orden.estado || orden.status || "-"}</div>
                  <button className="text-purple-300 underline w-full" onClick={() => handleVerDetalleOrden(orden)}>Ver detalle</button>
                </div>
              ))}
            </div>
          )}
          {/* Detalle de la orden seleccionada */}
          {ordenSeleccionada && (
            <div className="bg-black/70 rounded-lg p-4 mt-4">
              <h4 className="text-xl font-bold text-purple-300 mb-2">Detalle de la orden #{ordenSeleccionada.id}</h4>
              <div className="text-gray-300 mb-2">Fecha: {new Date(ordenSeleccionada.created_at).toLocaleString()}</div>
              <div className="text-gray-300 mb-2">Total: ${ordenSeleccionada.total || ordenSeleccionada.total_price || "-"}</div>
              <div className="text-gray-300 mb-2">Estado: {ordenSeleccionada.estado || ordenSeleccionada.status || "-"}</div>
              <h5 className="text-lg font-bold text-white mt-4 mb-2">Productos:</h5>
              {productosOrden.length === 0 ? (
                <div className="text-gray-400">Cargando productos...</div>
              ) : (
                <table className="w-full text-white mb-4">
                  <thead>
                    <tr className="border-b border-purple-800">
                      <th className="text-left py-2">Imagen</th>
                      <th className="text-left py-2">Nombre</th>
                      <th className="text-left py-2">Precio</th>
                      <th className="text-left py-2">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosOrden.map((producto) => (
                      <tr key={producto.id}>
                        <td className="px-4 py-2">
                          <img
                            src={producto.images && producto.images.length > 0 ? producto.images[0].image : (producto.image_url || producto.imagen || producto.image || "https://via.placeholder.com/64")}
                            alt={producto.nombre || producto.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-2 text-white">{producto.nombre || producto.name}</td>
                        <td className="px-4 py-2 text-purple-200">${producto.precio || producto.price}</td>
                        <td className="px-4 py-2 text-white">{producto.cantidad || producto.qty || 1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button className="mt-4 text-sm text-purple-400 underline" onClick={() => setOrdenSeleccionada(null)}>Cerrar detalle</button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
