import React, { createContext, useContext, useEffect, useState } from "react";
import {
  fetchCarrito,
  agregarAlCarritoAPI,
  eliminarDelCarritoAPI,
  actualizarCantidadCarritoAPI
} from "../utils/api";

const CarritoContext = createContext();

export function useCarrito() {
  return useContext(CarritoContext);
}

function getLocalCart() {
  try {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  } catch {
    return [];
  }
}

function setLocalCart(carrito) {
  try {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  } catch {}
}

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertaGlobal, setAlertaGlobal] = useState(null);

  function getToken() {
    return localStorage.getItem("token");
  }

  React.useEffect(() => {
    function handleStorageChange(e) {
      if (e.key === "token") {
        recargarCarrito();
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Cargar carrito al iniciar (backend si logueado, localStorage si no)
  useEffect(() => {
    recargarCarrito();
  }, []);

  async function recargarCarrito() {
    const token = getToken();
    if (!token) {
      setCarrito(getLocalCart());
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCarrito();
      setCarrito(
        (data.items || []).map((item) => ({
          id: item.product.id,
          nombre: item.product.nombre || item.product.name,
          descripcion: item.product.descripcion || item.product.description,
          precio: item.product.precio || item.product.price,
          images: item.product.images && item.product.images.length > 0
            ? item.product.images.map(img => {
                const imgUrl = typeof img === 'string' ? img : img.image;
                const absUrl = absolutizeImageUrl(imgUrl);
                return absUrl ? { image: absUrl } : null;
              }).filter(Boolean)
            : ((item.product.image_url || item.product.imagen || item.product.image)
                ? [{ image: absolutizeImageUrl(item.product.image_url || item.product.imagen || item.product.image) }]
                : []),
          cantidad: item.quantity,
          item_id: item.id,
        }))
      );
      setError(null);
    } catch (e) {
      if (e.message.includes('401')) {
        setAlertaGlobal({ tipo: 'info', mensaje: 'Sesión expirada. Por favor, inicia sesión de nuevo.' });
        setCarrito(getLocalCart());
        localStorage.removeItem("token");
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // Utilidad para asegurar URLs absolutas de imagen
  function absolutizeImageUrl(url) {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Quita primer slash si existe
    const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    // Elimina /api/ si está en API_URL
    const base = (process.env.REACT_APP_API_URL || 'http://localhost:8000/api/').replace(/\/api\/?$/, '/');
    return base + cleanUrl;
  }

  // Agregar producto al carrito (local si no logueado, backend si logueado)
  async function agregarAlCarrito(producto, cantidad = 1) {
    if (!producto || !producto.id) {
      setError('Producto inválido.');
      setAlertaGlobal({ tipo: 'error', mensaje: 'Ocurrió un error con el producto.' });
      return;
    }
    if (loading) return;
    const token = getToken();
    if (!token) {
      setCarrito((prev) => {
        const idx = prev.findIndex((p) => p.id === producto.id);
        let nuevo;
        if (idx >= 0) {
          // No permitir superar existencias
          const max = producto.existencias ?? producto.stock ?? 1;
          const nuevaCantidad = Math.min(nuevo ? nuevo[idx].cantidad + cantidad : prev[idx].cantidad + cantidad, max);
          nuevo = [...prev];
          nuevo[idx].cantidad = nuevaCantidad;
        } else {
          nuevo = [...prev, { ...producto, cantidad: Math.min(cantidad, producto.existencias ?? producto.stock ?? 1) }];
        }
        setLocalCart(nuevo);
        setAlertaGlobal({ tipo: "exito", mensaje: "Producto agregado al carrito." });
        return nuevo;
      });
      setTimeout(() => setCarrito(getLocalCart()), 10);
      return;
    }
    try {
      await agregarAlCarritoAPI(producto.id, cantidad);
      await recargarCarrito();
      setAlertaGlobal({ tipo: "exito", mensaje: "Producto agregado al carrito." });
    } catch (e) {
      setError(e.message);
      setAlertaGlobal({ tipo: "error", mensaje: e.message });
    }
  }

  // Eliminar producto del carrito
  async function eliminarDelCarrito(productoId) {
    if (loading) return;
    const token = getToken();
    if (!token) {
      setCarrito((prev) => {
        const nuevo = prev.filter((p) => p.id !== productoId);
        setLocalCart(nuevo);
        setAlertaGlobal({ tipo: "info", mensaje: "Producto eliminado del carrito." });
        return nuevo;
      });
      return;
    }
    try {
      const item = carrito.find((p) => p.id === productoId);
      if (item && item.item_id) {
        await eliminarDelCarritoAPI(item.item_id);
        await recargarCarrito();
        setAlertaGlobal({ tipo: "info", mensaje: "Producto eliminado del carrito." });
      }
    } catch (e) {
      setError(e.message);
      setAlertaGlobal({ tipo: "error", mensaje: e.message });
    }
  }

  // Actualizar cantidad de un producto
  async function actualizarCantidad(productoId, cantidad) {
    if (loading) return;
    const token = getToken();
    if (!token) {
      setCarrito((prev) => {
        const idx = prev.findIndex((p) => p.id === productoId);
        if (idx < 0) return prev;
        const nuevo = [...prev];
        nuevo[idx].cantidad = cantidad;
        setLocalCart(nuevo);
        setAlertaGlobal({ tipo: "info", mensaje: "Cantidad actualizada." });
        return nuevo;
      });
      setTimeout(() => setCarrito(getLocalCart()), 10);
      return;
    }
    try {
      const item = carrito.find((p) => p.id === productoId);
      if (item && item.item_id) {
        await actualizarCantidadCarritoAPI(item.item_id, cantidad);
        await recargarCarrito();
        setAlertaGlobal({ tipo: "info", mensaje: "Cantidad actualizada." });
      }
    } catch (e) {
      setError(e.message);
      setAlertaGlobal({ tipo: "error", mensaje: e.message });
    }
  }

  // Vaciar carrito local
  async function vaciarCarrito() {
    const token = getToken();
    if (token) {
      try {
        await fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/") + "cart/clear/", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        setCarrito([]);
        setAlertaGlobal({ tipo: "info", mensaje: "Carrito vaciado." });
        setLocalCart([]);
        return;
      } catch (e) {
        setAlertaGlobal({ tipo: "error", mensaje: "No se pudo vaciar el carrito en el servidor." });
      }
    }
    setCarrito([]);
    setLocalCart([]);
    setAlertaGlobal({ tipo: "info", mensaje: "Carrito vaciado." });
  }

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        loading,
        error,
        alertaGlobal,
        setAlertaGlobal,
        recargarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
