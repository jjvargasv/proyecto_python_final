// Utilidades para consumir la API de favoritos del usuario
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/";

// Devuelve los headers de autenticación si existe un token
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Realiza una petición fetch con manejo de autenticación y errores comunes
async function tryFetch(url, options = {}) {
  const headers = { ...getAuthHeaders(), ...options.headers };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 404) throw new Error('404'); // Para fallback de endpoint
  if (res.status === 401) throw new Error('Debes iniciar sesión para ver tus favoritos');
  if (!res.ok) throw new Error("Error en la petición de favoritos");
  if (res.status === 204 || options.method === "DELETE") return true;
  return await res.json();
}

// Obtiene la lista de favoritos del usuario autenticado
export async function fetchFavoritos() {
  if (!localStorage.getItem("token")) throw new Error("No autenticado");
  try {
    return await tryFetch(`${API_URL}favoritos/`);
  } catch (e) {
    if (e.message === '404') {
      try {
        return await tryFetch(`${API_URL}favorites/`);
      } catch (e2) {
        if (e2.message === '404') {
          // Ambos endpoints no existen: retorna array vacío para GET
          return [];
        }
        throw e2;
      }
    }
    throw e;
  }
}

// Agrega un producto a favoritos
export async function agregarFavorito(producto_id) {
  if (!localStorage.getItem("token")) throw new Error("No autenticado");
  return await tryFetch(`${API_URL}favoritos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ producto_id })
  });
}

// Elimina un favorito por ID (prueba ambos endpoints para compatibilidad)
export async function eliminarFavorito(favorito_id) {
  if (!localStorage.getItem("token")) throw new Error("No autenticado");
  // Intenta ambos endpoints para máxima compatibilidad
  try {
    return await tryFetch(`${API_URL}favoritos/${favorito_id}/`, {
      method: "DELETE"
    });
  } catch (e) {
    if (e.message === '404') {
      return await tryFetch(`${API_URL}favorites/${favorito_id}/`, {
        method: "DELETE"
      });
    }
    throw e;
  }
}
