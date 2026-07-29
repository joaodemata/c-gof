"use strict";

try {
  require("dotenv").config();
  // Setear las variables de entorno para usar en el Core.
  // Info Del Core
  process.env.JM_IS_CORE = true;
  process.env.JM_CORE_NAME = process.env.JM_CGOF_CORE_NAME;
  process.env.JM_CORE_PORT = process.env.JM_CGOF_PORT;
  // DataBase MongoDB
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
  // Security
  process.env.JM_VALIDATE_APIKEY = process.env.JM_CGOF_VALIDATE_APIKEY;
  process.env.JM_APIKEY = process.env.JM_CGOF_APIKEY;

  // Iniciamos nuestra APP
  const { server } = require("./app");

  const { CMM_SERVER } = require("./common/configs");

  // Variable de Entorno para Comprobar si esta tomand el ENV del Servidor
  console.info(`AMBIENTE Runing in ${process.env.JM_NODE_ENV}`);

  CMM_SERVER.DatabaseMongo()
    .then(() => {
      console.log(
        `Connect MongoDB Database Connected, User: ${process.env.JM_MDB_USER} and Database: ${process.env.JM_MDB_NAME}`,
      );

      server.listen(process.env.JM_CGOF_PORT, undefined, undefined, () => {
        console.log(`Connected Server port: ${process.env.JM_CGOF_PORT}`);
      });
    })
    .catch((_error) => {
      console.log({ _error });
      console.error(
        `CATCH Failed to Connect mongoDB ${JSON.stringify(_error)}`,
      );
    });
} catch (_error) {
  console.error("Error trycatch index", _error);
}
