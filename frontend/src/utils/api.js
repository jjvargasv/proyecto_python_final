// Utilidad para peticiones a la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

export async function fetchFeaturedProducts() {
    const res = await fetch(`${API_URL}products/?featured=true`);
    if (!res.ok) throw new Error('Error al obtener productos destacados');
    return await res.json();
}

export async function fetchProductosPorCategoria(categoryId) {
    const res = await fetch(`${API_URL}products/?category=${categoryId}`);
    if (!res.ok) throw new Error('Error al obtener productos de la categoría');
    return await res.json();
}

export async function fetchCategorias() {
    let res = await fetch(`${API_URL}categorias/`);
    if (res.status === 404) {
        res = await fetch(`${API_URL}categories/`);
    }
    if (!res.ok) throw new Error("Error al obtener categorías");
    return await res.json();
}
