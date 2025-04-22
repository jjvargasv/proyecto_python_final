import React, { useState } from "react";
import { useCarrito } from "../contexts/CarritoContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { carrito, vaciarCarrito } = useCarrito();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (!carrito.length) {
      navigate("/carrito");
    }
  }, [carrito, navigate]);

  const total = carrito.reduce((sum, prod) => sum + Number(prod.precio || prod.price || 0) * (prod.cantidad || prod.qty || 1), 0);

  async function handleConfirmarCompra() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          items_data: carrito.map((item) => ({
            producto: item.id,
            cantidad: item.cantidad || item.qty || 1,
          })),
        }),
      });
      if (!res.ok) throw new Error("No se pudo crear la orden");
      setSuccess("¡Compra realizada con éxito!");
      vaciarCarrito();
      setTimeout(() => navigate("/ordenes"), 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container mx-auto py-10 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Confirmar compra</h2>
      {error && <div className="text-red-400 mb-4">Error: {error}</div>}
      {success && <div className="text-green-400 mb-4">{success}</div>}
      <div className="bg-white/10 rounded-lg shadow-lg p-6 mb-6">
        <ul className="divide-y divide-purple-900">
          {carrito.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0].image
                      : (item.imagen || item.image || "https://via.placeholder.com/48")
                  }
                  alt={item.nombre || item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div className="font-semibold text-white">{item.nombre || item.name}</div>
                  <div className="text-gray-400 text-sm">Cantidad: {item.cantidad || item.qty || 1}</div>
                </div>
              </div>
              <div className="text-purple-300 font-bold">{Number((item.precio || item.price) * (item.cantidad || item.qty || 1)).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</div>
            </li>
          ))}
        </ul>
        <div className="text-right text-xl text-purple-300 font-bold mt-4">Total: {Number(total).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</div>
      </div>
      <button className="px-6 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition" onClick={handleConfirmarCompra} disabled={loading}>
        {loading ? "Procesando..." : "Confirmar compra"}
      </button>
    </section>
  );
}
