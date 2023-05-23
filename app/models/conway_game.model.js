'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConwayGameModel = new Schema(
  {
    socket_id: {
      type: Schema.Types.String,
      required: true,
      description: 'Identificador del socket para mensajes privados',
    },
    x_y: {
      type: Schema.Types.String,
      required: true,
      description: 'posición abosuluta del punto',
    },
    x: {
      type: Schema.Types.Number,
      required: true,
      description: 'posición en x de la célula',
    },
    y: {
      type: Schema.Types.Number,
      required: true,
      description: 'posición en y de la célula',
    },
    is_alive: {
      type: Schema.Types.Boolean,
      required: true,
      description: 'indica si la célula esta viva',
    },
    around_points: [
      {
        type: Schema.Types.String,
        required: true,
        description: 'posición abosuluta del punto',
      },
    ],
    // Comunes
    last_updated_at: {
      type: Schema.Types.Date,
      description: 'Ultima Actualizacion',
      required: true,
      default: () => new Date(),
    },
    created_date: {
      type: Schema.Types.Date,
      description: 'Fecha de Creacion',
      required: true,
      default: () => new Date(),
    },
    logical_delete: {
      type: Schema.Types.Boolean,
      required: true,
      description: 'Borrado Logico',
      default: false,
    },
    core_db: {
      type: Schema.Types.String,
      description: 'Nombre del Core de Base de datos que hizo el registro',
      default: process.env.CC_CORE_NAME,
      required: false,
    },
    user_db: {
      type: Schema.Types.String,
      description: 'Usuario de Base de datos que hizo el registro',
      default: process.env.CC_MDB_USER,
      required: false,
    },
    schema_db: {
      type: Schema.Types.String,
      description: 'Versionado de la Base de datos.',
      default: '1.0.0',
      required: false,
    },
  },
  { minimize: false }
);

module.exports = mongoose.model('conway_game', ConwayGameModel);
