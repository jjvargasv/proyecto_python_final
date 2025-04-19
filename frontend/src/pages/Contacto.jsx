import React, { useState } from "react";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/contacto/enviar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("No se pudo enviar el mensaje");
      setEnviado(true);
      setForm({ nombre: "", email: "", mensaje: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh] flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-white mb-6">Contacto</h2>
      <form onSubmit={handleSubmit} className="bg-white/10 rounded-lg shadow-lg p-8 w-full max-w-lg flex flex-col gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
        />
        <textarea
          name="mensaje"
          placeholder="Mensaje"
          value={form.mensaje}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
          rows={4}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" className="px-6 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition">Enviar</button>
        {enviado && <p className="text-green-400 text-sm">¡Mensaje enviado!</p>}
      </form>
    </section>
  );
}
