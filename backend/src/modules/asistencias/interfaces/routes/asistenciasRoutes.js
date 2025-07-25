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

// 🔓 Ruta accesible para cualquier usuario autenticado (ej: listar usuarios)
router.get("/", asistenciaController.obtenerAsistencias);

// 🔒 Ruta protegida, solo para usuarios con rol de administrador o gerente
router.get("/usuario/:id", autorizarRol(["GERENTE", "ADMINISTRADOR"]), asistenciaController.obtenerAsistenciasPorUsuario);
router.post("/reporte", autorizarRol(["GERENTE", "ADMINISTRADOR", "LIDER TRABAJADOR"]), asistenciaController.obtenerReporteAsistencias);
router.post("/del-dia",autorizarRol(["GERENTE", "ADMINISTRADOR"]), asistenciaController.obtenerAsistenciasDelDia);

// 🔓 Ruta accesible para cualquier usuario autenticado
router.post("/registrar-ingreso", asistenciaController.registrarIngreso);
router.post("/registrar-salida", asistenciaController.registrarSalida);
router.post('/verificar-asistencia-del-dia', asistenciaController.verificarAsistenciaDelUsuarioDelDia);

module.exports = router;
