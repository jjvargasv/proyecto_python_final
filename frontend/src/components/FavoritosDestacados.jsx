import React, { useEffect, useState } from "react";
import { fetchFavoritos } from "../utils/favoritosAPI";
import CardProductos from "./CardProductos";
import { useNavigate } from "react-router-dom";

export default function FavoritosDestacados() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoritos()
      .then(data => setFavoritos(data))
      .catch(() => setError("No se pudieron cargar tus favoritos"))
      .finally(() => setLoading(false));
  }, []);

  if (!localStorage.getItem("token")) return null;
  if (loading) return null;
  if (error || favoritos.length === 0) return null;

  // Muestra hasta 4 favoritos destacados
  const destacados = favoritos.slice(0, 4);

  return (
    <section className="w-full max-w-5xl mx-auto mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purple-300">Tus favoritos destacados</h2>
        <button className="text-purple-400 hover:underline" onClick={() => navigate("/favoritos")}>Ver todos</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {destacados.map(fav => (
          <div key={fav.id} className="bg-white/10 rounded-lg shadow-lg p-4 flex flex-col items-center mb-6 w-full max-w-xs mx-auto sm:max-w-none sm:mx-0">
            <CardProductos producto={fav.producto} />
          </div>
        ))}
      </div>
    </section>
  );
}
