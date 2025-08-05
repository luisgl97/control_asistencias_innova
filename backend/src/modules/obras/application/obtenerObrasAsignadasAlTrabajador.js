module.exports = async (obraRepository) => {
    const obras = await obraRepository.obtenerObrasAsignadasAlTrabajador(); 
      
    return {
        codigo: 200,
        respuesta: {
            mensaje: obras.length == 0 ? "Obras no registradas" : "Obras encontrados",
            estado: true,
            total: obras.length,
            datos: obras,
        },
    };
} 