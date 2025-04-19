import React, { useState } from "react";

export default function FormReseña({ onReseñaCreada }) {
  const [texto, setTexto] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMensaje("");
    setExito(false);
    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("Debes iniciar sesión para dejar una reseña.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/reseñas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ texto, calificacion }),
      });
      if (res.status === 403) {
        setMensaje("Solo usuarios que hayan comprado pueden dejar reseña.");
        return;
      }
      if (!res.ok) {
        setMensaje("Error al enviar reseña.");
        return;
      }
      setExito(true);
      setMensaje("¡Gracias por tu reseña!");
      setTexto("");
      setCalificacion(5);
      if (onReseñaCreada) onReseñaCreada();
    } catch {
      setMensaje("Error de conexión.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 rounded-lg p-6 flex flex-col gap-3 mt-8 max-w-lg mx-auto">
      <label className="text-black font-bold">Tu calificación:</label>
      <select value={calificacion} onChange={e => setCalificacion(Number(e.target.value))} className="px-2 py-1 rounded text-black">
        {[5,4,3,2,1].map(n => <option key={n} value={n}>{"★".repeat(n)}</option>)}
      </select>
      <label className="text-black font-bold">Tu reseña:</label>
      <textarea value={texto} onChange={e => setTexto(e.target.value)} required minLength={10} maxLength={400} className="rounded px-2 py-1 resize-none text-black" rows={4} />
      <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">Publicar reseña</button>
      {mensaje && <div className={`text-sm ${exito ? "text-green-400" : "text-red-400"}`}>{mensaje}</div>}
    </form>
  );
}
