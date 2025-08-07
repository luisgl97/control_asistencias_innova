const { obtenerSiguienteDiaLaboral } = require("../../infrastructure/utils/sumarDiaLaboral");

module.exports = async (idUsuario, dataAsistencia, asistenciaRepository, registrosDiariosRepository) => {

    const { fecha } = dataAsistencia;
   
    const { ingreso, salida, asistencia_id, falta_justificada,hora_inicio_refrigerio, hora_fin_refrigerio, mensaje} = await  asistenciaRepository.verificarAsistenciaDelUsuarioDelDia(idUsuario, fecha);

    const obrasAsignadasAlTrabajadorPorDia = await registrosDiariosRepository.obtenerObrasAsignadasAlTrabajadorPorDia(idUsuario, fecha)
  
    const siguienteFechaLaboral = obtenerSiguienteDiaLaboral(fecha); // Feriado

   const obrasAsignadasAlTrabajadorDeManiana = await registrosDiariosRepository.obtenerObrasAsignadasAlTrabajadorPorDia(idUsuario, siguienteFechaLaboral)

    const obrasAsignadasDelDia = obrasAsignadasAlTrabajadorPorDia?.map(obraDelDia => (({
        id: obraDelDia.obra.id,
        nombre: obraDelDia.obra.nombre,
        direccion: obraDelDia.obra.direccion,
        latitud: obraDelDia.obra.latitud,
        longitud: obraDelDia.obra.longitud,
        descripcion_tarea: obraDelDia.descripcion_tarea,
        fecha: obraDelDia.fecha
    })))

    const obrasAsignadasDeManiana = obrasAsignadasAlTrabajadorDeManiana?.map(obraDeManiana => (({
        id: obraDeManiana.obra.id,
        nombre: obraDeManiana.obra.nombre,
        direccion: obraDeManiana.obra.direccion,
        latitud: obraDeManiana.obra.latitud,
        longitud: obraDeManiana.obra.longitud,
        descripcion_tarea: obraDeManiana.descripcion_tarea,
        fecha: obraDeManiana.fecha
    })))

     return {
        codigo: 200,
        respuesta: {
            mensaje: mensaje,
            estado: true,
            datos: {
                ingreso,
                salida,
                asistencia_id,
                falta_justificada,
                hora_inicio_refrigerio,
                hora_fin_refrigerio,
                obras_asignadas_del_dia: obrasAsignadasDelDia,
                obras_asignadas_de_maniana: obrasAsignadasDeManiana
            },
        },
    };
};
