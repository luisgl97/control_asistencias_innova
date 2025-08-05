const express = require("express");
const router = express.Router();
const registrosDiariosController = require("../controllers/registrosDiariosController");
const {
  verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const {
  autorizarRol,
} = require("../../../../shared/middlewares/rolMiddleware");

router.use(verificarToken); // Verifica token para todas las rutas


router.get("/",  autorizarRol(["GERENTE", "ADMINISTRADOR"]), registrosDiariosController.obtenerRegistrosDiarios);
router.post("/",  autorizarRol(["GERENTE", "ADMINISTRADOR"]), registrosDiariosController.insertarRegistrosDiarios);

module.exports = router;
