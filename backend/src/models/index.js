"use strict";

const db = {};
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Módulos con modelos modernos y centralizados

const { Usuario } = require('../modules/usuarios/infrastructure/models/usuarioModel');
db.usuarios = Usuario;

const { Filial } = require('../modules/filiales/infrastructure/models/filialModel');
db.filiales = Filial;

const { Asistencia } = require('../modules/asistencias/infrastructure/models/asistenciaModel');
db.asistencias = Asistencia;

// ✅ Solo se asocian los que tienen .associate()
if (db.usuarios.associate) db.usuarios.associate(db);
if (db.filiales.associate) db.filiales.associate(db);
if (db.asistencias.associate) db.asistencias.associate(db);

// Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;