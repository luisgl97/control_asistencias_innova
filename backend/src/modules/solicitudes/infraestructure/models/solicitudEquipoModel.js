const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const SolicitudEquipo = sequelize.define(
  "solicitudes_equipos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    solicitud_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "solicitudes",
        key: "id",
      },
    },
    equipo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "equipos",
        key: "id",
      },
    },
  },
  {
    tableName: "solicitudes_equipos",
    timestamps: false,
  }
);

SolicitudEquipo.associate = (models) => {
  SolicitudEquipo.belongsTo(models.solicitudes, {
    foreignKey: "solicitud_id",
    as: "solicitud",
  });
  SolicitudEquipo.belongsTo(models.equipos, {
    foreignKey: "equipo_id",
    as: "equipo",
  });
};

module.exports = { SolicitudEquipo };
