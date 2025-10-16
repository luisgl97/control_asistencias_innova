const express = require("express");
const router = express.Router();
const {
    verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const SolicitudController = require("../controllers/solicitudController");

router.use(verificarToken); // Verifica token para todas las rutas

router.post("/",SolicitudController.crearSolicitud);
router.get("/",SolicitudController.obtenerTodasLasSolicitudes)
router.put("/",SolicitudController.actualizarSolicitudEquipos)
router.get("/equipos",SolicitudController.obtenerEquipos);
router.get("/trabajador",SolicitudController.obtenerSolicitudesPorTrabajador);
router.put("/estado-solicitud",SolicitudController.actualizarEstadoSolicitud)


module.exports = router;