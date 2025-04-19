import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductos } from "../api";
import { useCarrito } from "../contexts/CarritoContext";

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [mainImg, setMainImg] = useState(0);

  useEffect(() => {
    fetchProductos()
      .then((data) => {
        const prod = data.find((p) => String(p.id) === String(id));
        if (prod) {
          setProducto({
            id: prod.id,
            nombre: prod.nombre || prod.name,
            descripcion: prod.descripcion || prod.description,
            precio: prod.precio || prod.price,
            imagen: (prod.imagen || prod.image || "").trim(),
            imagenes: prod.images || [],
            existencias: prod.existencias || prod.stock,
            categoria: prod.categoria || prod.category,
          });
        } else {
          setError("Producto no encontrado");
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAgregar() {
    if (producto) {
      agregarAlCarrito(producto, 1);
      setMensaje(`✔️ ${producto.nombre} agregado al carrito`);
      setTimeout(() => setMensaje(""), 1800);
    }
  }

  if (loading) return <div className="text-center text-white py-12">Cargando...</div>;
  if (error) return <div className="text-center text-red-400 py-12">{error}</div>;
  if (!producto) return null;

  return (
    <section className="container mx-auto py-8 px-4 min-h-[60vh]">
      <button className="mb-4 text-purple-400 hover:underline" onClick={() => navigate(-1)}>&larr; Volver</button>
      <div className="bg-white/10 rounded-lg shadow-lg p-8 flex flex-col md:flex-row gap-8">
        {/* Galería de imágenes mejorada */}
        <div className="flex flex-col gap-2 items-center">
          {producto.imagenes && producto.imagenes.length > 1 ? (
            <div className="flex gap-2 mb-2 overflow-x-auto w-full justify-center">
              {producto.imagenes.map((img, idx) => (
                <img key={idx} src={img.image} alt={producto.nombre + ' ' + (idx+1)} className="w-20 h-20 object-cover rounded border-2 border-purple-300 cursor-pointer hover:scale-110 transition" onClick={() => setMainImg(idx)} />
              ))}
            </div>
          ) : null}
          {/* Imagen principal seleccionada */}
          <img
            src={(producto.imagenes && producto.imagenes.length > 0 && producto.imagenes[mainImg]) ? producto.imagenes[mainImg].image : producto.imagen}
            alt={producto.nombre}
            className="w-64 h-64 object-cover rounded mb-2 border-2 border-purple-300"
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-white">{producto.nombre}</h2>
          <p className="text-lg text-gray-300">{producto.descripcion}</p>
          <p className="text-2xl text-purple-200 font-bold">{Number(producto.precio).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</p>
          <div className="flex gap-4 mt-4">
            <button className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded transition" onClick={handleAgregar}>Agregar al carrito</button>
          </div>
          {mensaje && <div className="mt-2 text-green-400 bg-white/10 rounded px-4 py-2 shadow text-center animate-bounce">{mensaje}</div>}
        </div>
      </div>
    </section>
  );
}
