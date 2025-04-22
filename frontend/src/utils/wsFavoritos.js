// WebSocket para sincronizar favoritos del usuario en tiempo real entre pestañas o dispositivos
let ws;
const listeners = [];

// Conecta al WebSocket de favoritos con el token de autenticación
export function connectFavoritosWS(token) {
  if (ws) ws.close(); // Cierra conexión previa si existe
  ws = new window.WebSocket(`ws://localhost:8000/ws/favoritos/?token=${token}`);
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      listeners.forEach(cb => cb(data)); // Notifica a todos los listeners registrados
    } catch {}
  };
}

// Registra un callback para recibir actualizaciones de favoritos en tiempo real
export function onFavoritosUpdate(cb) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

// Cierra la conexión WebSocket de favoritos
export function closeFavoritosWS() {
  if (ws) ws.close();
  ws = null;
}
