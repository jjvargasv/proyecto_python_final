import React, { useEffect, useState } from "react";

export default function ReseñasInicio() {
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/reseñas/")
      .then((res) => res.json())
      .then(setReseñas)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!reseñas.length) return null;

  return (
    <section className="bg-gradient-to-br from-purple-900 via-gray-900 to-black py-12 mt-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Reseñas de nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reseñas.slice(0,6).map((r) => (
            <div key={r.id} className="bg-white/10 rounded-lg shadow-lg p-6 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <span className="font-bold text-black">{r.usuario}</span>
                <span className="text-yellow-400">{"★".repeat(r.calificacion)}</span>
              </div>
              <div className="text-black mt-2">{r.texto}</div>
              <div className="text-gray-600 text-xs mt-2">{new Date(r.fecha).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
