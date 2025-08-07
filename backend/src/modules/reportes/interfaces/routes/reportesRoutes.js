const express = require("express");
const router = express.Router();
const ReporteController = require("../controllers/ReporteController");

router.post("/guardar-reporte-individual", ReporteController.guardarReporteIndividual);
router.get("/verificar-reporte", ReporteController.verificarReporteEmitido);

module.exports = router;