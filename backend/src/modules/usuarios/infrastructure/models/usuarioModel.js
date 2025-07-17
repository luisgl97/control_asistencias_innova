const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Usuario = sequelize.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    nombres: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    rol: {
      type: DataTypes.ENUM("ADMINISTRADOR", "TRABAJADOR"),
      allowNull: false,
    },
    cargo: {
      type: DataTypes.ENUM("MONTADOR", "ALMACEN"),
      allowNull: true,
    },
    filial_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "filiales", // nombre de tabla, no del modelo
        key: "id",
      },
    },
  },
  {
    tableName: "usuarios",
    timestamps: true, // Sequelize maneja createdAt y updatedAt automáticamente
  }
);

// Asociaciones
Usuario.associate = (models) => {
  Usuario.belongsTo(models.filiales, {
    foreignKey: "filial_id",
    as: "filial",
  });

  Usuario.hasMany(models.asistencias, {
    foreignKey: "usuario_id",
    as: "asistencias",
  });
};

module.exports = { Usuario };