const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verificarToken } = require("../../../../shared/middlewares/authMiddleware");

// Login (Público)
router.post("/login", authController.login);

// Verificar sesión (protegido con token)
router.get("/verify-session", verificarToken, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;