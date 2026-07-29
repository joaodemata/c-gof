const ConwayGameModel = require("../models/conway_game.model");

async function startGameService(_points) {
  try {
    // Guardamos los puntos del juego
    await ConwayGameModel.insertMany(_points).catch((_error) => {
      console.log(_error);
    });
  } catch (_error) {
    console.error(_error);
  }
}

async function gameService(_client) {
  try {
    // Buscamos las celulas vivas
    const LIVE_CELLS = await ConwayGameModel.aggregate([
      {
        $match: {
          socket_id: _client.id,
        },
      },
      {
        $lookup: {
          from: "conway_games",
          localField: "socket_id",
          let: {
            aroundPoints: "$around_points",
          },
          foreignField: "socket_id",
          as: "aroundCells",
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$x_y", "$$aroundPoints"],
                },
              },
            },
            {
              $group: {
                _id: "$is_alive",
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
          x: "$x",
          y: "$y",
          aroundCells: "$aroundCells",
          maintainsAlive: {
            $cond: [
              {
                $eq: [
                  {
                    $size: {
                      $filter: {
                        input: "$aroundCells",
                        as: "aliveCells",
                        cond: {
                          $and: [
                            {
                              $eq: ["$is_alive", true],
                            },
                            {
                              $eq: ["$$aliveCells._id", true],
                            },
                            {
                              $or: [
                                {
                                  $eq: ["$$aliveCells.cellsAlive", 2],
                                },
                                {
                                  $eq: ["$$aliveCells.cellsAlive", 3],
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
                        input: "$aroundCells",
                        as: "aliveCells",
                        cond: {
                          $and: [
                            {
                              $eq: ["$is_alive", false],
                            },
                            {
                              $eq: ["$$aliveCells._id", true],
                            },
                            {
                              $eq: ["$$aliveCells.cellsAlive", 3],
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

    return LIVE_CELLS;
  } catch (error) {
    console.error(_error);
  }
}

async function updateCellsService(_updateCells, _isAlive) {
  try {
    await ConwayGameModel.updateMany(
      { _id: { $in: _updateCells } },
      { is_alive: _isAlive },
    );
  } catch (_error) {
    console.error(_error);
  }
}

module.exports = {
  startGameService: startGameService,
  gameService: gameService,
  updateCellsService: updateCellsService,
};
