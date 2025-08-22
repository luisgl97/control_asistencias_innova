function parsearToJson(objeto) {
  if (!objeto) return null;
  if (typeof objeto === "string") {
    try {
      return JSON.parse(objeto);
    } catch (e) {
      console.warn("Error al parsear ubicación:", objeto);
      return null;
    }
  }
  return objeto; // ya es un objeto
}

module.exports = { parsearToJson };