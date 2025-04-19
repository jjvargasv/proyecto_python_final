import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart, FaUserCircle, FaClipboardList } from "react-icons/fa";

const navLinks = [
  { name: "Inicio", to: "/" },
  { name: "Productos", to: "/productos" },
  { name: "Categorías", to: "/categorias" },
  { name: "Contacto", to: "/contacto" },
  { name: "Carrito", to: "/carrito", icon: <FaShoppingCart className="inline-block mb-1 mr-1" /> },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Permite actualizar el estado del header al login/logout desde cualquier parte
  useEffect(() => {
    function syncAuth() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setIsLogged(true);
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUsername(payload.username || "Usuario");
        } else {
          setIsLogged(false);
          setUsername("");
        }
      } catch {
        setIsLogged(false);
        setUsername("");
      }
    }
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  function handleLogout() {
    try { localStorage.removeItem("token"); } catch {}
    setIsLogged(false);
    setUsername("");
    navigate("/");
    // Notifica a otras pestañas/ventanas
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-purple-900 to-black shadow-lg">
      <nav className="container mx-auto flex items-center justify-between py-2 px-4">
        {/* Logo y nombre */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold text-white tracking-widest hover:text-purple-300 transition">
            {/* Cambia por tu logo si lo deseas */}
            <span className="inline-block align-middle">🛒</span> <span className="align-middle">ALFAREROJT</span>
          </Link>
        </div>
        {/* Menú de navegación */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-2">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.to}
                className="px-3 py-1 rounded hover:bg-purple-800 hover:text-white transition flex items-center gap-1 text-white"
              >
                {link.icon ? link.icon : null}
                {link.name}
              </Link>
            ))}
          </div>
          {/* Íconos de usuario */}
          {isLogged ? (
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 px-3 py-1 rounded hover:bg-purple-800 hover:text-white transition text-white"
                onClick={() => navigate("/perfil")}
                title="Perfil"
              >
                <FaUserCircle className="text-2xl" />
                <span className="hidden md:inline">Perfil</span>
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 rounded hover:bg-purple-800 hover:text-white transition text-white"
                onClick={() => navigate("/ordenes")}
                title="Historial de compras"
              >
                <FaClipboardList className="text-2xl" />
                <span className="hidden md:inline">Historial</span>
              </button>
              <button
                className="px-3 py-1 rounded bg-red-700 text-white hover:bg-red-800 transition ml-2"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <button className="px-3 py-1 rounded bg-purple-700 text-white hover:bg-purple-800 transition" onClick={() => { setMenuOpen(false); navigate("/login"); }}>Iniciar sesión</button>
              <button className="px-3 py-1 rounded bg-white text-purple-700 border border-purple-700 hover:bg-purple-100 transition" onClick={() => { setMenuOpen(false); navigate("/registro"); }}>Registrarse</button>
            </>
          )}
          {/* Menú móvil */}
          <button className="md:hidden text-2xl text-white ml-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-r from-gray-900 via-purple-900 to-black px-4 py-6 flex flex-col gap-2">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.to}
              className="px-3 py-2 rounded hover:bg-purple-800 hover:text-white transition flex items-center gap-1 text-white"
              onClick={() => setMenuOpen(false)}
            >
              {link.icon ? link.icon : null}
              {link.name}
            </Link>
          ))}
          {isLogged ? (
            <>
              <button
                className="flex items-center gap-1 px-3 py-2 rounded hover:bg-purple-800 hover:text-white transition text-white"
                onClick={() => { setMenuOpen(false); navigate("/perfil"); }}
              >
                <FaUserCircle className="text-2xl" /> Perfil
              </button>
              <button
                className="flex items-center gap-1 px-3 py-2 rounded hover:bg-purple-800 hover:text-white transition text-white"
                onClick={() => { setMenuOpen(false); navigate("/ordenes"); }}
              >
                <FaClipboardList className="text-2xl" /> Historial
              </button>
              <button
                className="px-3 py-2 rounded bg-red-700 text-white hover:bg-red-800 transition mt-2"
                onClick={() => { setMenuOpen(false); handleLogout(); }}
              >
                Cerrar sesión
              </button>
            </>
          ) : null}
        </div>
      )}
    </header>
  );
}
