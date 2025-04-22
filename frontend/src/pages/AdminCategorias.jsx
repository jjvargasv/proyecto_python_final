import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Página de administración para gestionar categorías de productos
export default function AdminCategorias() {
  // Estado para almacenar las categorías existentes
  const [categorias, setCategorias] = useState([]);
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para mostrar mensajes de error
  const [error, setError] = useState(null);
  // Estado para el nombre de la nueva categoría
  const [nombre, setNombre] = useState("");
  // Estado para la descripción de la nueva categoría
  const [descripcion, setDescripcion] = useState("");
  const navigate = useNavigate();

  // Efecto para cargar las categorías al montar el componente
  useEffect(() => {
    fetch("http://localhost:8000/api/categories/")
      .then((res) => res.json())
      .then(setCategorias)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Función para crear una nueva categoría
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

  // Función para eliminar una categoría existente
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

  // Renderizado condicional mientras se cargan los datos
  if (loading) return <div className="text-white text-center py-8">Cargando...</div>;

  // Renderizado principal de la página de administración de categorías
  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Gestión de Categorías</h2>
      {/* Formulario para crear nueva categoría */}
      <form onSubmit={handleCrear} className="mb-6 flex gap-2 flex-wrap">
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" className="px-4 py-2 rounded" required />
        <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" className="px-4 py-2 rounded" />
        <button type="submit" className="px-6 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition">Crear</button>
      </form>
      {/* Tabla/lista de categorías existentes */}
      <div className="bg-white/10 rounded-xl shadow p-4">
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <ul>
          {categorias.map((cat) => (
            <li key={cat.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
              <span className="text-white font-semibold">{cat.name}</span>
              <span className="text-gray-400 text-sm">{cat.description}</span>
              <button className="ml-4 px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleEliminar(cat.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
      <button className="mt-8 px-6 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 transition" onClick={() => navigate("/admin/productos")}>Volver a productos</button>
    </section>
  );
}
