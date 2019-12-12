/*
*  Author: Jonathan Julian
*  Author: Inez Wibowo
*  Purpose: Model to store messages
*/

'use strict';

module.exports = (sequelize, Sequelize) => {

    const message = sequelize.define('message', {
        messageID: {
            type: Sequelize.INTEGER(11),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        message: {
            type: Sequelize.STRING(300),
            allowNull: false
        }
    },
    {
        createdAt: true,
        updatedAt: false
    });

    message.associate = (models) => {

        message.belongsTo(models.user, {
            as : "id_user"
        });
    };

    return message;
};