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

const { Permiso } = require('../modules/permisos/infrastructure/models/permisoModel');
db.permisos = Permiso;

const { Obra } = require('../modules/obras/infrastructure/models/obraModel')
db.obras = Obra;

const { RegistrosDiarios } = require('../modules/registros_diarios/infrastructure/models/registrosRegistrosDiariosModel')
db.registros_diarios = RegistrosDiarios;

// ✅ Solo se asocian los que tienen .associate()
if (db.usuarios.associate) db.usuarios.associate(db);
if (db.filiales.associate) db.filiales.associate(db);
if (db.asistencias.associate) db.asistencias.associate(db);
if (db.permisos.associate) db.permisos.associate(db);
if (db.obras.associate) db.obras.associate(db);
if (db.registros_diarios.associate) db.registros_diarios.associate(db);

// Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;