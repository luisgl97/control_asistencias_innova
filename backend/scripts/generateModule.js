const fs = require("fs");
const path = require("path");

const moduleName = process.argv[2];
if (!moduleName) {
  console.error("❌ Debes indicar el nombre del módulo. Ej: node generateModule.js valorizaciones");
  process.exit(1);
}

const singular = moduleName.endsWith("es") ? moduleName.slice(0, -2) : moduleName.slice(0, -1);
const Pascal = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const Module = Pascal(moduleName);
const Entity = Pascal(singular);

const base = path.join(__dirname, "..", "src", "modules", moduleName);

const files = [
  {
    path: `application/useCases/crear${Module}.js`,
    content: `module.exports = async (data, repository) => {\n  return await repository.crear(data);\n};`,
  },
  {
    path: `application/useCases/obtener${Module}.js`,
    content: `module.exports = async (repository) => {\n  return await repository.obtenerTodos();\n};`,
  },
  {
    path: `domain/entities/${Entity}.js`,
    content:
`class ${Entity} {
  constructor({ id, ...props }) {
    this.id = id;
    Object.assign(this, props);
  }
}
module.exports = ${Entity};`
  },
  {
    path: `domain/repositories/${Module}Repository.js`,
    content:
`class ${Module}Repository {
  crear(data) { throw new Error("Método no implementado."); }
  obtenerTodos() { throw new Error("Método no implementado."); }
}
module.exports = ${Module}Repository;`
  },
  {
    path: `infrastructure/models/${Entity}Model.js`,
    content:
`const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return sequelize.define("${moduleName}", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // TODO: Define tus campos
  }, { tableName: "${moduleName}", timestamps: false });
};`
  },
  {
    path: `infrastructure/repositories/Sequelize${Module}Repository.js`,
    content:
`class Sequelize${Module}Repository {
  constructor(modelo) {
    this.modelo = modelo;
  }

  async crear(data) {
    return await this.modelo.create(data);
  }

  async obtenerTodos() {
    return await this.modelo.findAll();
  }
}
module.exports = Sequelize${Module}Repository;`
  },
  {
    path: `interfaces/controllers/${Module}Controller.js`,
    content:
`const crear = require("../../application/useCases/crear${Module}");
const obtener = require("../../application/useCases/obtener${Module}");

module.exports = (repositorio) => ({
  crear: async (req, res) => {
    const respuesta = await crear(req.body, repositorio);
    res.status(201).json(respuesta);
  },
  obtener: async (_req, res) => {
    const respuesta = await obtener(repositorio);
    res.status(200).json(respuesta);
  }
});`
  },
  {
    path: `interfaces/routes/${moduleName}Routes.js`,
    content:
`const express = require("express");
const router = express.Router();
const controladorFactory = require("../controllers/${Module}Controller");

module.exports = (repositorio) => {
  const ctrl = controladorFactory(repositorio);
  router.post("/", ctrl.crear);
  router.get("/", ctrl.obtener);
  return router;
};`
  },
  {
    path: `tests/crear${Module}.test.js`,
    content:
`const crear = require("../application/useCases/crear${Module}");

describe("Caso de uso: Crear ${Module}", () => {
  it("debe ejecutar sin errores con datos válidos", async () => {
    const mockRepo = { crear: jest.fn().mockResolvedValue({ id: 1 }) };
    const resultado = await crear({ nombre: "Demo" }, mockRepo);
    expect(resultado).toHaveProperty("id");
  });
});`
  }
];

files.forEach(({ path: filePath, content }) => {
  const fullPath = path.join(base, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`✅ ${filePath}`);
  } else {
    console.log(`⚠️  Ya existe: ${filePath}`);
  }
});

console.log(`\n🚀 Módulo "${moduleName}" generado correctamente con estructura Clean Architecture.`);