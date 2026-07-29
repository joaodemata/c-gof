"use strict";

const {
  startGameService,
  gameService,
  updateCellsService,
} = require("../services/operation.service");

function gofEvents(_client) {
  console.log("Se conecto alguien");

  _client.on("start_game", async (_points) => {
    console.log("empezo el juego");
    const POINTS = _points.map((_point) => {
      return {
        socket_id: _client.id,
        x_y: `${_point.x},${_point.y}`,
        x: _point.x,
        y: _point.y,
        is_alive: _point.isAlive,
        around_points: [
          `${_point.x + 1},${_point.y}`,
          `${_point.x + 1},${_point.y + 1}`,
          `${_point.x + 1},${_point.y - 1}`,
          `${_point.x},${_point.y + 1}`,
          `${_point.x},${_point.y - 1}`,
          `${_point.x - 1},${_point.y + 1}`,
          `${_point.x - 1},${_point.y}`,
          `${_point.x - 1},${_point.y - 1}`,
        ],
      };
    });

    // Guardamos los puntos del juego
    await startGameService(POINTS).catch((_error) => {
      console.log(_error);
    });
    // valores iniciales
    let pointsAlive = true;
    let iterations = 0;

    while (pointsAlive) {
      // Contamos el numero de iteraciones

      const LIVES_CELLS = await gameService(_client).catch((_error) => {
        console.error(_error);
      });

      const UPDATE_LIVE_CELLS = [];

      const RESPONSE = LIVES_CELLS.map((_cell) => {
        let lives = _cell.maintainsAlive || _cell.comesAlive;
        // Si esta viva agregamos su id
        if (lives) {
          UPDATE_LIVE_CELLS.push(_cell._id);
        }
        return {
          x: _cell.x,
          y: _cell.y,
          isAlive: lives,
        };
      });

      // Si hay celulas vivas seguimos el juego
      pointsAlive = UPDATE_LIVE_CELLS.length > 0;

      //Actualizamos a vivas
      await updateCellsService(UPDATE_LIVE_CELLS, true).catch((_error) => {
        console.log(_error);
      });
      // Actualizamos a muertas
      await updateCellsService(UPDATE_LIVE_CELLS, false).catch((_error) => {
        console.log(_error);
      });

      // Respondemos
      _client.emit("change", { data: RESPONSE });

      iterations += 1;
    }
    console.log("Finalizo el juego");
    _client.emit("finish", { iterations: iterations });
  });
}

module.exports = gofEvents;
