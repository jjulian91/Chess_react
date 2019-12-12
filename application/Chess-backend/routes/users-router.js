/*
*  Author: Jonathan Julian
*  Author: Inez Wibowo
*  Purpose: All user validation routes
*/

const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();
const models = require("../models");
const app = express();

//check for users log in info returns password: true on success. 

router.post("/login", (req, res) => { //this is where you will add session creation res.sendFile(cookie)
  models.user.findOne({ 
    where: {
      userid: req.body.userid
    }
  }).then(async user => {
    if (!user || !(await user.comparePassword(req.body.password))) {
      res.status(401).json({ token: null, errorMessage: "failed!" });
    } else {
      user['password'] = true;
      res.send(user.dataValues);
      // let userSessionToken = generateSessionToken()
      // user.setDataValue('sessionToken', userSessionToken);

      // user.save().then(() => res.status(200)
      //     .json({ token: userSessionToken, admin: user.isAdmin }));
    }
  });
});

// users registration route -- checks for userID in page
router.post("/register", (req, res, next) => {
  models.user.findOne({
    where: {
      userid: req.body.userid
    }
  }).then(user => {
    //if userId is already being used
    if (user) {
      return res.status(400).json({ result: "User id is already used." });
    }

    models.user.create({
      userid: req.body.userid,
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      wins: "0",
      losses: "0",
      percent: "0",
      sessionToken: null
    });

    return res.status(200).json({ result: "New user has been created!" });
  });
});

module.exports = router;
