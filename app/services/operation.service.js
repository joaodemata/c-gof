'use strict';

const ConwayGameModel = require('../models/conway_game.model');

/**
 * Guarda las células iniciales de una partida.
 * @param {Array<Object>} _cells Células con el formato de ConwayGameModel.
 */
async function saveCellsService(_cells) {
  await ConwayGameModel.insertMany(_cells);
}

/**
 * Calcula la siguiente generación de la partida de un socket.
 *
 * Por cada célula busca sus 8 vecinas (`around_points`) y cuenta cuántas están
 * vivas. Con ese conteo aplica las reglas de Conway:
 * - `maintainsAlive`: está viva y tiene 2 o 3 vecinas vivas.
 * - `comesAlive`: está muerta y tiene exactamente 3 vecinas vivas.
 *
 * @param {string} _socketId Identificador del socket dueño de la partida.
 * @return {Promise<Array<{_id, x, y, maintainsAlive, comesAlive}>>}
 */
async function nextGenerationService(_socketId) {
  return ConwayGameModel.aggregate([
    // Solo las células de esta partida
    { $match: { socket_id: _socketId } },
    // Vecinas agrupadas por estado: [{ _id: true, cellsAlive: n }, { _id: false, cellsAlive: m }]
    {
      $lookup: {
        from: 'conway_games',
        localField: 'socket_id',
        foreignField: 'socket_id',
        let: { aroundPoints: '$around_points' },
        as: 'aroundCells',
        pipeline: [
          { $match: { $expr: { $in: ['$x_y', '$$aroundPoints'] } } },
          { $group: { _id: '$is_alive', cellsAlive: { $sum: 1 } } },
        ],
      },
    },
    {
      $project: {
        x: '$x',
        y: '$y',
        maintainsAlive: {
          $eq: [
            {
              $size: {
                $filter: {
                  input: '$aroundCells',
                  as: 'aliveCells',
                  cond: {
                    $and: [{ $eq: ['$is_alive', true] }, { $eq: ['$$aliveCells._id', true] }, { $in: ['$$aliveCells.cellsAlive', [2, 3]] }],
                  },
                },
              },
            },
            1,
          ],
        },
        comesAlive: {
          $eq: [
            {
              $size: {
                $filter: {
                  input: '$aroundCells',
                  as: 'aliveCells',
                  cond: {
                    $and: [{ $eq: ['$is_alive', false] }, { $eq: ['$$aliveCells._id', true] }, { $eq: ['$$aliveCells.cellsAlive', 3] }],
                  },
                },
              },
            },
            1,
          ],
        },
      },
    },
  ]);
}

/**
 * Persiste una generación: las células indicadas quedan vivas y el resto de
 * la partida queda muerta.
 * @param {string} _socketId Identificador del socket dueño de la partida.
 * @param {Array<ObjectId>} _aliveIds Ids de las células vivas.
 */
async function saveGenerationService(_socketId, _aliveIds) {
  await ConwayGameModel.updateMany({ socket_id: _socketId, _id: { $in: _aliveIds } }, { is_alive: true });
  await ConwayGameModel.updateMany({ socket_id: _socketId, _id: { $nin: _aliveIds } }, { is_alive: false });
}

module.exports = {
  saveCellsService,
  nextGenerationService,
  saveGenerationService,
};
