import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Página para mostrar y editar el perfil del usuario
export default function Perfil() {
  // Estado para almacenar los datos del usuario
  const [user, setUser] = useState(null);
  // Estado para manejar la carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Estado para manejar la edición del perfil
  const [editando, setEditando] = useState(false);
  // Estado para los datos editables
  const [form, setForm] = useState({ nombre_completo: "", telefono: "" });
  // Hook para navegar entre páginas
  const navigate = useNavigate();

  // Efecto para cargar los datos del usuario al montar el componente
  useEffect(() => {
    async function cargarUsuario() {
      try {
        // Simulación de llamada a API (reemplaza con tu endpoint real)
        const data = {
          nombre_completo: "Juan Pérez",
          telefono: "",
          email: "juan@example.com"
        };
        setUser(data);
        setForm(data);
        setError(null);
      } catch (err) {
        setError("No se pudo cargar el perfil. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    }
    cargarUsuario();
  }, []);

  // Función para manejar cambios en el formulario
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Función para guardar cambios en el perfil
  function handleGuardar() {
    // Aquí puedes hacer la llamada a la API para guardar los cambios
    setUser(form);
    setEditando(false);
  }

  // Renderizado de la página de perfil
  if (loading) return <div className="text-white text-center py-10">Cargando perfil...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-900">Mi perfil</h1>
      {editando ? (
        <div className="bg-white/10 rounded-xl p-6">
          <div className="mb-4">
            <label className="block text-purple-900 font-semibold mb-1">Nombre completo</label>
            <input
              type="text"
              name="nombre_completo"
              value={form.nombre_completo}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-purple-900 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 rounded bg-gray-200 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block text-purple-900 font-semibold mb-1">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleGuardar} className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded transition">Guardar</button>
            <button onClick={() => setEditando(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition">Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="bg-white/10 rounded-xl p-6">
          <div className="mb-4">
            <span className="block text-purple-900 font-semibold mb-1">Nombre completo</span>
            <span>{user.nombre_completo || "No registrado"}</span>
          </div>
          <div className="mb-4">
            <span className="block text-purple-900 font-semibold mb-1">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="mb-4">
            <span className="block text-purple-900 font-semibold mb-1">Teléfono</span>
            <span>{user.telefono || "No registrado"}</span>
          </div>
          <button onClick={() => setEditando(true)} className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded transition">Editar perfil</button>
        </div>
      )}
    </div>
  );
}
