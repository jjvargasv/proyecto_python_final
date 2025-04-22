import React, { useEffect, useState } from "react";

// Página de administración para gestionar usuarios registrados
export default function AdminUsuarios() {
  // Estado para almacenar los usuarios
  const [usuarios, setUsuarios] = useState([]);
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para mostrar mensajes de error
  const [error, setError] = useState(null);

  // Efecto para cargar los usuarios al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/api/users/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUsuarios)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Renderizado condicional mientras se cargan los datos
  if (loading) return <div className="text-white text-center py-8">Cargando usuarios...</div>;

  // Renderizado principal de la página de administración de usuarios
  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Gestión de Usuarios</h2>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {usuarios.map((u) => (
          <div key={u.id} className="bg-white/10 rounded-lg shadow-lg p-6 flex flex-col gap-2">
            {/* Nombre de usuario */}
            <div className="text-lg font-bold text-white">{u.username}</div>
            {/* Email del usuario */}
            <div className="text-gray-300">Email: {u.email}</div>
            {/* ID del usuario */}
            <div className="text-gray-400 text-xs">ID: {u.id}</div>
            {/* Roles del usuario */}
            <div className="text-gray-400 text-xs">Superuser: {u.is_superuser ? "Sí" : "No"} | Staff: {u.is_staff ? "Sí" : "No"}</div>
            {/* Aquí puedes agregar botones para editar roles, eliminar usuarios, etc. */}
          </div>
        ))}
      </div>
    </section>
  );
}
