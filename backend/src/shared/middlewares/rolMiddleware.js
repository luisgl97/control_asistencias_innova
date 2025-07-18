// Permite continuar solo si el usuario tiene uno de los roles permitidos
function autorizarRol(rolesPermitidos) {
 
  return (req, res, next) => {
    const rolUsuario = req.usuario?.rol;

    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ message: "Acceso denegado. Rol no autorizado." });
    }
    next();
  };
}

module.exports = { autorizarRol };