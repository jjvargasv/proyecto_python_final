import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/categories/")
      .then((res) => res.json())
      .then(setCategorias)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCrear(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/categories/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: nombre, description: descripcion }),
      });
      if (!res.ok) throw new Error("Error al crear categoría");
      setNombre("");
      setDescripcion("");
      setCategorias([...categorias, await res.json()]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/categories/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setCategorias(categorias.filter((cat) => cat.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="text-white text-center py-8">Cargando...</div>;

  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Gestión de Categorías</h2>
      <form onSubmit={handleCrear} className="mb-6 flex gap-2 flex-wrap">
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" className="px-4 py-2 rounded" required />
        <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" className="px-4 py-2 rounded" />
        <button type="submit" className="px-6 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition">Crear</button>
      </form>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categorias.map((cat) => (
          <div key={cat.id} className="bg-white/10 rounded-lg shadow-lg p-6 flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-white">{cat.name}</div>
              <div className="text-gray-300">{cat.description}</div>
            </div>
            <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleEliminar(cat.id)}>Eliminar</button>
          </div>
        ))}
      </div>
      <button className="mt-8 px-6 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 transition" onClick={() => navigate("/admin/productos")}>Volver a productos</button>
    </section>
  );
}
