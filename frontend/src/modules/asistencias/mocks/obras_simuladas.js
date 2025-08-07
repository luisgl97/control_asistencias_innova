const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const obtenerUbicacionesSimuladas = async () => {
  await delay(2000);

  return [
    // Cercanas (< 50 metros)
    {
      latitude: -13.04320590899206,  
      longitude: -76.42444751662715,
      nombre_obra: "Obra cercana 1",
    },

  ];
};

