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
router.post("/por-fecha",  autorizarRol(["GERENTE", "ADMINISTRADOR"]), registrosDiariosController.obtenerRegistrosDiariosPorFecha);
router.post("/por-obra",  autorizarRol(["GERENTE", "ADMINISTRADOR"]), registrosDiariosController.obtenerRegistroDiarioPorObraYFecha);
router.put("/", autorizarRol(["GERENTE", "ADMINISTRADOR"]), registrosDiariosController.actualizarRegistrosDiarios)

module.exports = router;
