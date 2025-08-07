const express = require("express");
const router = express.Router();
const obraController = require("../controllers/obraController");
const {
  verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const {
  autorizarRol,
} = require("../../../../shared/middlewares/rolMiddleware");

router.use(verificarToken); // Verifica token para todas las rutas

router.get("/listar", obraController.obtenerObras);
router.get("/obtener-obra", obraController.obtenerObraId);
router.post("/", obraController.registrarObra);


module.exports = router;
