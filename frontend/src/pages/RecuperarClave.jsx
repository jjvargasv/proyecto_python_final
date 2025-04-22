import React, { useState } from "react";

export default function RecuperarClave() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Paso 1: Solicitar email
  const handleEnviarEmail = async (e) => {
    e.preventDefault();
    setMensaje(""); setError(""); setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/users/password_reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("No se pudo enviar el email. ¿El correo está registrado?");
      setMensaje("Si el correo existe, recibirás instrucciones en consola.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Confirmar token y nueva clave
  const handleConfirmar = async (e) => {
    e.preventDefault();
    setMensaje(""); setError(""); setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/users/password_reset/confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, token, new_password: newPassword }),
      });
      if (!res.ok) throw new Error("Token inválido o expirado.");
      setMensaje("¡Contraseña restablecida! Ya puedes iniciar sesión.");
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
      <div className="bg-white/10 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-purple-200 mb-6 text-center">Recuperar contraseña</h1>
        {step === 1 && (
          <form onSubmit={handleEnviarEmail}>
            <label className="block mb-2 text-purple-100 font-semibold">Correo electrónico</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded bg-purple-950 text-purple-100 placeholder-purple-400 border-2 border-purple-400 focus:border-purple-600 mb-6"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded font-bold shadow-md transition-all"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleConfirmar}>
            <label className="block mb-2 text-purple-100 font-semibold">UID (de consola)</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded bg-purple-950 text-purple-100 placeholder-purple-400 border-2 border-purple-400 focus:border-purple-600 mb-4"
              value={uid}
              onChange={e => setUid(e.target.value)}
              required
              placeholder="UID copiado de consola"
            />
            <label className="block mb-2 text-purple-100 font-semibold">Token (de consola)</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded bg-purple-950 text-purple-100 placeholder-purple-400 border-2 border-purple-400 focus:border-purple-600 mb-4"
              value={token}
              onChange={e => setToken(e.target.value)}
              required
              placeholder="Token copiado de consola"
            />
            <label className="block mb-2 text-purple-100 font-semibold">Nueva contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-purple-950 text-purple-100 placeholder-purple-400 border-2 border-purple-400 focus:border-purple-600 mb-6"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded font-bold shadow-md transition-all"
              disabled={loading}
            >
              {loading ? "Restableciendo..." : "Restablecer contraseña"}
            </button>
          </form>
        )}
        {step === 3 && (
          <div className="text-center text-green-300 font-bold py-8">
            <svg className="mx-auto mb-2 w-12 h-12 text-green-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
            ¡Contraseña restablecida! Ya puedes iniciar sesión.
          </div>
        )}
        {mensaje && <div className="mt-6 text-green-200 text-center">{mensaje}</div>}
        {error && <div className="mt-6 text-red-300 text-center">{error}</div>}
      </div>
    </section>
  );
}
