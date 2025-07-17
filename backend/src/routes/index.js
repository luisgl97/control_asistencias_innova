const express = require("express");
const router = express.Router();
const { verificarToken } = require("../shared/middlewares/authMiddleware");

const { registerModuleRoutes } = require("../../scripts/registerModuleRoutes");

// 👇 EXCEPCIÓN: login y verify-session deben estar ANTES del middleware
router.use("/auth", require("../modules/auth/interfaces/routes/authRoutes"));

// 📌 PROTEGER RUTAS DESPUÉS DEL LOGIN
if (process.env.NODE_ENV !== "development") {
    router.use(verificarToken);
}

// Cargar dinámicamente rutas de módulos con Clean Architecture
registerModuleRoutes(router, null); // Ya protegemos globamente con el middleware verificarToken

module.exports = router;