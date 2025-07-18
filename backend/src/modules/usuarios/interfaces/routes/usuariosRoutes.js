const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const {
    verificarToken,
} = require("../../../../shared/middlewares/authMiddleware");
const {
    autorizarRol,
} = require("../../../../shared/middlewares/rolMiddleware");

router.use(verificarToken); // Verifica token para todas las rutas

// 🔓 Ruta accesible para cualquier usuario autenticado (ej: listar usuarios)
router.get("/", usuarioController.obtenerUsuarios);
router.get("/:id", usuarioController.obtenerUsuarioPorId);

// 🔐 Solo GERENTE y ADMINISTRADOR pueden hacer modificaciones
router.post(
    "/",
    autorizarRol(["GERENTE", "ADMINISTRADOR"]),
    usuarioController.crearUsuario
);
router.put(
    "/:id",
    autorizarRol(["GERENTE", "ADMINISTRADOR"]),
    usuarioController.actualizarUsuario
);
router.patch(
    "/desactivar/:id",
    autorizarRol(["GERENTE", "ADMINISTRADOR"]),
    usuarioController.eliminarUsuario
);
router.patch(
    "/activar/:id",
    autorizarRol(["GERENTE", "ADMINISTRADOR"]),
    usuarioController.activarUsuario
);

module.exports = router;
