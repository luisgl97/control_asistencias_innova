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
    observacion_ingreso: {
      type: DataTypes.STRING(255),
    },
    observacion_salida: {
      type: DataTypes.STRING(255),
    },

    // ✅ Nuevos campos
  /* estado_ingreso: {
    type: DataTypes.ENUM('A TIEMPO', 'TARDE', 'SIN MARCAR'),
    defaultValue: 'SIN MARCAR',
  },
  estado_salida: {
    type: DataTypes.ENUM('A TIEMPO', 'ANTICIPADO', 'SIN MARCAR'),
    defaultValue: 'SIN MARCAR',
  }, */
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
};

module.exports = { Asistencia };
