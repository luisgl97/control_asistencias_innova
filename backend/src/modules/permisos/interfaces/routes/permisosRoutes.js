const express = require("express");
const router = express.Router();
const permisoController = require("../controllers/permisoController");
const {
    verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const {
    autorizarRol,
} = require("../../../../shared/middlewares/rolMiddleware");


router.use(verificarToken); // Verifica token para todas las rutas

router.get("/", permisoController.obtenerPermisos);
router.get("/usuario/:id", permisoController.obtenerPermisosPorUsuarioId);
router.post("/registrar-salida-anticipada", permisoController.registrarPermisoSalidaAnticipada);
router.post('/registrar-falta-justificada', permisoController.registrarPermisoFaltaJustificada);


module.exports = router;
