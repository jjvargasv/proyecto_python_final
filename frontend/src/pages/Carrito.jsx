import React from "react";
import { useCarrito } from "../contexts/CarritoContext";
import { useNavigate } from "react-router-dom";

// Página para mostrar el carrito de compras del usuario
export default function Carrito() {
  // Obtenemos el contexto del carrito y sus funciones
  const { carrito, eliminarDelCarrito, vaciarCarrito, actualizarCantidad, loading, error } = useCarrito();
  const navigate = useNavigate();

  // Si el carrito está cargando, mostramos un mensaje de carga
  if (loading) return <div className="text-white text-center py-10">Cargando carrito...</div>;
  // Si hay un error, mostramos la alerta de error
  if (error) return <div className="text-center text-red-500">{error}</div>;

  // Calcula el total del carrito
  const total = carrito.reduce((sum, prod) => sum + Number(prod.precio || prod.price || 0) * (prod.cantidad || prod.qty || 1), 0);

  // Función para eliminar un producto del carrito
  function handleEliminar(id) {
    eliminarDelCarrito(id);
  }

  // Función para vaciar el carrito
  function handleVaciar() {
    vaciarCarrito();
  }

  // Función para proceder al pago
  function handleCheckout() {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("checkout_redirect", "1");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  }

  // Renderizado de la página del carrito
  return (
    <section className="container mx-auto py-10 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Carrito de compras</h2>
      {carrito.length === 0 ? (
        <div className="text-center text-purple-700">Tu carrito está vacío.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/10 rounded-xl">
            <thead>
              <tr>
                <th className="py-2 px-4">Producto</th>
                <th className="py-2 px-4">Cantidad</th>
                <th className="py-2 px-4">Precio</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="py-2 px-4">{item.nombre || item.name}</td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min={1}
                      value={item.cantidad}
                      onChange={e => actualizarCantidad(item.id, Number(e.target.value))}
                      className="w-16 text-center rounded"
                    />
                  </td>
                  <td className="py-2 px-4">
                    {Number(item.precio || item.price).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-2 px-4">
                    {(Number(item.precio || item.price) * item.cantidad).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleEliminar(item.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-4">
            <span className="text-lg font-bold text-purple-900">Total: {total.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}</span>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button onClick={handleVaciar} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition">Vaciar carrito</button>
            <button onClick={handleCheckout} className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded transition">Proceder al pago</button>
          </div>
        </div>
      )}
    </section>
  );
}
