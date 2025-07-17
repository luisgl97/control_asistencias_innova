// backend/scripts/registerModuleRoutes.js
const fs = require("fs");
const path = require("path");

function registerModuleRoutes(router, verificarTokenMiddleware) {
  const modulesPath = path.join(__dirname, "../src/modules");

  if (!fs.existsSync(modulesPath)) {
    console.error("🚨 No se encontró la carpeta de módulos.");
    return;
  }

  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  modules.forEach((mod) => {
    const routeFileName = `${mod}Routes.js`;
    const routePath = path.join(modulesPath, mod, "interfaces", "routes", routeFileName);

    if (fs.existsSync(routePath)) {
      const route = require(routePath);

      // Aplica middleware si se pasa
      if (verificarTokenMiddleware) {
        router.use(`/${mod}`, verificarTokenMiddleware, route);
      } else {
        router.use(`/${mod}`, route);
      }

      console.log(`📦 Ruta dinámica cargada: /${mod}`);
    } else {
      console.warn(`⚠️ Ruta no encontrada para módulo: ${mod} (${routePath})`);
    }
  });
}

module.exports = { registerModuleRoutes };