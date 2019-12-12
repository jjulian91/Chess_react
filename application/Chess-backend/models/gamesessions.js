/*
 *  Author: Jonathan Julian
 *  Author: Inez Wibowo
 *  Purpose: DB model for all game session activity
 */

"use strict";

module.exports = (sequelize, Sequelize) => {
  const gamesessions = sequelize.define(
    "gamesessions",
    {
      gameid: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true
      },

      pgn: {
        type: Sequelize.TEXT("long"),
        allowNull: true
      },
      basePgn: {
        type: Sequelize.TEXT("long"),
        allowNull: true
      }
    },
    {
      updatedAt: false
    }
  );

  gamesessions.associate = models => {
    gamesessions.belongsTo(models.user, {
      as: "Host",
      through: "hostTable"
    });

    gamesessions.belongsTo(models.user, {
      as: "Player",
      through: "playerTable"
    });

    gamesessions.belongsTo(models.gamestate, {
      as: "Gamestate",
      through: "statetable"
    });
  };

  return gamesessions;
};
