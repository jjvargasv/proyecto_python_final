import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCarrito } from "../contexts/CarritoContext";
import { agregarAlCarritoAPI } from "../utils/api";

function safeSetToken(token) {
  try {
    localStorage.setItem("token", token);
    // Notifica a otros componentes (incluido el Header)
    window.dispatchEvent(new Event("storage"));
    return true;
  } catch (err) {
    alert("No se puede acceder al almacenamiento local. El login no funcionará en este contexto del navegador.\n\nPrueba abrir el sitio en una pestaña normal, no en modo incógnito, y desactiva extensiones de privacidad.");
    return false;
  }
}

// Sincroniza productos del carrito local al backend tras login
async function migrarCarritoLocalAlBackend() {
  try {
    const localCart = JSON.parse(localStorage.getItem("carrito")) || [];
    if (localCart.length === 0) return;
    // Agrega cada producto al backend
    for (const prod of localCart) {
      await agregarAlCarritoAPI(prod.id, prod.cantidad || 1);
    }
    localStorage.removeItem("carrito"); // Limpia carrito local
  } catch (err) {
    // Si hay error, no detiene el login
    // Puedes mostrar un mensaje si quieres
  }
}

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { recargarCarrito } = useCarrito();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/users/token_obtain_pair/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Credenciales inválidas");
      const data = await res.json();
      if (safeSetToken(data.access)) {
        await migrarCarritoLocalAlBackend(); // <-- MIGRA CARRITO LOCAL TRAS LOGIN
        await recargarCarrito(); // Fuerza recarga del carrito tras login
        // Redirigir al perfil tras login
        navigate("/perfil");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white py-12">
      <form onSubmit={handleSubmit} className="bg-white/10 rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-4">
        <h2 className="text-3xl font-bold mb-4 text-center">Iniciar sesión</h2>
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
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
          required
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="px-6 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        <button type="button" className="text-purple-300 underline mt-2" onClick={() => navigate("/registro")}>¿No tienes cuenta? Regístrate</button>
        <Link to="/recuperar-clave" className="text-purple-400 hover:underline text-sm block mt-4 text-center">
          ¿Olvidaste tu contraseña?
        </Link>
      </form>
    </section>
  );
}
