export function parseUbicacion(ubicacion) {
  if (!ubicacion) return null;
  if (typeof ubicacion === "string") {
    try {
      return JSON.parse(ubicacion);
    } catch (e) {
      console.warn("Error al parsear ubicación:", ubicacion);
      return null;
    }
  }
  return ubicacion; // ya es un objeto
}
