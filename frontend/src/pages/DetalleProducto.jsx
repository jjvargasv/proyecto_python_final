import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductoDetalle } from "../utils/api";
import { useCarrito } from "../contexts/CarritoContext";
import MiniGaleria from "../components/MiniGaleria";
import ProductosRandom from "../components/ProductosRandom";
import { agregarFavorito, eliminarFavorito, fetchFavoritos } from "../utils/favoritosAPI";
import useToast from "../hooks/useToast";
// import RecomendadosPorFavoritos from "../components/RecomendadosPorFavoritos";

// Página para mostrar el detalle de un producto específico
export default function DetalleProducto() {
  // Obtiene el parámetro de la URL (id del producto)
  const { id } = useParams();
  // Estado para almacenar los datos del producto
  const [producto, setProducto] = useState(null);
  // Estado para manejar la carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Hook para navegar entre páginas
  const navigate = useNavigate();
  // Estado para mostrar mensaje de agregado al carrito
  const [mensaje, setMensaje] = useState("");
  // Token de autenticación
  const token = localStorage.getItem("token");
  // Estado para la cantidad del producto
  const [cantidad, setCantidad] = useState(1);
  // Estado para saber si el producto es favorito
  const [esFavorito, setEsFavorito] = useState(false);
  // Estado para el id del favorito
  const [favoritoId, setFavoritoId] = useState(null);
  // Estado para manejar la carga de favoritos
  const [loadingFav, setLoadingFav] = useState(false);
  // Estado para la animación del corazón
  const [heartAnim, setHeartAnim] = useState(false);
  // Hook para mostrar toast
  const { showToast, ToastComponent } = useToast();
  // Hook para agregar al carrito
  const { agregarAlCarrito } = useCarrito();

  // Efecto para cargar los datos del producto al montar el componente o cambiar el id
  useEffect(() => {
    console.log('DetalleProducto id:', id);
    fetchProductoDetalle(id)
      .then((prod) => {
        console.log('DetalleProducto API response:', prod);
        setProducto({
          id: prod.id,
          nombre: prod.nombre || prod.name,
          descripcion: prod.descripcion || prod.description,
          detalles: prod.detalles || prod.details,
          precio: prod.precio || prod.price,
          imagen: (prod.imagen || prod.image || "").trim(),
          imagenes: (prod.images && prod.images.length > 0) ? prod.images : ((prod.image_url || prod.image) ? [{ image: prod.image_url || prod.image }] : []),
          existencias: prod.existencias || prod.stock,
          categoria: prod.categoria || prod.category,
          views_count: prod.views_count,
        });
      })
      .catch((e) => {
        console.error('DetalleProducto error:', e);
        setError(e.message)
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Efecto para revisar si el producto es favorito
  useEffect(() => {
    // Revisar si el producto es favorito
    async function checkFavorito() {
      try {
        const favoritos = await fetchFavoritos();
        const fav = favoritos.find(f => String(f.producto.id) === String(id));
        if (fav) {
          setEsFavorito(true);
          setFavoritoId(fav.id);
        } else {
          setEsFavorito(false);
          setFavoritoId(null);
        }
      } catch {
        setEsFavorito(false);
        setFavoritoId(null);
      }
    }
    if (token) checkFavorito();
  }, [id, token]);

  // Función para agregar/quitar favorito
  async function handleFavorito() {
    setLoadingFav(true);
    setHeartAnim(true);
    try {
      if (esFavorito && favoritoId) {
        await eliminarFavorito(favoritoId);
        setEsFavorito(false);
        setFavoritoId(null);
        showToast("Quitado de favoritos", "info");
      } else {
        await agregarFavorito(id);
        setEsFavorito(true);
        showToast("Agregado a favoritos", "success");
      }
    } catch (e) {
      if (e.message.includes('no existe') || e.message.includes('permiso')) {
        showToast("El favorito ya no existe o no tienes permiso para eliminarlo.", "warning");
        setEsFavorito(false);
        setFavoritoId(null);
      } else if (e.message.toLowerCase().includes('autenticado')) {
        showToast("Debes iniciar sesión para gestionar favoritos.", "warning");
      } else {
        showToast(e.message, "error");
      }
    } finally {
      setLoadingFav(false);
      setTimeout(() => setHeartAnim(false), 800);
    }
  }

  // Función para agregar al carrito
  function handleAgregar() {
    if (producto && cantidad > 0 && cantidad <= (producto.existencias ?? producto.stock ?? 0)) {
      agregarAlCarrito(producto, cantidad);
      setMensaje(`✔️ ${producto.nombre} agregado al carrito`);
      setTimeout(() => setMensaje(""), 1800);
    }
  }

  // Renderizado de la página de detalle
  if (loading) return <div className="text-center text-white py-12">Cargando...</div>;
  if (error) return <div className="text-center text-red-400 py-12">{error}</div>;
  if (!producto) return <div className="text-center text-red-400 py-12">Producto no encontrado.</div>;

  return (
    <section className="container mx-auto py-10 px-4 min-h-[70vh]">
      <button className="mb-6 text-purple-400 hover:underline" onClick={() => navigate(-1)}>&larr; Volver</button>
      <div className="bg-gradient-to-br from-gray-900 via-purple-950 to-black rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row gap-12 border border-purple-900/40">
        {/* Galería de imágenes grande tipo slider */}
        <div className="flex flex-col items-center gap-4 md:w-1/2">
          <MiniGaleria imagenes={producto.imagenes} alt={producto.nombre} size={340} rounded={true} />
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-green-400 text-sm font-semibold"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>Envío rápido</span>
            <span className="flex items-center gap-1 text-purple-300 text-sm font-semibold"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>Garantía 3 meses</span>
          </div>
        </div>
        {/* Info principal */}
        <div className="flex-1 flex flex-col gap-6 justify-between">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">{producto.nombre}</h2>
            <button
              className={`text-3xl transition-transform duration-200 ${esFavorito ? "text-red-500" : "text-gray-300"} ${heartAnim ? "scale-125" : "scale-100"}`}
              title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
              onClick={handleFavorito}
              disabled={loadingFav}
              aria-label={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              {esFavorito ? "♥" : "♡"}
            </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-purple-300 drop-shadow">{Number(producto.precio).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</span>
            <span className="flex items-center gap-1 text-gray-300 text-sm"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>Stock: <b className='text-green-400 ml-1'>{producto.existencias ?? producto.stock ?? 0}</b></span>
          </div>
          <p className="text-lg text-gray-200 mb-6 whitespace-pre-line leading-relaxed">{producto.descripcion}</p>
          <div className="flex gap-4 items-center mb-4">
            <input
              type="number"
              min={1}
              max={producto.existencias ?? producto.stock ?? 1}
              value={cantidad}
              onChange={e => setCantidad(Math.max(1, Math.min(Number(e.target.value), producto.existencias ?? producto.stock ?? 1)))}
              className="w-20 px-3 py-2 rounded-lg border border-purple-700 bg-black/60 text-white font-bold text-xl shadow"
              disabled={!producto.existencias || producto.existencias < 1}
            />
            <button
              className={`px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-colors bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-900 hover:to-purple-700 text-white ${(!producto.existencias || producto.existencias < 1) ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleAgregar}
              disabled={!producto.existencias || producto.existencias < 1}
            >
              {(!producto.existencias || producto.existencias < 1) ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>
          {mensaje && <div className="mt-2 text-green-400 bg-white/10 rounded px-4 py-2 shadow text-center animate-bounce">{mensaje}</div>}
        </div>
      </div>
      {/* Detalles y productos recomendados debajo de la card principal */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {producto.detalles && producto.detalles.trim() !== '' ? (
          <div className="md:col-span-2 bg-white/5 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-purple-200 mb-4">Detalles de producto</h3>
            <p className="text-gray-200 mb-6 whitespace-pre-line leading-relaxed">{producto.detalles}</p>
          </div>
        ) : null}
        <div className={`bg-white/5 rounded-xl p-6 shadow-lg${(!producto.detalles || producto.detalles.trim() === '') ? ' md:col-span-3 flex flex-col items-center justify-center' : ''}`}>
          <h4 className="text-lg font-bold text-purple-200 mb-2 text-center">Te puede interesar</h4>
          <ProductosRandom excluidoId={producto.id} onAddToCart={agregarAlCarrito} />
        </div>
      </div>
      <div className="border-t border-purple-900/40 pt-6 mt-6">
        <div className="flex gap-8 text-gray-400 text-sm">
          <span className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>Pago seguro</span>
          <span className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>Soporte 24/7</span>
        </div>
      </div>
      {/* {token && <RecomendadosPorFavoritos />} */}
      <ToastComponent />
    </section>
  );
}
