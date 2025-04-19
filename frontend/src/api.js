// API utilidades para conexión con el backend Django
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/";

export async function fetchProductos() {
  // Soporta ambos: /productos/ y /products/
  let res = await fetch(`${API_URL}products/`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
}

export async function fetchCategorias() {
  // Soporta ambos: /categorias/ y /categories/
  let res = await fetch(`${API_URL}categories/`);
  if (!res.ok) throw new Error("Error al obtener categorías");
  return await res.json();
}

// --- API de Carrito ---

// Obtener carrito actual del usuario autenticado
export async function fetchCarrito(token) {
  const res = await fetch(`${API_URL}cart/`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener el carrito');
  return await res.json();
}

// Agregar producto al carrito
export async function addToCarrito(product_id, quantity = 1, token) {
  const res = await fetch(`${API_URL}cart/items/`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ product_id, quantity })
  });
  if (!res.ok) throw new Error('Error al agregar al carrito');
  return await res.json();
}

// Eliminar producto del carrito
export async function removeFromCarrito(item_id, token) {
  const res = await fetch(`${API_URL}cart/items/${item_id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al eliminar del carrito');
}

// Actualizar cantidad de un producto en el carrito
export async function updateCarritoItem(item_id, quantity, token) {
  const res = await fetch(`${API_URL}cart/items/${item_id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ quantity })
  });
  if (!res.ok) throw new Error('Error al actualizar cantidad');
  return await res.json();
}
