const express = require("express");
const router = express.Router();
const DataPublicaController = require("../controllers/DataPublicaController");
const {
    validarApiKey,
} = require("../../../../shared/middlewares/validarApiKey");


router.post("/asistencias-por-fecha", validarApiKey, DataPublicaController.obtenerAsistenciasPorFecha);

module.exports = router;