const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const Asistencia = sequelize.define(
  "asistencias",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios", // nombre de la tabla referenciada
        key: "id",
      },
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora_ingreso: {
      type: DataTypes.TIME,
    },
    hora_salida: {
      type: DataTypes.TIME,
    },
    ubicacion_ingreso: {
      type: DataTypes.JSON,
    },
    ubicacion_salida: {
      type: DataTypes.JSON,
    },
    horas_extras: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
      hizo_horas_extras: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
    estado: {
      type: DataTypes.ENUM("PRESENTE", "FALTA JUSTIFICADA", "TARDANZA", "SALIDA ANTICIPADA", "ASISTIO", "ASISTIO TARDE", "TARDANZA JUSTIFICADA"),
      defaultValue: "PRESENTE",
    },
    hora_inicio_refrigerio: {
      type: DataTypes.TIME,
    },
    hora_fin_refrigerio: {
      type: DataTypes.TIME,
    },
  },
  {
    tableName: "asistencias",
    timestamps: true, // activa createdAt y updatedAt automáticamente
  }
);

// Asociaciones
Asistencia.associate = (models) => {
  Asistencia.belongsTo(models.usuarios, {
    foreignKey: "usuario_id",
    as: "usuario",
  });

  Asistencia.hasOne(models.permisos, {
  foreignKey: "asistencia_id",
  as: "permiso",
});
};

module.exports = { Asistencia };
