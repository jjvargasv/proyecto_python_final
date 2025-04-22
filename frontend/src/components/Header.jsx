// Componente de cabecera principal con navegación y autenticación
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart, FaUserCircle, FaClipboardList, FaHeart } from "react-icons/fa";
import { fetchFavoritos } from "../utils/favoritosAPI";
import { connectFavoritosWS, onFavoritosUpdate, closeFavoritosWS } from "../utils/wsFavoritos";
import useToast from "../hooks/useToast";
import atob from "atob";

export default function Header() {
  // Estado para saber si el usuario está logueado
  const [isLogged, setIsLogged] = useState(false);
  // Estado para el nombre de usuario
  const [username, setUsername] = useState("");
  // Estado para el contador de favoritos
  const [favCount, setFavCount] = useState(0);
  // Estado para saber si la función de favoritos está disponible
  const [favoritosDisponible, setFavoritosDisponible] = useState(true);
  // Estado para el menú móvil
  const [menuOpen, setMenuOpen] = useState(false);
  // Hook para navegar entre páginas
  const navigate = useNavigate();
  // Hook para obtener la ubicación actual
  const location = useLocation();
  // Hook para mostrar notificaciones
  const { showToast, ToastComponent } = useToast();

  // Sincroniza el estado de autenticación con el token en localStorage
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

  // Efecto para sincronizar autenticación al montar el componente
  useEffect(() => {
    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // Efecto para cargar el contador de favoritos y sincronizar por WebSocket
  useEffect(() => {
    let disconnect = null;
    let wsConnected = false;
    async function loadFavCount() {
      if (!isLogged) { setFavCount(0); setFavoritosDisponible(true); return; }
      try {
        const favs = await fetchFavoritos();
        if (Array.isArray(favs)) {
          setFavCount(favs.length);
          setFavoritosDisponible(favs !== undefined && favs !== null && favs.length !== 0);
          if (favs.length === 0) {
            showToast("La función de favoritos no está disponible en este backend.", "warning");
          }
        } else {
          setFavCount(0);
          setFavoritosDisponible(false);
          showToast("La función de favoritos no está disponible en este backend.", "warning");
        }
      } catch {
        setFavCount(0);
        setFavoritosDisponible(false);
        showToast("La función de favoritos no está disponible en este backend.", "warning");
      }
    }
    if (isLogged) {
      const token = localStorage.getItem("token");
      if (token) {
        connectFavoritosWS(token);
        wsConnected = true;
        disconnect = onFavoritosUpdate(data => {
          if (data && typeof data.count === "number") {
            setFavCount(data.count);
          } else {
            loadFavCount();
          }
        });
      }
      loadFavCount();
    }
    // Escuchar cambios en favoritos desde otras pestañas
    window.addEventListener("storage", loadFavCount);
    return () => {
      window.removeEventListener("storage", loadFavCount);
      if (wsConnected) closeFavoritosWS();
      if (disconnect) disconnect();
    };
  }, [isLogged, showToast]);

  // Función para cerrar sesión
  function handleLogout() {
    try { localStorage.removeItem("token"); } catch {}
    setIsLogged(false);
    setUsername("");
    navigate("/");
    window.dispatchEvent(new Event("storage"));
    closeFavoritosWS();
  }

  // Función para abrir la página de favoritos
  function handleFavoritosClick() {
    if (!favoritosDisponible) {
      showToast("La función de favoritos no está disponible en este backend.", "warning");
      return;
    }
    navigate("/favoritos");
  }

  // Efecto para mostrar notificación si la función de favoritos no está disponible
  useEffect(() => {
    if (location.pathname === "/favoritos" && !favoritosDisponible) {
      showToast("La función de favoritos no está disponible en este backend.", "warning");
      navigate("/");
    }
  }, [location.pathname, favoritosDisponible, navigate, showToast]);

  // Renderizado del header con navegación y botones
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-purple-900 to-black shadow-lg">
      <nav className="container mx-auto flex items-center justify-between py-2 px-4">
        {/* Logo y nombre */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white tracking-widest hover:text-purple-300 transition">
            {/* Logo colorido */}
            <img src={require('../assets/logo-colorido-leon.png').default || require('../assets/logo-colorido-leon.png')} alt="Logo AlfareroJT" className="w-10 h-10 rounded-full shadow-md bg-black object-cover" />
            <span className="align-middle">ALFAREROJT</span>
          </Link>
        </div>
        {/* Botón hamburguesa SIEMPRE visible en móvil */}
        <button className="md:hidden text-2xl text-white ml-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        {/* Navegación principal SOLO visible en escritorio/tablet */}
        <div className="hidden md:flex items-center gap-4">
          {/* Agrega el enlace de órdenes al menú principal solo para usuarios logueados */}
          {isLogged && (
            <Link to="/ordenes" className="text-white hover:text-purple-300 font-semibold flex items-center gap-1">
              <FaClipboardList className="inline-block mb-1 mr-1" /> Órdenes
            </Link>
          )}
          {/* Ícono de favoritos solo si está disponible */}
          {isLogged && favoritosDisponible && (
            <button
              aria-label="Favoritos"
              className="relative text-white hover:text-red-400 transition-all text-2xl focus:outline-none"
              onClick={handleFavoritosClick}
            >
              <FaHeart className={favCount > 0 ? "text-red-500 animate-pulse" : "text-gray-300"} />
              {favCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2 py-0.5 font-bold shadow animate-bounce">
                  {favCount}
                </span>
              )}
            </button>
          )}
          {/* Menú usuario */}
          {isLogged && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white font-semibold flex items-center gap-2 focus:outline-none"
                aria-label="Abrir menú de usuario"
              >
                <span className="hidden md:inline">{username || "Usuario"}</span>
                <svg className={`w-4 h-4 transform transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100"
                    onClick={() => { navigate('/perfil'); setMenuOpen(false); }}
                  >
                    Ver perfil
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100"
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
          {isLogged ? null : (
            <Link to="/login" className="text-white hover:text-purple-300 font-semibold flex items-center gap-1">
              <FaUserCircle className="text-2xl" /> Iniciar sesión
            </Link>
          )}
        </div>
      </nav>
      {/* Menú móvil desplegable SOLO visible en móvil */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-r from-gray-900 via-purple-900 to-black px-4 py-6 flex flex-col gap-2 items-center text-center rounded-b-xl shadow-lg">
          {/* Agrega el enlace de órdenes al menú principal solo para usuarios logueados */}
          {isLogged && (
            <Link to="/ordenes" className="px-3 py-2 rounded hover:bg-purple-800 hover:text-white transition flex items-center gap-1 text-white w-full justify-center">
              <FaClipboardList className="text-2xl" /> Órdenes
            </Link>
          )}
          {isLogged ? (
            <>
              <button
                className="flex items-center gap-1 px-3 py-2 rounded hover:bg-purple-800 hover:text-white transition text-white w-full justify-center"
                onClick={() => { setMenuOpen(false); navigate("/perfil"); }}
              >
                <FaUserCircle className="text-2xl" /> Perfil
              </button>
              <button
                className="px-3 py-2 rounded bg-red-700 text-white hover:bg-red-800 transition mt-2 w-full"
                onClick={() => { setMenuOpen(false); handleLogout(); }}
              >
                Cerrar sesión
              </button>
            </>
          ) : null}
        </div>
      )}
      <ToastComponent />
    </header>
  );
}
