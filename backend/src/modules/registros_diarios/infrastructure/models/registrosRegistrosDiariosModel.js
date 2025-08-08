const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const RegistrosDiarios = sequelize.define(
  "registros_diarios",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    obra_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    descripcion_tarea: {
      type: DataTypes.STRING(255),
    },
    asignado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
  },
  {
    tableName: "registros_diarios",
    timestamps: true,
  }
);

// Asociaciones
RegistrosDiarios.associate = (models) => {
  RegistrosDiarios.belongsTo(models.usuarios, {
    foreignKey: "usuario_id",
    as: "usuario",
  });

  RegistrosDiarios.belongsTo(models.usuarios, {
    foreignKey: "asignado_por",
    as: "asignador",
  });

  RegistrosDiarios.belongsTo(models.obras, {
    foreignKey: "obra_id",
    as: "obra",
  });
};

module.exports = { RegistrosDiarios };

