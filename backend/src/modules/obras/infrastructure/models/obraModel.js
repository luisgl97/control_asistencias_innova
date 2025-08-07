const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Obra = sequelize.define(
  "obras",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    latitud: {
      type: DataTypes.STRING(255),
    },
    longitud: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "obras",
    timestamps: true,
  }
);

// Asociaciones
Obra.associate = (models) => {
     Obra.hasMany(models.registros_diarios, {
    foreignKey: "obra_id",
    as: "registros_diarios",
  });
};

module.exports = { Obra };