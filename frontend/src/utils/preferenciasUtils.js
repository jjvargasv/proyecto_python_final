// Utilidad para guardar, convertir y obtener preferencias del usuario en el sistema

// Convierte el string de preferencias a objeto, o retorna valores por defecto
export function parsePreferencias(preferencias) {
  if (!preferencias) return { categorias: [], notificaciones: [], novedades: false };
  if (typeof preferencias === "string") {
    try {
      return JSON.parse(preferencias);
    } catch {
      return { categorias: [], notificaciones: [], novedades: false };
    }
  }
  return preferencias;
}

// Convierte el objeto de preferencias a string JSON
export function stringifyPreferencias(preferencias) {
  try {
    return JSON.stringify(preferencias);
  } catch {
    return "{}";
  }
}
