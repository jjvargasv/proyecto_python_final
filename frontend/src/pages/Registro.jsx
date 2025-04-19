import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    alert("No se puede acceder al almacenamiento local. El registro no funcionará correctamente en este contexto del navegador.\n\nPrueba abrir el sitio en una pestaña normal, no en modo incógnito, y desactiva extensiones de privacidad.");
    return false;
  }
}

export default function Registro() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    nombre_completo: "",
    telefono: "",
    direccion: "",
    metodo_pago: "",
  });
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setExito(null);
    try {
      const res = await fetch("http://localhost:8000/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al registrar. El usuario puede existir o los datos no son válidos.");
      setExito("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container mx-auto py-10 px-4 min-h-[60vh] flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-white mb-6">Registro</h2>
      {error && <Alerta tipo="error" mensaje={error} onClose={() => setError(null)} />}
      {exito && <Alerta tipo="exito" mensaje={exito} onClose={() => setExito(null)} />}
      <form onSubmit={handleSubmit} className="bg-white/10 rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
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
          type="text"
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
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
        <button type="submit" className="px-6 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </section>
  );
}
