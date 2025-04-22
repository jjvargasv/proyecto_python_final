import React, { useEffect, useState } from "react";
import { fetchProductos } from "../utils/api";
import CardProductos from "./CardProductos";

export default function ProductosRandom({ excluidoId, onAddToCart }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductos()
      .then(data => {
        // Excluye el producto actual y selecciona 4 productos aleatorios
        const filtrados = data.filter(p => String(p.id) !== String(excluidoId));
        const seleccionados = filtrados.sort(() => 0.5 - Math.random()).slice(0, 4);
        setProductos(seleccionados);
        setLoading(false);
      })
      .catch(() => { setError("No se pudieron cargar productos recomendados"); setLoading(false); });
  }, [excluidoId]);

  if (loading) return null;
  if (error) return <div className="text-center text-xs text-red-300 py-4">{error}</div>;
  if (!productos.length) return null;

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map(prod => (
          <div key={prod.id} className="bg-white/10 rounded-lg shadow-lg p-4 flex flex-col items-center mb-6 w-full max-w-xs mx-auto sm:max-w-none sm:mx-0">
            <CardProductos producto={prod} onAddToCart={() => onAddToCart(prod)} />
          </div>
        ))}
      </div>
    </div>
  );
}
