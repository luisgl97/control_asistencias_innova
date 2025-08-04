const express = require("express");
const router = express.Router();
const asistenciaController = require("../controllers/asistenciaController");
const {
    verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const {
    autorizarRol,
} = require("../../../../shared/middlewares/rolMiddleware");


router.use(verificarToken); // Verifica token para todas las rutas


// 🔒 Ruta protegida, solo para usuarios con rol de gerente, administrador o gerente
router.get("/", autorizarRol(["GERENTE", "ADMINISTRADOR", "LIDER TRABAJADOR"]), asistenciaController.obtenerAsistencias);
//router.post("/usuario", autorizarRol(["GERENTE", "ADMINISTRADOR", "LIDER TRABAJADOR"]), asistenciaController.obtenerAsistenciasPorUsuario);
router.post("/reporte", autorizarRol(["GERENTE", "ADMINISTRADOR", "LIDER TRABAJADOR"]), asistenciaController.obtenerReporteAsistencias);
router.post("/del-dia",autorizarRol(["GERENTE", "ADMINISTRADOR", "LIDER TRABAJADOR"]), asistenciaController.obtenerAsistenciasDelDia);
router.post("/autorizar-horas-extras", autorizarRol(["GERENTE", "ADMINISTRADOR"]), asistenciaController.autorizarHorasExtras);
router.post("/mapa-ubicaciones", autorizarRol(["GERENTE", "ADMINISTRADOR", "LIDER TRABAJADOR"]), asistenciaController.obtenerMapaUbicaciones);

// 🔓 Ruta accesible para cualquier usuario autenticado
router.post("/usuario", asistenciaController.obtenerAsistenciasPorUsuario);
router.post("/registrar-ingreso", asistenciaController.registrarIngreso);
router.post("/registrar-salida", asistenciaController.registrarSalida);
router.post('/verificar-asistencia-del-dia', asistenciaController.verificarAsistenciaDelUsuarioDelDia);
router.post("/registrar-inicio-refrigerio", asistenciaController.registrarInicioRefrigerio)
router.post("/registrar-fin-refrigerio", asistenciaController.registrarFinRefrigerio)
router.post("/detalle", asistenciaController.obtenerDetalleAsistencia)

module.exports = router;
