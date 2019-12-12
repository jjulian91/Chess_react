import Chessboard from "chessboardjsx";
import React, { Component } from "react";
import Chess from "chess.js";
import { retrieveCookie } from "./cookies";

import io from "socket.io-client";
import GameControls from "./gameControls";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: "black",
      game: new Chess(),
      socket: io.connect(
        "http://ec2-3-18-223-220.us-east-2.compute.amazonaws.com:8080/game/" +
          //"http://localhost:8080/game/" + \
          this.props.url
      )
    };
    this.updateState = this.updateState.bind(this);
    this.stateReceiver = this.stateReceiver.bind(this);
    this.receiveState = this.receiveState.bind(this);
  }

  state = {
    game: new Chess()
  };

  updateState(gameState) {
    this.state.socket.emit("subscribeToState", gameState);
  }

  stateReceiver(receieveState) {
    this.state.socket.on("state", receieveState);
  }

  receiveState(state) {
    var newChess = Chess();
    newChess.load_pgn(state);

    this.setState(
      {
        game: newChess
      },
      () => console.log()
    );
  }

  componentDidMount() {
    this.stateReceiver(this.receiveState);
    var orientation = "";

    fetch("/game/" + this.props.gamesessionid)
      .then(response => response.json())
      .then(res => {
        var newChess = Chess();
        if (res.pgn != null) {
          newChess.load_pgn(res.pgn);
        }
        newChess.header("White", res.HostUserid);
        newChess.header("Black", res.PlayerUserid);
        if (res.HostUserid === retrieveCookie()) {
          orientation = "white";
        } else {
          orientation = "black";
        }

        this.setState(
          {
            game: newChess,
            orientation: orientation
          },
          () => this.updateState(this.state.game.pgn())
        );
      });

    this.setState(({ history, pieceSquare }) => ({
      fen: this.state.game.fen(),
      history: this.state.game.history()
    }));
  }

  calcWidth = ({ screenWidth, screenHeight }) => {
    if (!(screenWidth / 1.8 > 940)) {
      return screenWidth / 1.8;
    } else {
      return 940;
    }
  };

  allowDrag = ({ piece, sourceSquare }) => {
    if (
      (this.state.game.turn() === "w" &&
        this.state.game.header().White === retrieveCookie()) ||
      (this.state.game.turn() === "b" &&
        this.state.game.header().Black === retrieveCookie())
    ) {
      if (piece[0] === this.state.game.turn()) {
        return true;
      }
    } else {
      return false;
    }
  };

  onDrop = ({ sourceSquare, targetSquare }) => {
    this.state.game.header("White", this.props.hostplayerid);
    this.state.game.header("Black", this.props.playerid);

    let move = this.state.game.move({
      from: sourceSquare,
      to: targetSquare
    });

    //if move is valid
    if (move == null) return;

    if (this.state.game.pgn() !== null) {
      this.updateState(this.state.game.pgn());
    }
    this.setState(({ history, pieceSquare }) => ({
      fen: this.state.game.fen(),
      history: this.state.game.history()
    }));

    if (this.state.game.game_over()) {
      fetch("/game/" + this.props.gameid, {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({ winner: 0 }),
        headers: {
          "Content-Type": "application/json"
        }
      }).then(
        this.state.socket.emit("subscribeToChat", {
          msg: "game over",
          title: "GAME"
        }),
        alert("Game over"),
        window.close()
      );
    }
  };

  render() {
    return this.props.children({
      position: this.state.game.fen(),
      calcWidth: this.calcWidth,
      onDrop: this.onDrop,
      orientation: this.state.orientation,
      allowDrag: this.allowDrag,
      turn: this.state.game.turn()
    });
  }
}

export default class ChessBoard extends Component {
  render() {
    var playerCode = 0;
    if (this.props.hostplayerid === retrieveCookie()) {
      playerCode = 1;
    }
    return (
      <div>
        <Board gamesessionid={this.props.gameid} url={this.props.gameid}>
          {({ position, calcWidth, onDrop, orientation, allowDrag, turn }) => (
            <div>
              <GameControls turn={turn} gameid={this.props.gameid} winner={0} />
              <Chessboard
                id="standard"
                orientation={orientation}
                position={position}
                calcWidth={calcWidth}
                onDrop={onDrop}
                allowDrag={allowDrag}
                boardStyle={{
                  margin: "auto",
                  borderRadius: "5px",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)"
                }}
              />
            </div>
          )}
        </Board>
      </div>
    );
  }
}
