// Componente para mostrar el pie de página con formulario de suscripción y enlaces sociales
import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

// Enlaces a redes sociales
const socialLinks = [
  { icon: <FaFacebook />, href: "https://facebook.com", label: "Facebook" },
  { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
  { icon: <FaTiktok />, href: "https://tiktok.com", label: "TikTok" },
  { icon: <FaYoutube />, href: "https://youtube.com", label: "YouTube" },
];

// Enlaces a páginas legales y de información
const footerLinks = [
  { name: "Acerca de nosotros", href: "/acerca" },
  { name: "Política de privacidad", href: "/privacidad" },
  { name: "Preguntas frecuentes", href: "/faq" },
  { name: "Términos y condiciones", href: "/terminos" },
];

export default function Footer() {
  // Estado para el email ingresado
  const [email, setEmail] = useState("");
  // Estado para mostrar mensajes al usuario
  const [mensaje, setMensaje] = useState("");
  // Estado para indicar éxito en la suscripción
  const [exito, setExito] = useState(false);

  // Función para manejar el envío del formulario de suscripción
  async function handleSuscribir(e) {
    // Evita que el formulario se envíe de manera tradicional
    e.preventDefault();
    // Limpia el mensaje y el estado de éxito
    setMensaje("");
    setExito(false);
    // Verifica si el email está vacío
    if (!email) {
      // Si está vacío, muestra un mensaje al usuario
      setMensaje("Ingresa tu email para suscribirte al boletín.");
      return;
    }
    try {
      // Llama a la API para suscribir el email
      const res = await fetch("http://localhost:8000/api/boletin/suscribirse/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Verifica si la respuesta es exitosa
      if (!res.ok) {
        // Si no es exitosa, verifica el código de estado
        if (res.status === 400) {
          // Si es un error de validación, muestra el mensaje de error
          const data = await res.json();
          setMensaje(data.email ? data.email[0] : "Email inválido o ya suscrito.");
        } else {
          // Si es otro tipo de error, muestra un mensaje genérico
          setMensaje("Error al suscribirse. Intenta más tarde.");
        }
        return;
      }
      // Si la respuesta es exitosa, muestra un mensaje de éxito y limpia el email
      setExito(true);
      setMensaje("¡Te has suscrito al boletín!");
      setEmail("");
    } catch {
      // Si hay un error de conexión, muestra un mensaje de error
      setMensaje("Error de conexión. Intenta más tarde.");
    }
  }

  // Renderizado del pie de página
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-black text-white pt-8 pb-4 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between gap-8">
        <div className="mb-6 md:mb-0">
          <h2 className="text-xl font-bold mb-2">ALFAREROJT</h2>
          <ul className="mb-4">
            {footerLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="hover:underline text-purple-200">{link.name}</a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 text-sm text-purple-100 mt-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h15a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75l9.75 7.5 9.75-7.5" /></svg>
              <span>contacto@alfarerojt.com</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5v.75a2.25 2.25 0 01-2.25 2.25h-3a2.25 2.25 0 01-2.25-2.25V7.5m12 0A2.25 2.25 0 0017.25 5.25h-10.5A2.25 2.25 0 004.5 7.5v9A2.25 2.25 0 006.75 18h10.5a2.25 2.25 0 002.25-2.25v-9z" /></svg>
              <span>+57 314 380 4414</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657A8 8 0 118 1.343a8 8 0 019.657 15.314z" /></svg>
              <span>Bogotá</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8a5 5 0 01-10 0V7a5 5 0 0110 0v1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v.01" /></svg>
              <span>@Alfarerojt</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <form onSubmit={handleSuscribir} className="mb-4 flex gap-2 w-full">
            <input
              type="email"
              placeholder="Tu email para el boletín"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
              required
            />
            <button type="submit" className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800 transition">
              Suscribirse
            </button>
          </form>
          {mensaje && (
            <div className={`text-sm ${exito ? "text-green-400" : "text-red-400"}`}>{mensaje}</div>
          )}
          <div className="flex gap-4 mb-2 mt-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-purple-300 transition"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2"> 2025 MiTiendaAnime. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
