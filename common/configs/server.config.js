'use strict';

const Mongoose = require('mongoose');
const i18n = require('i18n');

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
    Mongoose.connect(`mongodb://${process.env.JM_MDB_HOST}:${process.env.JM_MDB_PORT}`);
  },
  /**
   * Configuracion de traducciones
   */
  I18nTranslate: (_isGlobal, _locale = 'es', _directory) => {
    let i18nObj = {};
    i18n.configure({
      locales: ['en', 'es'],
      register: _isGlobal ? global : i18nObj,
      directory: _directory,
      defaultLocale: _locale,
    });
    return i18n.init;
  },
};
