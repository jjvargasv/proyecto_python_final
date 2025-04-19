import React, { useState } from "react";
import { useCarrito } from "../contexts/CarritoContext";
import { useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";

export default function Carrito() {
  const { carrito, eliminarDelCarrito, vaciarCarrito, actualizarCantidad, loading, error, alertaGlobal, setAlertaGlobal } = useCarrito();
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("checkout_redirect") === "1" && localStorage.getItem("token")) {
      localStorage.removeItem("checkout_redirect");
      setAlerta({ tipo: "info", mensaje: "¡Ahora puedes proceder al pago!" });
    }
  }, []);

  if (loading) return <div className="text-white text-center py-10">Cargando carrito...</div>;
  if (error) return <Alerta tipo="error" mensaje={error} />;

  const total = carrito.reduce((sum, prod) => sum + Number(prod.precio || prod.price || 0) * (prod.cantidad || prod.qty || 1), 0);

  function handleEliminar(id) {
    eliminarDelCarrito(id);
    setAlerta({ tipo: "exito", mensaje: "Producto eliminado del carrito." });
  }

  function handleVaciar() {
    vaciarCarrito();
    setAlerta({ tipo: "info", mensaje: "Carrito vaciado." });
  }

  function handleCheckout() {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("checkout_redirect", "1");
      navigate("/login");
      return;
    }
    setAlerta({ tipo: "info", mensaje: "¡Procediendo al pago!" });
  }

  return (
    <section className="container mx-auto py-10 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Carrito de compras</h2>
      {alertaGlobal && <Alerta tipo={alertaGlobal.tipo} mensaje={alertaGlobal.mensaje} onClose={() => setAlertaGlobal(null)} />}
      {alerta && <Alerta tipo={alerta.tipo} mensaje={alerta.mensaje} onClose={() => setAlerta(null)} />}
      {carrito.length === 0 ? (
        <div className="text-gray-300">Tu carrito está vacío.</div>
      ) : (
        <div className="bg-white/10 rounded-lg shadow-lg p-6">
          <ul className="divide-y divide-purple-900">
            {carrito.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <img src={item.imagen} alt={item.nombre || item.name} className="w-16 h-16 object-cover rounded bg-white" onError={e => e.target.style.display='none'} />
                  <div>
                    <div className="font-semibold text-white">{item.nombre || item.name}</div>
                    <div className="text-gray-400 text-sm">{item.descripcion || ""}</div>
                    <div className="text-purple-300 font-bold mt-1">${item.precio || item.price}</div>
                    <div className="text-gray-300 flex items-center gap-2">
                      Cantidad:
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad || item.qty || 1}
                        onChange={e => {
                          const val = Math.max(1, Number(e.target.value));
                          actualizarCantidad(item.id, val);
                        }}
                        className="w-16 px-2 py-1 rounded bg-gray-900 text-white border border-purple-400 text-center"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleEliminar(item.id)}
                  className="text-red-400 hover:text-red-600 font-bold px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-6">
            <button onClick={handleVaciar} className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 transition">Vaciar carrito</button>
            <div className="flex items-center gap-4">
              <span className="text-xl text-purple-300 font-bold">Total: {Number(total).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</span>
              <button onClick={handleCheckout} className="px-6 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition">Finalizar compra</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
