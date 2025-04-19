import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const socialLinks = [
  { icon: <FaFacebook />, href: "https://facebook.com", label: "Facebook" },
  { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
  { icon: <FaTiktok />, href: "https://tiktok.com", label: "TikTok" },
  { icon: <FaYoutube />, href: "https://youtube.com", label: "YouTube" },
];

const footerLinks = [
  { name: "Acerca de nosotros", href: "/acerca" },
  { name: "Política de privacidad", href: "/privacidad" },
  { name: "Preguntas frecuentes", href: "/faq" },
  { name: "Términos y condiciones", href: "/terminos" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);

  async function handleSuscribir(e) {
    e.preventDefault();
    setMensaje("");
    setExito(false);
    if (!email) {
      setMensaje("Ingresa tu email para suscribirte al boletín.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/boletin/suscribirse/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        if (res.status === 400) {
          const data = await res.json();
          setMensaje(data.email ? data.email[0] : "Email inválido o ya suscrito.");
        } else {
          setMensaje("Error al suscribirse. Intenta más tarde.");
        }
        return;
      }
      setExito(true);
      setMensaje("¡Te has suscrito al boletín!");
      setEmail("");
    } catch {
      setMensaje("Error de conexión. Intenta más tarde.");
    }
  }

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-black text-white pt-8 pb-4 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between gap-8">
        <div>
          <h2 className="text-xl font-bold mb-2">ALFAREROJT</h2>
          <ul className="mb-4">
            {footerLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-300 transition"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm mb-2">Correo electrónico: contacto@alfarerojt.com</p>
          <p className="text-sm mb-2">WhatsApp: +57 322 680 1175</p>
          <p className="text-sm">Bogotá, Colombia</p>
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
