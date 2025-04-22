import React, { useEffect, useState } from "react";

// Página de administración para gestionar imágenes de productos
export default function AdminImagenes() {
  // Estado para almacenar todas las imágenes
  const [imagenes, setImagenes] = useState([]);
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para mostrar mensajes de error
  const [error, setError] = useState(null);

  // Efecto para cargar las imágenes al montar el componente
  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then((res) => res.json())
      .then((productos) => {
        // Junta todas las imágenes de todos los productos
        const imgs = productos.flatMap((p) => (p.images || []).map((img) => ({ ...img, producto: p.name, productoId: p.id })));
        setImagenes(imgs);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Función para eliminar una imagen específica
  async function handleEliminarImagen(id) {
    if (!window.confirm("¿Eliminar esta imagen?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/productimages/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo eliminar la imagen");
      setImagenes(imagenes.filter((img) => img.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Renderizado condicional mientras se cargan los datos
  if (loading) return <div className="text-white text-center py-8">Cargando...</div>;

  // Renderizado principal de la página de administración de imágenes
  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Gestión de Imágenes</h2>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {imagenes.map((img) => (
          <div key={img.id} className="bg-white/10 rounded-lg shadow-lg p-4 flex flex-col items-center">
            <img src={img.image} alt={img.alt} className="w-32 h-32 object-cover rounded mb-2" />
            <div className="text-white text-sm mb-1">{img.producto}</div>
            <div className="text-gray-400 text-xs mb-2">ID: {img.id}</div>
            <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleEliminarImagen(img.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </section>
  );
}
