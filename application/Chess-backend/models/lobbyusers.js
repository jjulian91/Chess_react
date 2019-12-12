/*
*  Author: Jonathan Julian
*  Author: Inez Wibowo
*  Purpose: used to maintain table of users in lobby
*/


("use strict");

module.exports = (sequelize, Sequelize) => {
  const lobbyuser = sequelize.define(
    "lobbyuser",
    {
      socketid: {
        type: Sequelize.STRING(200), //subject to change based on how long the socketID's are
        primaryKey: true
      },

    },
    {
      createdAt: true,
      updatedAt: false,
    }
  );
  lobbyuser.associate = (models) => {
    lobbyuser.belongsTo(models.user,{
        as:'id_user'
    });
  }
  return lobbyuser;
};
