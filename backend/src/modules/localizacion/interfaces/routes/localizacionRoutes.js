// interfaces/http/routes/localizacion.js
const express = require("express");
const router = express.Router();
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");
const LocalizacionController = require("../controller/localizacionController");

router.use(verificarToken);
router.post("/", LocalizacionController.obtenerLatLong);

module.exports = router;
