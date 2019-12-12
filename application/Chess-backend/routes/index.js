/*
*  Author: Jonathan Julian
*  Author: Inez Wibowo
*  Purpose:  Unused in impelmentation
*/

var express = require("express");
var router = express.Router();

router.use("/users", require("./users-router"));
router.use("/game", require("./game-router"));
router.use("/lobby", require("./lobby-router"));
/* GET home page. */
router.get("/api/", (req, res) => res.send({ title: "Express" }));

module.exports = router;
