import React, { useEffect, useState } from "react";

// Página de administración para gestionar los mensajes de contacto recibidos
export default function AdminMensajesContacto() {
  // Estado para almacenar los mensajes
  const [mensajes, setMensajes] = useState([]);
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true);
  // Estado para mostrar mensajes de error
  const [error, setError] = useState(null);
  // Estado para el texto de búsqueda
  const [busqueda, setBusqueda] = useState("");
  // Estado para la página actual de la paginación
  const [pagina, setPagina] = useState(1);
  // Estado para el total de páginas disponibles
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Efecto para cargar los mensajes al montar el componente o cambiar página/búsqueda
  useEffect(() => {
    const token = localStorage.getItem("token");
    let url = `http://localhost:8000/api/contacto/mensajes/?page=${pagina}`;
    if (busqueda) url += `&search=${encodeURIComponent(busqueda)}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado o error al cargar mensajes");
        return res.json();
      })
      .then((data) => {
        setMensajes(data.results || data);
        setTotalPaginas(data.total_pages || 1);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [pagina, busqueda]);

  // Función para manejar la búsqueda
  function handleBuscar(e) {
    setBusqueda(e.target.value);
    setPagina(1);
  }

  // Función para cambiar de página en la paginación
  function handlePagina(nueva) {
    setPagina(nueva);
  }

  // Renderizado condicional mientras se cargan los datos
  if (loading) return <div className="text-white text-center py-8">Cargando mensajes...</div>;

  // Renderizado principal de la página de mensajes de contacto
  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Mensajes de Contacto</h2>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, email o mensaje..."
          value={busqueda}
          onChange={handleBuscar}
          className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mensajes.length === 0 && <div className="text-gray-300">No hay mensajes.</div>}
        {mensajes.map((msg) => (
          <div key={msg.id} className="bg-white/10 rounded-lg shadow-lg p-6 flex flex-col gap-2">
            <div className="text-lg font-bold text-white">{msg.nombre}</div>
            <div className="text-gray-300">Email: {msg.email}</div>
            <div className="text-gray-400 text-xs">Fecha: {new Date(msg.fecha).toLocaleString()}</div>
            <div className="text-white mt-2">{msg.mensaje}</div>
            {/* Aquí se podrían agregar acciones como responder o eliminar mensaje */}
          </div>
        ))}
      </div>
      {/* Paginación */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded ${pagina === i + 1 ? "bg-purple-700 text-white" : "bg-white/30 text-purple-700"}`}
            onClick={() => handlePagina(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
