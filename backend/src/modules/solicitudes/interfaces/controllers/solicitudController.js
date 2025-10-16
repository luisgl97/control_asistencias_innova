const actualizarSolicitud = require("../../application/useCases/actualizarSolicitud");
const crearSolicitud = require("../../application/useCases/crearSolicitud");
const SequelizeSolicitudRepository = require("../../infraestructure/repositories/sequelizeSolicitudRepository");

const solicitudRepository=new SequelizeSolicitudRepository()

const SolicitudController={
    async crearSolicitud(req,res){
        try {
            // console.log("Entro ala función para crear solicitud");
            const data_usuario=req.usuario;
            const equipos_id=req.body.equipos;
            console.log("Equipos recibidos",equipos_id);
            const solicitud_response=await crearSolicitud(data_usuario.id,equipos_id,solicitudRepository);
            res.status(solicitud_response.codigo).json(solicitud_response.respuesta);
        } catch (error) {
            console.log("El error encontrado fue:",error);
            res.status(500)
        }
    },
    async obtenerSolicitudesPorTrabajador(req,res){
        try {
            const data_usuario=req.usuario;
            const solicitudes=await solicitudRepository.obtenerSolicitudesPorTrabajador(data_usuario.id)
            res.status(200).json({solicitudes})
        } catch (error) {
            
        }
    },
    async actualizarSolicitudEquipos(req,res){
        try {
            const payload=req.body;
            const responseSolicitud=await actualizarSolicitud(payload,solicitudRepository);
            res.status(responseSolicitud.codigo).json(responseSolicitud.respuesta);
        } catch (error) {
            console.log("Error al actualizar lios equipos",error);
            res.status(500).json({error:error.message})
        }
    },
    async obtenerEquipos(req,res){
        try {
            const responseEquipos=await solicitudRepository.obtenerEquipos();
            res.status(202).json({equipos:responseEquipos})
        } catch (error) {
            res.status(500).json({error:error.message})
        }
    },
    async obtenerTodasLasSolicitudes(req,res){
        try {
            const responseSolicitudes=await solicitudRepository.obtenerTodasLasSolicitudes();
            res.status(202).json({solicitudes:responseSolicitudes})
        } catch (error) {
            console.log("Error obtenido: ",error);
            res.status(500).json({error:error.message})
        }
    },
    async actualizarEstadoSolicitud(req,res){
        console.log("Se entro ala funcio de a");
        
        try {
        const solicitud_id=req.body.solicitud_id;
        const data_usuario=req.usuario;

        if(!solicitud_id)throw new Error("Solicitud no enviada");
        await solicitudRepository.actualizarEstadoSolicitud(solicitud_id,data_usuario.id)
        res.status(202).json({mensaje:"Estado de solicitud actualziada correctamente"})
        } catch (error) {
            console.log(error);
            
        }
    }
}


module.exports=SolicitudController