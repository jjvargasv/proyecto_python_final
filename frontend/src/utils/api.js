// Utilidad para peticiones a la API REST del backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

// Devuelve los headers de autenticación si existe un token
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Obtiene productos destacados
export async function fetchFeaturedProducts() {
    const res = await fetch(`${API_URL}products/?featured=true`);
    if (!res.ok) throw new Error('Error al obtener productos destacados');
    return await res.json();
}

// Obtiene productos de una categoría específica
export async function fetchProductosPorCategoria(categoryId) {
    const res = await fetch(`${API_URL}products/?category=${categoryId}`);
    if (!res.ok) throw new Error('Error al obtener productos de la categoría');
    return await res.json();
}

// Obtiene todos los productos
export async function fetchProductos() {
    const res = await fetch(`${API_URL}products/`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return await res.json();
}

// Obtiene todas las categorías (prueba ambos endpoints para compatibilidad)
export async function fetchCategorias() {
    // Intenta primero /categories/, luego /categorias/ para máxima compatibilidad
    let res = await fetch(`${API_URL}categories/`);
    if (res.status === 404) {
        res = await fetch(`${API_URL}categorias/`);
    }
    if (!res.ok) throw new Error("Error al obtener categorías");
    return await res.json();
}

// --- Carrito ---
// Obtiene el carrito de compras del usuario autenticado
export async function fetchCarrito() {
  const res = await fetch(`${API_URL}cart/`, {
    headers: { ...getAuthHeaders() }
  });
  if (res.status === 401) throw new Error('Debes iniciar sesión para ver tu carrito');
  if (!res.ok) throw new Error('Error al obtener el carrito');
  return await res.json();
}

// Agrega un producto al carrito
export async function agregarAlCarritoAPI(product_id, quantity = 1) {
  const res = await fetch(`${API_URL}cart/items/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ product_id, quantity })
  });
  if (res.status === 401) throw new Error('Debes iniciar sesión para agregar al carrito');
  if (!res.ok) throw new Error('Error al agregar al carrito');
  return await res.json();
}

// Actualiza la cantidad de un producto en el carrito
export async function actualizarCantidadCarritoAPI(item_id, quantity) {
  const res = await fetch(`${API_URL}cart/items/${item_id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ quantity })
  });
  if (res.status === 401) throw new Error('Debes iniciar sesión para modificar el carrito');
  if (!res.ok) throw new Error('Error al actualizar la cantidad');
  return await res.json();
}

// Elimina un producto del carrito
export async function eliminarDelCarritoAPI(item_id) {
  const res = await fetch(`${API_URL}cart/items/${item_id}/`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
  if (res.status === 401) throw new Error('Debes iniciar sesión para modificar el carrito');
  if (!res.ok) throw new Error('Error al eliminar del carrito');
  return true;
}

// Obtiene el detalle de un producto por ID
export async function fetchProductoDetalle(id) {
  const res = await fetch(`${API_URL}products/${id}/`);
  if (!res.ok) throw new Error('Error al obtener detalle del producto');
  return await res.json();
}
