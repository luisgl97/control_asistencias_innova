const { DataTypes } = require("sequelize");
const sequelize = require("../../../../config/db"); // Ajusta la ruta según tu proyecto

const Filial = sequelize.define(
  "filiales",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ruc: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
    },
    razon_social: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  },
  {
    tableName: "filiales",
    timestamps: false, 
  }
);

// Asociaciones
Filial.associate = (models) => {
  Filial.hasMany(models.usuarios, {
    foreignKey: "filial_id",
    as: "usuarios",
  });
};

module.exports = { Filial };