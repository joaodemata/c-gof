'use strict';

const ConwayGameModel = require('../models/conway_game.model');

function gofEvents(_client) {
  console.log('Se conecto alguien');

  _client.on('start_game', async (_points) => {
    console.log('empezo el juego');
    const POINTS = _points.map((_point) => {
      return {
        socket_id: _client.id,
        x_y: `${_point.x},${_point.y}`,
        x: _point.x,
        y: _point.y,
        is_alive: _point.isAlive,
        around_points: [`${_point.x + 1},${_point.y}`, `${_point.x + 1},${_point.y + 1}`, `${_point.x + 1},${_point.y - 1}`, `${_point.x},${_point.y + 1}`, `${_point.x},${_point.y - 1}`, `${_point.x - 1},${_point.y + 1}`, `${_point.x - 1},${_point.y}`, `${_point.x - 1},${_point.y - 1}`],
      };
    });
    // Guardamos los puntos del juego
    await ConwayGameModel.insertMany(POINTS).catch((_error) => {
      console.log(_error);
    });

    let pointsAlive = true;

    while (pointsAlive) {
      const LIVES_CELLS = await ConwayGameModel.aggregate([
        {
          $match: {
            socket_id: _client.id,
          },
        },
        {
          $lookup: {
            from: 'conway_games',
            localField: 'socket_id',
            let: {
              aroundPoints: '$around_points',
            },
            foreignField: 'socket_id',
            as: 'aroundCells',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ['$x_y', '$$aroundPoints'],
                  },
                },
              },
              {
                $group: {
                  _id: '$is_alive',
                  cellsAlive: {
                    $sum: 1,
                  },
                },
              },
            ],
          },
        },
        {
          $project: {
            x: '$x',
            y: '$y',
            aroundCells: '$aroundCells',
            maintainsAlive: {
              $cond: [
                {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: '$aroundCells',
                          as: 'aliveCells',
                          cond: {
                            $and: [
                              {
                                $eq: ['$is_alive', true],
                              },
                              {
                                $eq: ['$$aliveCells._id', true],
                              },
                              {
                                $or: [
                                  {
                                    $eq: ['$$aliveCells.cellsAlive', 2],
                                  },
                                  {
                                    $eq: ['$$aliveCells.cellsAlive', 3],
                                  },
                                ],
                              },
                            ],
                          },
                        },
                      },
                    },
                    1,
                  ],
                },
                true,
                false,
              ],
            },
            comesAlive: {
              $cond: [
                {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: '$aroundCells',
                          as: 'aliveCells',
                          cond: {
                            $and: [
                              {
                                $eq: ['$is_alive', false],
                              },
                              {
                                $eq: ['$$aliveCells._id', true],
                              },
                              {
                                $eq: ['$$aliveCells.cellsAlive', 3],
                              },
                            ],
                          },
                        },
                      },
                    },
                    1,
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
      ]).catch((_error) => {
        console.log(_error);
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
      await ConwayGameModel.updateMany({ _id: { $in: UPDATE_LIVE_CELLS } }, { is_alive: true });
      // Actualizamos a muertas
      await ConwayGameModel.updateMany({ _id: { $nin: UPDATE_LIVE_CELLS } }, { is_alive: false });
      // Respondemos
      _client.emit('change', { data: RESPONSE });
    }
  });
}

module.exports = gofEvents;
