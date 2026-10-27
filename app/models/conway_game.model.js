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
      description: 'posición absoluta ("x,y") de la célula',
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
      description: 'indica si la célula está viva',
    },
    around_points: [
      {
        type: Schema.Types.String,
        required: true,
        description: 'posición absoluta ("x,y") de una célula vecina',
      },
    ],
    // Campos comunes de auditoría
    last_updated_at: {
      type: Schema.Types.Date,
      description: 'Última actualización',
      required: true,
      default: () => new Date(),
    },
    created_date: {
      type: Schema.Types.Date,
      description: 'Fecha de creación',
      required: true,
      default: () => new Date(),
    },
    logical_delete: {
      type: Schema.Types.Boolean,
      required: true,
      description: 'Borrado lógico',
      default: false,
    },
    core_db: {
      type: Schema.Types.String,
      description: 'Nombre del Core que hizo el registro',
      default: process.env.JM_CORE_NAME,
      required: false,
    },
    user_db: {
      type: Schema.Types.String,
      description: 'Usuario de base de datos que hizo el registro',
      default: process.env.JM_MDB_USER,
      required: false,
    },
    schema_db: {
      type: Schema.Types.String,
      description: 'Versión del esquema',
      default: '1.0.0',
      required: false,
    },
  },
  { minimize: false }
);

module.exports = mongoose.model('conway_game', ConwayGameModel);
