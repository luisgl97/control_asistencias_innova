const express = require("express");
const router = express.Router();
const asistenciaController = require("../controllers/asistenciaController");
const {
    verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");


router.use(verificarToken); // Verifica token para todas las rutas

// 🔓 Ruta accesible para cualquier usuario autenticado (ej: listar usuarios)
router.get("/", asistenciaController.obtenerAsistencias);
router.get("/usuario/:id", asistenciaController.obtenerAsistenciasPorUsuario);
router.post("/registrar-ingreso", asistenciaController.registrarIngreso);
router.post("/registrar-salida", asistenciaController.registrarSalida);


module.exports = router;
