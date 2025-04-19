import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminProductoForm({ modo = "crear" }) {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    featured: false,
  });
  const [imagenes, setImagenes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(modo === "editar");
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar categorías
    fetch("http://localhost:8000/api/categories/")
      .then((res) => res.json())
      .then(setCategorias)
      .catch(() => setCategorias([]));
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
          });
          setImagenes(prod.images || []);
        })
        .catch(() => setError("No se pudo cargar el producto"))
        .finally(() => setLoading(false));
    }
  }, [modo, id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function handleImagenes(e) {
    setImagenes(Array.from(e.target.files));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    imagenes.forEach((img) => formData.append("imagenes", img));
    try {
      const res = await fetch(
        modo === "editar"
          ? `http://localhost:8000/api/products/${id}/`
          : "http://localhost:8000/api/products/",
        {
          method: modo === "editar" ? "PUT" : "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Error al guardar el producto");
      navigate("/admin/productos");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="text-white text-center py-8">Cargando...</div>;

  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">{modo === "editar" ? "Editar" : "Nuevo"} Producto</h2>
      <form onSubmit={handleSubmit} className="bg-white/10 rounded-lg shadow-lg p-8 flex flex-col gap-4 max-w-xl mx-auto">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="px-4 py-2 rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="px-4 py-2 rounded" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Precio" type="number" min="0" step="0.01" className="px-4 py-2 rounded" required />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" min="0" className="px-4 py-2 rounded" required />
        <select name="category_id" value={form.category_id} onChange={handleChange} className="px-4 py-2 rounded" required>
          <option value="">Selecciona categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          Destacado
        </label>
        <input type="file" multiple accept="image/*" onChange={handleImagenes} className="px-4 py-2 rounded" />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="px-6 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition">Guardar</button>
        <button type="button" className="px-6 py-2 rounded bg-gray-700 text-white hover:bg-gray-800 transition" onClick={() => navigate("/admin/productos")}>Cancelar</button>
      </form>
    </section>
  );
}
