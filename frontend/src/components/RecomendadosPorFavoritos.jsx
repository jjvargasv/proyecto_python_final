// Componente que muestra productos recomendados al usuario según sus favoritos
import React, { useEffect, useState } from "react";
import { fetchFavoritos } from "../utils/favoritosAPI";
import CardProductos from "./CardProductos";

export default function RecomendadosPorFavoritos() {
  // Estado para almacenar los productos recomendados
  const [recomendados, setRecomendados] = useState([]);
  // Estado para controlar la carga
  const [loading, setLoading] = useState(true);

  // Efecto para obtener recomendaciones al montar el componente
  useEffect(() => {
    async function fetchRecomendados() {
      try {
        // Obtiene los favoritos del usuario
        const favoritos = await fetchFavoritos();
        if (!Array.isArray(favoritos) || favoritos.length === 0) {
          setRecomendados([]);
          setLoading(false);
          return;
        }
        // Extrae categorías de los favoritos
        const categorias = favoritos.map(f => f.producto.categoria || f.producto.category).filter(Boolean);
        const categoriasUnicas = [...new Set(categorias)];
        // Busca productos recomendados en esas categorías (máx 8)
        let productos = [];
        for (let cat of categoriasUnicas) {
          const res = await fetch(`/api/products/?category=${encodeURIComponent(cat)}`);
          if (res.ok) {
            const data = await res.json();
            productos = productos.concat(data);
          }
        }
        // Quita productos que ya están en favoritos
        const favoritosIds = favoritos.map(f => f.producto.id);
        const unicos = productos.filter(p => !favoritosIds.includes(p.id));
        setRecomendados(unicos.slice(0, 8));
      } catch (e) {
        // Si hay error, muestra el error en consola
        console.error("No se pudieron cargar recomendaciones", e);
      } finally {
        setLoading(false);
      }
    }
    fetchRecomendados();
  }, []);

  if (!localStorage.getItem("token")) return null;
  if (loading) return <div className="text-center text-white py-8">Cargando recomendaciones...</div>;
  if (!recomendados.length) return null;

  return (
    // Sección con los productos recomendados
    <section className="w-full max-w-5xl mx-auto mb-10">
      <h2 className="text-2xl font-bold text-purple-300 mb-4">Recomendados para ti (por tus favoritos)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recomendados.map(producto => (
          <div key={producto.id} className="bg-white/10 rounded-lg shadow-lg p-4 flex flex-col items-center mb-6 w-full max-w-xs mx-auto sm:max-w-none sm:mx-0">
            <CardProductos producto={producto} />
          </div>
        ))}
      </div>
    </section>
  );
}
