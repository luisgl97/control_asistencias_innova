const { formatearRegistros } = require("../infrastructure/services/formatearRegistrosDiariosPorFecha");

module.exports = async (obra_id, fecha, registrosDiariosRepository) => {

    const registroDiarioPorObraYFecha = await registrosDiariosRepository.obtenerRegistrosDiarioPorObraYFecha(obra_id, fecha);
  
    if(registroDiarioPorObraYFecha.length == 0){
        return {
            codigo: 404,
            respuesta: {
             estado: false,
            mensaje: "No hay registros diarios por obra y fecha"
            }
        }
    }

    const registros = registroDiarioPorObraYFecha.length > 0 ? formatearRegistros(registroDiarioPorObraYFecha) : []
    
    return {
        codigo: 200,
        respuesta: {
            mensaje: "Registros diarios encontrados",
            estado: true,
            datos: registros[0],
        },
    };
} 