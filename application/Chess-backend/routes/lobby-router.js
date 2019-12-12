/*
*  Author: Jonathan Julian
*  Author: Inez Wibowo
*  Purpose: route lobby specific information. 
*/

var express = require("express");
const router = express.Router();
const models = require('../models');
const sequelize = require('sequelize');
const op = sequelize.Op;

/* GET lobby page. */
// SORTS LEADER BOARD BY DECENDING ONLY GRABBING USERS WITH > 0% WIN PERCENT
// LISMITS TO 10 RESULTS
router.get("/getleaderboard", async function(req, res){
  models.user.findAll({
    limit: 10,
    where: {
      percent:{
        [op.gt]: 0
      }
    },
    order: [
      ['percent', 'DESC']
    ]    
  }).then(leaders=>{
    console.log(leaders);
    res.send(leaders);
  }).catch(error =>{
    res.status(500).send(error);
  })
 });

module.exports = router;
