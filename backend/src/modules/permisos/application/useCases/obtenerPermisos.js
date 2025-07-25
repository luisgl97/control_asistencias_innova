module.exports = async (permisoRepository) => {
   
    const permisos = await permisoRepository.obtenerPermisos();

    return {
        codigo: 200,
        respuesta: {
            mensaje: permisos.length==0 ? "Permisos no registradas" :"Permisos encontrados",
            estado: true,
            total: permisos.length,
            datos: permisos,
        },
    };
};
