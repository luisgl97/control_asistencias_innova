const express = require("express");
const router = express.Router();
const filialController = require("../controllers/filialController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

router.use(verificarToken); // Verifica token para todas las rutas

// 🔓 Ruta accesible para cualquier filial autenticado (ej: listar filiales)
router.get("/", filialController.obtenerFiliales);

module.exports = router;