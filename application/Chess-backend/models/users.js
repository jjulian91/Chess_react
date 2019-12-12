/*
*  Author: Jonathan Julian
*  Author: Inez Wibowo
*  Purpose: Model for user DB table
*/


const bcrypt = require("bcrypt");
("use strict");

module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define(
    "user",
    {
      userid: {
        type: Sequelize.STRING(20),
        primaryKey: true
      },
      firstname: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(45),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      wins: { type: Sequelize.INTEGER(11) },
      losses: { type: Sequelize.INTEGER(11) },
      percent: { type: Sequelize.DECIMAL(9, 5) }
    },
    {
      createdAt: false,
      updatedAt: false,

      hooks: {
        beforeCreate: (user, options) => {
          return bcrypt
            .hash(user.password, 10)
            .then(hash => {
              user.password = hash;
              console.log(user.password);
            })
            .catch(err => {
              throw new Error();
            });
        }
      }
    }
  );

  (user.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  }),
    (user.associate = models => {
      user.hasMany(models.message);
      user.hasMany(models.lobbyuser);
    });

  return user;
};
