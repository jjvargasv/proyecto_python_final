import React, { useEffect, useState } from "react";
import { fetchProductos } from "../utils/api";

export default function CalificacionProducto({ productoId }) {
  const [calificacion, setCalificacion] = useState(null);

  useEffect(() => {
    fetchProductos()
      .then(productos => {
        const prod = productos.find(p => String(p.id) === String(productoId));
        if (prod && prod.calificacion) {
          setCalificacion(prod.calificacion);
        } else if (prod && prod.rating) {
          setCalificacion(prod.rating);
        }
      });
  }, [productoId]);

  if (calificacion === null) return null;

  return (
    <div className="flex items-center gap-1 text-yellow-400 text-sm">
      <span>Calificación:</span>
      <span className="font-bold">{Number(calificacion).toFixed(1)}</span>
      <span>★</span>
    </div>
  );
}
