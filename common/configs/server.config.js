'use strict';

const Mongoose = require('mongoose');

/**
 * Configuración del servidor.
 */
module.exports = {
  /**
   * Conexión a MongoDB.
   * @return {Promise<Mongoose>}
   */
  DatabaseMongo: () => {
    return Mongoose.connect(`mongodb://${process.env.JM_MDB_HOST}:${process.env.JM_MDB_PORT}/${process.env.JM_MDB_NAME}`);
  },
};
