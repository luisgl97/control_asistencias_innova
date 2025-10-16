const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Solicitud = sequelize.define(
  "solicitudes",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fecha_entrega: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("entregado", "solicitado"),
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    atendido_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    tableName: "solicitudes",
    timestamps: false,
  }
);

Solicitud.associate = (models) => {
  Solicitud.belongsTo(models.usuarios, {
    foreignKey: "usuario_id",
    as: "usuario_solicitante",
  });

  Solicitud.belongsTo(models.usuarios, {
    foreignKey: "atendido_por",
    as: "usuario_atendio",
  });

  Solicitud.belongsToMany(models.equipos, {
    through: "solicitudes_equipos",
    foreignKey: "solicitud_id",
    otherKey: "equipo_id",
    as: "equipos",
  });
};

module.exports = { Solicitud };
