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

router.get("/", obraController.obtenerObras);
router.get("/:id", obraController.obtenerObraId);
router.post("/",  autorizarRol(["GERENTE", "ADMINISTRADOR"]), obraController.registrarObra);
router.put("/:id",  autorizarRol(["GERENTE", "ADMINISTRADOR"]), obraController.actualizarObra)
router.patch(
  "/eliminar/:id",
   autorizarRol(["GERENTE", "ADMINISTRADOR"]),
  obraController.eliminarObra
);

module.exports = router;
