const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Equipo = sequelize.define(
  "equipos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "equipos",
    timestamps: false,
  }
);

Equipo.associate = (models) => {
  Equipo.belongsToMany(models.solicitudes, {
    through: "solicitudes_equipos",
    foreignKey: "equipo_id",
    otherKey: "solicitud_id",
    as: "solicitudes",
  });
};

module.exports = { Equipo };
