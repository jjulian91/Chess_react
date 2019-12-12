// Game States -- 1: Waiting -- 2: playing -- 3: Ended
/*
*  Author: Jonathan Julian
*  Author: Inez Wibowo
*  Purpose: model for GameStates
*/


module.exports = (sequelize, Sequelize) => {
  const gamestate = sequelize.define(
    "gamestate",
    {
      gamestateID: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true
      },
      state: {
        type: Sequelize.STRING(20),
        allowNull: false
      }
    },
    {
      createdAt: false,
      updatedAt: false
    }
  );
  return gamestate;
};
