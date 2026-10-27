'use strict';

const { saveCellsService, nextGenerationService, saveGenerationService } = require('../services/operation.service');

/**
 * Convierte una célula recibida del cliente al formato de ConwayGameModel.
 * @param {{x: number, y: number, isAlive: boolean}} _point
 * @param {string} _socketId
 * @return {Object}
 */
function toCellDocument(_point, _socketId) {
  const { x, y } = _point;
  return {
    socket_id: _socketId,
    x_y: `${x},${y}`,
    x,
    y,
    is_alive: _point.isAlive,
    // Las 8 vecinas de la célula
    around_points: [`${x + 1},${y}`, `${x + 1},${y + 1}`, `${x + 1},${y - 1}`, `${x},${y + 1}`, `${x},${y - 1}`, `${x - 1},${y + 1}`, `${x - 1},${y}`, `${x - 1},${y - 1}`],
  };
}

/**
 * Eventos del socket para una partida del juego de la vida.
 *
 * Recibe: `start_game` con la grilla inicial `[{ x, y, isAlive }]`.
 * Emite:  `change` con cada generación `{ data: [{ x, y, isAlive }] }`
 *         `finish` cuando no quedan células vivas `{ iterations }`.
 *
 * @param {import('socket.io').Socket} _client
 */
function gofEvents(_client) {
  console.log(`Cliente conectado: ${_client.id}`);

  _client.on('start_game', async (_points) => {
    console.log(`Inicia el juego: ${_client.id}`);

    try {
      await saveCellsService(_points.map((_point) => toCellDocument(_point, _client.id)));

      let iterations = 0;
      let hasAliveCells = true;

      // Se detiene cuando mueren todas las células o el cliente se desconecta
      while (hasAliveCells && _client.connected) {
        const CELLS = await nextGenerationService(_client.id);

        const ALIVE_IDS = [];
        const RESPONSE = CELLS.map((_cell) => {
          const IS_ALIVE = _cell.maintainsAlive || _cell.comesAlive;
          if (IS_ALIVE) {
            ALIVE_IDS.push(_cell._id);
          }
          return { x: _cell.x, y: _cell.y, isAlive: IS_ALIVE };
        });

        await saveGenerationService(_client.id, ALIVE_IDS);
        _client.emit('change', { data: RESPONSE });

        hasAliveCells = ALIVE_IDS.length > 0;
        iterations += 1;
      }

      console.log(`Finaliza el juego: ${_client.id} (${iterations} iteraciones)`);
      _client.emit('finish', { iterations });
    } catch (_error) {
      console.error(`Error en el juego ${_client.id}`, _error);
    }
  });
}

module.exports = gofEvents;
