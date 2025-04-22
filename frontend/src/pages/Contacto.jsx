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
    <section className="min-h-[60vh] flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#211044] via-[#3b1d63] to-[#1e1550] animate-fadein py-12 px-4">
      <div className="flex-1 flex flex-col items-center md:items-start mb-10 md:mb-0 md:mr-16 animate-fadein" style={{animationDelay:'100ms'}}>
        <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg">Contáctanos</h2>
        <p className="text-lg text-purple-100 mb-6 max-w-md">¿Tienes dudas, comentarios o deseas cotizar? Escríbenos y te responderemos lo antes posible.</p>
        <div className="flex flex-col gap-4 text-white text-lg">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h15a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75l9.75 7.5 9.75-7.5" /></svg>
            <span>contacto@alfarerojt.com</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5v.75a2.25 2.25 0 01-2.25 2.25h-3a2.25 2.25 0 01-2.25-2.25V7.5m12 0A2.25 2.25 0 0017.25 5.25h-10.5A2.25 2.25 0 004.5 7.5v9A2.25 2.25 0 006.75 18h10.5a2.25 2.25 0 002.25-2.25v-9z" /></svg>
            <span>+57 314 380 4414</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657A8 8 0 118 1.343a8 8 0 019.657 15.314z" /></svg>
            <span>Bogotá</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8a5 5 0 01-10 0V7a5 5 0 0110 0v1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v.01" /></svg>
            <span>@Alfarerojt</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white/10 rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col gap-4 animate-fadein" style={{animationDelay:'200ms'}}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="px-4 py-3 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-3 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          name="mensaje"
          placeholder="Mensaje"
          value={form.mensaje}
          onChange={handleChange}
          className="px-4 py-3 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={5}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {enviado && <p className="text-green-400 text-sm">¡Mensaje enviado correctamente!</p>}
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-900 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-lg transition-colors mt-2"
        >
          Enviar mensaje
        </button>
      </form>
    </section>
  );
}
