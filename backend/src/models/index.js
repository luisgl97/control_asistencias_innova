"use strict";

const db = {};
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Módulos con modelos modernos y centralizados

const { Usuario } = require('../modules/usuarios/infrastructure/models/usuarioModel');
db.usuarios = Usuario;

const { Filial } = require('../modules/filiales/infrastructure/models/filialModel');
db.filiales = Filial;

// ✅ Solo se asocian los que tienen .associate()
if (db.usuarios.associate) db.usuarios.associate(db);
if (db.filiales.associate) db.filiales.associate(db);

// Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;