const express = require("express");
const router = express.Router();
const ReporteController = require("../controllers/ReporteController");
const {
    verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const {
    autorizarRol,
} = require("../../../../shared/middlewares/rolMiddleware");

router.use(verificarToken); // Verifica token para todas las rutas

router.post("/guardar-reporte-individual", autorizarRol(["GERENTE", "ADMINISTRADOR"]), ReporteController.guardarReporteIndividual);
router.get("/verificar-reporte", autorizarRol(["GERENTE", "ADMINISTRADOR"]), ReporteController.verificarReporteEmitido);

module.exports = router;