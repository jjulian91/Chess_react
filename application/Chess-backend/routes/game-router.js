/*
 *  Author: Jonathan Julian
 *  Author: Inez Wibowo
 *  Purpose: route all game related activity
 */

const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();
const models = require("../models");
const app = express();
const Sequelize = require("sequelize");
const op = Sequelize.Op;

//creates new game -- if host has a non full game in DB, host is put back in that game
router.post("/newgame", function(req, res) {
  models.user
    .findOne({
      where: {
        userid: req.body.userid
      }
    })
    .then(user => {
      if (!user) {
        return res.status(400).json({ result: "Not a registered account" });
      }
      var gamestate;
      models.gamestate
        .findOne({
          where: {
            gamestateID: 1
          }
        })
        .then(state => {
          gamestate = state;
        });
      models.gamesessions
        .findOne({
          where: {
            [op.and]: [
              {
                HostUserid: req.body.userid,
                PlayerUserid: {
                  [op.eq]: null
                }
              },
              {
                GamestateGamestateID: 1
              }
            ]
          }
        })
        .then(async game => {
          console.log(game);
          if (!game) {
            var game = await models.gamesessions.create({
              pgn: req.body.pgn,
              basePgn: req.body.pgn
            }); //creates auto generated field for gamesession
            await game.setHost(user.userid); //assigns the host_player_id
          }
          await game.setGamestate(gamestate); //assigns gamestate to 'waiting'
          res.send(game);
        });
    });
});

//displays lobby games
router.get("/allgames", async function(req, res) {
  var results = await models.gamesessions.findAll({
    where: {
      [op.and]: {
        PlayerUserid: {
          [op.eq]: null //only pull joinable games for home
        },
        GamestateGamestateID: {
          [op.ne]: 3
        }
      }
    },
    raw: true
  });
  //console.log(results);
  res.send(results);
});

//gets list of games for the user
router.get("/:userid/list", async function(req, res) {
  var name = req.params.userid;
  var results;
  results = await models.gamesessions.findAll({
    where: {
      [op.and]: {
        [op.or]: {
          HostUserid: name,
          PlayerUserid: name
        },
        GamestateGamestateID: {
          [op.ne]: 3
        }
      }
    }
  });
  res.send(results);
});

// gets the game for the user
// handles join of second user
router.get("/:gamesessionid", async function(req, res) {
  //req.session if session is valid then do this else route to log in

  models.gamesessions.findByPk(req.params.gamesessionid).then(async game => {
    const io = req.app.get("socketio");
    const room = "/game/" + req.params.gamesessionid;
    io.of(room).on("connection", async client => {
      client.removeAllListeners();
      client.on("subscribeToChat", async msg => {
        io.of(room).emit("message", msg);
      });

      client.on("subscribeToState", async state => {
        console.log("move");
        if (state != null) {
          game.update({ pgn: state });
        }

        io.of(room).emit("state", state);
      });
    });

    if (req.cookies != undefined && game != null) {
      if (game.PlayerUserid === null && req.cookies.userid != game.HostUserid) {
        game.update({ PlayerUserid: req.cookies.userid });
      } else if (
        game.PlayerUserid === req.cookies.userid ||
        game.HostUserid === req.cookies.userid
      ) {
        res.send(game);
      }
    } else {
      res.status(404).send("you are unable to join this game");
    }
  });
});

//updates player records at end of game
// host win == 0; player win == 1, draw == 3
// replay == true -> game state set and pgn reset;
router.post("/:gamesessionid", async (req, res) => {
  //var game = await models.gamesessions.findByPk(req.body.gamesessionid); //gets game to update status
  //var host = await models.user.findByPk(req.body.HostUserid); //gets host
  //var player = await models.user.findByPk(req.body.PlayerUserid); //gets player
  var hostWins;
  var hostLosses;
  var hostPercent;
  var playerWins;
  var playerLosses;
  var playerPercent;
  var _host;
  var _player;
  await models.gamesessions
    .findByPk(req.params.gamesessionid)
    .then(async game => {
      await models.user.findByPk(game.HostUserid).then(async host => {
        await models.user.findByPk(game.PlayerUserid).then(async player => {
          _host = host.userid;
          hostWins = host.wins;
          hostLosses = host.losses;
          hostPercent;
          if (player) {
            _player = player.userid;
            playerWins = player.wins;
            playerLosses = player.losses;
            playerPercent;
          }
          switch (req.body.winner) {
            //host wins
            case 0:
              hostWins += 1;
              playerLosses += 1;
              hostPercent = hostWins / (hostWins + hostLosses);
              playerPercent = playerWins / (playerWins + playerLosses);
              break;

            //player win
            case 1:
              hostLosses += 1;
              playerWins += 1;
              playerPercent = playerWins / (playerWins + playerLosses);
              hostPercent = hostWins / (hostWins + hostLosses);
              break;

            //tie
            case 3:
              hostWins += 0.5;
              hostLosses += 0.5;
              hostPercent = hostWins / (hostWins + hostLosses);

              playerWins += 0.5;
              playerLoses += 0.5;
              playerPercent = playerWins / (playerWins + playerLoses);
              break;
          }
        });
      });
    });
  console.log(hostWins);
  //update players stats
  models.user.update(
    {
      wins: hostWins,
      losses: hostLosses,
      percent: hostPercent
    },
    {
      where: {
        userid: _host
      },
      returning: true,
      plain: true
    }
  );
  models.user.update(
    {
      wins: playerWins,
      losses: playerLosses,
      percent: playerPercent
    },
    {
      where: {
        userid: _player
      }
    }
  );

  models.gamesessions
    .findOne({
      where: {
        gameid: req.params.gamesessionid
      },
      include: [
        {
          model: models.gamestate,
          as: "Gamestate"
        }
      ]
    })
    .then(game => {
      if (game) {
        game.setGamestate(3);
      }
    });
});

module.exports = router;
