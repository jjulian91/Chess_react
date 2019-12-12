/*
*  Author: Jonathan Julian
*  Author: Inez Wibowo
*  Purpose: DB model to maintain chatroom information in the DB. 
*/


("use strict");

module.exports = (sequelize, Sequelize) => {

    const chatroom = sequelize.define('chatroom', {
        chatroomid: {
            type: Sequelize.INTEGER(11),
            autoIncrement: true,
            primaryKey: true
        }
    },
        {
            createdAt: false,
            updatedAt: false
        });
    

    chatroom.associate = (models) => {

        chatroom.hasMany(models.message, {
            onDelete: 'CASCADE',
            foreignKey: 'id_message',
        });

        chatroom.belongsTo(models.gamesessions, {
            as: 'Game', 
            through: 'gamechats'});
    };

    return chatroom;
};