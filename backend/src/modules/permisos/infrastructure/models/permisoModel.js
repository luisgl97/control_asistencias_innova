const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Permiso = sequelize.define(
  "permisos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    asistencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "asistencias", // nombre de la tabla referenciada
        key: "id",
      },
    },
    autorizado_por: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios", // nombre de la tabla referenciada
        key: "id",
      },
    },
    observacion: {
      type: DataTypes.STRING(255),
      allowNull: true, // permite que sea nulo
    }
  },
  {
    tableName: "permisos",
    timestamps: true, // activa createdAt y updatedAt automáticamente
  }
);

// Asociaciones
Permiso.associate = (models) => {
  Permiso.belongsTo(models.asistencias, {
    foreignKey: "asistencia_id",
    as: "asistencia",
  });
  Permiso.belongsTo(models.usuarios, {
    foreignKey: "autorizado_por",
    as: "autorizado_por_usuario",
  });
};

module.exports = { Permiso };
