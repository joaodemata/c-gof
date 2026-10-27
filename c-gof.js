'use strict';

require('dotenv').config();

// Mapea las variables JM_CGOF_* del .env a las variables genéricas JM_* del Core.
// Debe ejecutarse antes de cargar ./app, ya que el modelo lee process.env al importarse.
// Info del Core
process.env.JM_IS_CORE = true;
process.env.JM_CORE_NAME = process.env.JM_CGOF_CORE_NAME;
process.env.JM_CORE_PORT = process.env.JM_CGOF_PORT;
// MongoDB
process.env.JM_MDB_HOST = process.env.JM_CGOF_MDB_HOST;
process.env.JM_MDB_PORT = process.env.JM_CGOF_MDB_PORT;
process.env.JM_MDB_NAME = process.env.JM_CGOF_MDB_NAME;
process.env.JM_MDB_AUTH_DB = process.env.JM_CGOF_MDB_AUTH_DB;
process.env.JM_MDB_USER = process.env.JM_CGOF_MDB_USER;
process.env.JM_MDB_PASS = process.env.JM_CGOF_MDB_PASS;
process.env.JM_MDB_POLL_MAX = process.env.JM_CGOF_MDB_POLL_MAX;
process.env.JM_MDB_POLL_MIN = process.env.JM_CGOF_MDB_POLL_MIN;
process.env.JM_MDB_POLL_IDLE = process.env.JM_CGOF_MDB_POLL_IDLE;
process.env.JM_MDB_REPLICASET_NAME = process.env.JM_CGOF_MDB_REPLICASET_NAME;
process.env.JM_MDB_CONNECTION_TIMEOUT = 10000;
// Seguridad
process.env.JM_VALIDATE_APIKEY = process.env.JM_CGOF_VALIDATE_APIKEY;
process.env.JM_APIKEY = process.env.JM_CGOF_APIKEY;

const { server } = require('./app');
const { CMM_SERVER } = require('./common/configs');

console.info(`Ambiente: ${process.env.JM_NODE_ENV}`);

CMM_SERVER.DatabaseMongo()
  .then(() => {
    console.log(`MongoDB conectado, base de datos: ${process.env.JM_MDB_NAME}`);

    server.listen(process.env.JM_CORE_PORT, () => {
      console.log(`Servidor escuchando en el puerto ${process.env.JM_CORE_PORT}`);
    });
  })
  .catch((_error) => {
    console.error('No se pudo conectar a MongoDB', _error);
    process.exit(1);
  });
