"use strict";

const Mongoose = require("mongoose");

/**
 * Variables de configuración del Servidor.
 * - Conexión a Base de Datos.
 * - Traduccion
 */

module.exports = {
  /**
   * Conexión al motor de Base de Datos MongoDB.
   */

  DatabaseMongo: async () => {
    Mongoose.connect(
      `mongodb://${process.env.JM_MDB_HOST}:${process.env.JM_MDB_PORT}`,
    );
  },
};
