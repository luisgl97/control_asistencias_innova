const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db");

const ReporteEmitidoModel = sequelize.define("reporte_asistencia_emitidos", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  usuario_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  mes: { 
    type: DataTypes.STRING(7), 
    allowNull: false 
  },
  hash: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  qr_base64: {
    type: DataTypes.TEXT("long") 
  },
  pdf_path: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  creado_por: { 
    type: DataTypes.INTEGER 
  },
  createdAt: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
  }, {
    timestamps: false,
    tableName: "reportes_asistencia_emitidos",
    modelName: "ReporteEmitido"
  });

module.exports = {
    ReporteEmitido: ReporteEmitidoModel
}