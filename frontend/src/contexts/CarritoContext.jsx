import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchCarrito, addToCarrito, removeFromCarrito, updateCarritoItem } from "../api";

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

  // Obtén el token JWT (ajusta según tu sistema de login)
  function getToken() {
    return localStorage.getItem("token");
  }

  // Cargar carrito al iniciar (backend si logueado, localStorage si no)
  useEffect(() => {
    const token = getToken();
    if (!token) {
      const local = getLocalCart();
      setCarrito(local);
      setLoading(false);
      return;
    }
    fetchCarrito(token)
      .then((data) => {
        setCarrito(
          (data.items || []).map((item) => ({
            id: item.product.id,
            nombre: item.product.nombre || item.product.name,
            descripcion: item.product.descripcion || item.product.description,
            precio: item.product.precio || item.product.price,
            imagen: item.product.image_url || item.product.imagen || item.product.image,
            cantidad: item.quantity,
            item_id: item.id,
          }))
        );
        setLoading(false);
      })
      .catch((e) => {
        if (e.message.includes('401')) {
          setAlertaGlobal({ tipo: 'info', mensaje: 'Sesión no iniciada. Usando carrito local.' });
          setCarrito(getLocalCart());
          setLoading(false);
        } else {
          setError(e.message);
          setLoading(false);
        }
      });
  }, []);

  // --- FUSIÓN AUTOMÁTICA DEL CARRITO LOCAL AL LOGIN ---
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const local = getLocalCart();
    if (local.length === 0) return;
    setLoading(true);
    Promise.all(
      local.map((prod) => addToCarrito(prod.id, prod.cantidad, token))
    )
      .then(async () => {
        localStorage.removeItem("carrito");
        await recargarCarrito();
        setAlertaGlobal({ tipo: 'info', mensaje: 'Carrito de invitado fusionado con tu cuenta.' });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [localStorage.getItem("token")]);

  // Refrescar carrito automáticamente cuando cambia el token (login/logout)
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setCarrito(getLocalCart());
      setAlertaGlobal({ tipo: 'info', mensaje: 'Sesión cerrada. Usando carrito local.' });
      return;
    }
    recargarCarrito();
    // eslint-disable-next-line
  }, [localStorage.getItem("token")]);

  // Forzar recarga del carrito al agregar/quitar (sin refrescar página)
  async function recargarCarrito() {
    const token = getToken();
    if (!token) {
      setCarrito(getLocalCart());
      return;
    }
    try {
      const data = await fetchCarrito(token);
      setCarrito(
        (data.items || []).map((item) => ({
          id: item.product.id,
          nombre: item.product.nombre || item.product.name,
          descripcion: item.product.descripcion || item.product.description,
          precio: item.product.precio || item.product.price,
          imagen: item.product.image_url || item.product.imagen || item.product.image,
          cantidad: item.quantity,
          item_id: item.id,
        }))
      );
    } catch (e) {
      if (e.message.includes('401')) {
        setAlertaGlobal({ tipo: 'info', mensaje: 'Sesión no iniciada. Usando carrito local.' });
        setCarrito(getLocalCart());
      } else {
        setError(e.message);
      }
    }
  }

  // Agregar producto al carrito (local si no logueado, backend si logueado)
  async function agregarAlCarrito(producto, cantidad = 1) {
    if (loading) return; // Evita acción si está cargando
    const token = getToken();
    if (!token) {
      setCarrito((prev) => {
        const idx = prev.findIndex((p) => p.id === producto.id);
        // Asegura que la imagen absoluta siempre se guarde en el carrito local
        const imagen = producto.image_url || producto.imagen || producto.image || "";
        let nuevo;
        if (idx >= 0) {
          nuevo = [...prev];
          nuevo[idx].cantidad += cantidad;
          // Mantén la imagen absoluta si ya existe, o actualízala si está vacía
          nuevo[idx].imagen = nuevo[idx].imagen || imagen;
        } else {
          nuevo = [...prev, { ...producto, cantidad, imagen }];
        }
        setLocalCart(nuevo);
        setAlertaGlobal({ tipo: "exito", mensaje: "Producto agregado al carrito." });
        return nuevo;
      });
      setTimeout(() => setCarrito(getLocalCart()), 10);
      return;
    }
    try {
      await addToCarrito(producto.id, cantidad, token);
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
      await removeFromCarrito(carrito.find((p) => p.id === productoId)?.item_id, token);
      await recargarCarrito();
      setAlertaGlobal({ tipo: "info", mensaje: "Producto eliminado del carrito." });
    } catch (e) {
      setError(e.message);
      setAlertaGlobal({ tipo: "error", mensaje: e.message });
    }
  }

  // Vaciar carrito
  async function vaciarCarrito() {
    if (loading) return;
    const token = getToken();
    if (!token) {
      setCarrito([]);
      setLocalCart([]);
      setAlertaGlobal({ tipo: "info", mensaje: "Carrito vaciado." });
      return;
    }
    try {
      await Promise.all(carrito.map((prod) => removeFromCarrito(prod.item_id, token)));
      await recargarCarrito();
      setAlertaGlobal({ tipo: "info", mensaje: "Carrito vaciado." });
    } catch (e) {
      setError(e.message);
      setAlertaGlobal({ tipo: "error", mensaje: e.message });
    }
  }

  // Actualizar cantidad de un producto (opcional)
  async function actualizarCantidad(productoId, cantidad) {
    if (loading) return;
    const token = getToken();
    if (!token) {
      setCarrito((prev) => {
        const idx = prev.findIndex((p) => p.id === productoId);
        if (idx < 0) return prev;
        const nuevo = [...prev];
        nuevo[idx].cantidad = cantidad;
        // Mantén la imagen absoluta si ya existe
        if (!nuevo[idx].imagen) {
          nuevo[idx].imagen = prev[idx].imagen;
        }
        setLocalCart(nuevo);
        setAlertaGlobal({ tipo: "info", mensaje: "Cantidad actualizada." });
        return nuevo;
      });
      setTimeout(() => setCarrito(getLocalCart()), 10);
      return;
    }
    try {
      await updateCarritoItem(carrito.find((p) => p.id === productoId)?.item_id, cantidad, token);
      await recargarCarrito();
      setAlertaGlobal({ tipo: "info", mensaje: "Cantidad actualizada." });
    } catch (e) {
      setError(e.message);
      setAlertaGlobal({ tipo: "error", mensaje: e.message });
    }
  }

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, actualizarCantidad, loading, error, alertaGlobal, setAlertaGlobal }}>
      {children}
    </CarritoContext.Provider>
  );
}
