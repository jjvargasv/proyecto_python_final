import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Página de administración para crear o editar productos
export default function AdminProductoForm({ modo = "crear" }) {
  // Obtiene el ID del producto desde la URL (solo en modo edición)
  const { id } = useParams();
  // Estado para el formulario del producto
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    featured: false,
    detalles: "",
  });
  // Estado para las imágenes seleccionadas o existentes
  const [imagenes, setImagenes] = useState([]);
  // Estado para las categorías disponibles
  const [categorias, setCategorias] = useState([]);
  // Estado para mostrar mensajes de error
  const [error, setError] = useState(null);
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(modo === "editar");
  const navigate = useNavigate();

  // Efecto para cargar categorías y datos del producto si se edita
  useEffect(() => {
    // Cargar categorías
    fetch("http://localhost:8000/api/categories/")
      .then((res) => res.json())
      .then(setCategorias)
      .catch(() => setCategorias([]));
    // Si es edición, cargar datos del producto
    if (modo === "editar" && id) {
      fetch(`http://localhost:8000/api/products/${id}/`)
        .then((res) => res.json())
        .then((prod) => {
          setForm({
            name: prod.name,
            description: prod.description,
            price: prod.price,
            stock: prod.stock,
            category_id: prod.category?.id || prod.category_id || "",
            featured: prod.featured,
            detalles: prod.detalles || "",
          });
          setImagenes(prod.images || []);
        })
        .catch(() => setError("No se pudo cargar el producto"))
        .finally(() => setLoading(false));
    }
  }, [modo, id]);

  // Maneja cambios en los campos del formulario
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  // Maneja la selección de imágenes
  function handleImagenes(e) {
    setImagenes(Array.from(e.target.files));
  }

  // Envía el formulario para crear o editar el producto
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    // Agrega imágenes al FormData
    imagenes.forEach((img) => {
      if (img instanceof File) {
        formData.append("images", img);
      }
    });
    try {
      const url = modo === "editar" && id ? `http://localhost:8000/api/products/${id}/` : "http://localhost:8000/api/products/";
      const method = modo === "editar" && id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Error al guardar el producto");
      navigate("/admin/productos");
    } catch (err) {
      setError(err.message);
    }
  }

  // Renderizado condicional mientras se cargan los datos
  if (loading) return <div className="text-white text-center py-8">Cargando...</div>;

  // Renderizado principal del formulario de producto
  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">{modo === "editar" ? "Editar Producto" : "Nuevo Producto"}</h2>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white/10 rounded-xl shadow p-6 flex flex-col gap-4 max-w-xl mx-auto">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="px-4 py-2 rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="px-4 py-2 rounded" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Precio" className="px-4 py-2 rounded" type="number" required />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="px-4 py-2 rounded" type="number" required />
        <select name="category_id" value={form.category_id} onChange={handleChange} className="px-4 py-2 rounded" required>
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} />
          Producto destacado
        </label>
        <textarea name="detalles" value={form.detalles} onChange={handleChange} placeholder="Detalles adicionales" className="px-4 py-2 rounded" />
        <input type="file" multiple onChange={handleImagenes} className="px-4 py-2 rounded" />
        <button type="submit" className="px-6 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition">{modo === "editar" ? "Guardar Cambios" : "Crear Producto"}</button>
      </form>
      <button className="mt-8 px-6 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 transition" onClick={() => navigate("/admin/productos")}>Volver</button>
    </section>
  );
}
