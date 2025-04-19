import React, { useEffect, useState } from "react";
import Alerta from "../components/Alerta";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({ nombre_completo: "", telefono: "", direccion: "", metodo_pago: "" });
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No autenticado");
        const res = await fetch("http://localhost:8000/api/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudo obtener el perfil de usuario");
        const data = await res.json();
        setUser(data);
        if (data.perfil) {
          setPerfil(data.perfil);
          setForm(data.perfil);
        }
        setIsSuperuser(data.is_superuser || data.is_staff);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function handleGuardar(e) {
    e.preventDefault();
    setError(null);
    setExito(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/users/perfil/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("No se pudo actualizar el perfil");
      const data = await res.json();
      setPerfil(data);
      setExito("Perfil actualizado correctamente");
      setEditando(false);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  if (loading) return <div className="text-white text-center py-10">Cargando perfil...</div>;
  if (error) return <Alerta tipo="error" mensaje={error} onClose={() => setError(null)} />;

  return (
    <section className="container mx-auto py-10 px-4 min-h-[60vh] flex flex-col items-center">
      <h2 className="text-3xl font-bold text-white mb-6">Mi Perfil</h2>
      {exito && <Alerta tipo="exito" mensaje={exito} onClose={() => setExito(null)} />}
      {user && (
        <div className="bg-white/10 rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-4 text-white">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-xl text-white font-semibold">Usuario: {user.username}</div>
              <div className="text-gray-300">Email: {user.email}</div>
              {isSuperuser && (
                <div className="text-green-400 font-bold">Superusuario/Admin</div>
              )}
            </div>
          </div>
          {isSuperuser && (
            <div className="mt-6">
              <h3 className="text-lg text-purple-300 font-bold mb-2">Opciones de administración</h3>
              <div className="flex flex-wrap gap-4">
                <a href="/admin/products/product/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition">Gestionar Productos</a>
                <a href="/admin/products/category/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition">Gestionar Categorías</a>
                <a href="/admin/products/productimage/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition">Gestionar Imágenes</a>
                <a href="/admin/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition">Panel completo</a>
              </div>
            </div>
          )}
          {perfil && !editando && (
            <>
              <div><span className="font-semibold">Nombre completo:</span> {perfil.nombre_completo}</div>
              <div><span className="font-semibold">Teléfono:</span> {perfil.telefono}</div>
              <div><span className="font-semibold">Dirección:</span> {perfil.direccion}</div>
              <div><span className="font-semibold">Método de pago:</span> {perfil.metodo_pago}</div>
              <button onClick={() => setEditando(true)} className="mt-4 px-4 py-2 bg-purple-700 rounded text-white hover:bg-purple-800 transition">Editar perfil</button>
            </>
          )}
          {perfil && editando && (
            <form onSubmit={handleGuardar} className="flex flex-col gap-3 mt-2">
              <input
                type="text"
                name="nombre_completo"
                placeholder="Nombre completo"
                value={form.nombre_completo}
                onChange={handleChange}
                className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
                required
              />
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                value={form.telefono}
                onChange={handleChange}
                className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
              />
              <input
                type="text"
                name="direccion"
                placeholder="Dirección de entrega"
                value={form.direccion}
                onChange={handleChange}
                className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
              />
              <select
                name="metodo_pago"
                value={form.metodo_pago}
                onChange={handleChange}
                className="px-4 py-2 rounded bg-gray-900 text-white focus:outline-none"
              >
                <option value="">Selecciona método de pago</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </select>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="px-4 py-2 bg-green-700 rounded text-white hover:bg-green-800 transition">Guardar</button>
                <button type="button" onClick={() => { setEditando(false); setForm(perfil); }} className="px-4 py-2 bg-gray-700 rounded text-white hover:bg-gray-800 transition">Cancelar</button>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
