var createError = require("http-errors");
var express = require("express");

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var sequelize = require("sequelize");
var indexRouter = require("./routes/index");
var userRouter = require("./routes/users-router");
var gameRouter = require("./routes/game-router");
var lobbyRouter = require("./routes/lobby-router");
const app = express();

var io = require("socket.io")();
io.listen(8080);
app.set("socketio", io);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", indexRouter);
app.use("/users", userRouter);
app.use("/game", gameRouter);
app.use("/lobby", lobbyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

io.of("/lobby").on("connection", socket => {
  console.log("connection in lobby");
  socket.on("subscribeToChat", msg => {
    io.of("/lobby").emit("message", msg);
  });
});

module.exports = app;
