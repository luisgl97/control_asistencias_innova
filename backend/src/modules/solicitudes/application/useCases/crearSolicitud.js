module.exports =async (usuario_id,equipos_id=[],solicitudRepository,transaction=null) =>{
    const payload={
        fecha:new Date().toISOString().split("T")[0],
        estado:"solicitado",
        usuario_id:usuario_id
    }

    const solicitud_creada=await solicitudRepository.crearSolicitud(payload,transaction)
    for (const e of equipos_id) {
        const payload={
            solicitud_id:solicitud_creada.id,
            equipo_id:e
        }
        await solicitudRepository.crearSolicitudEquipo(payload)
    };

    return{
        codigo:200,
        respuesta:{
            mensaje:"Solicitud de equipos creada exitosamente."
        }
    }

}