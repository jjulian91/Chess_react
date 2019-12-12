import React, { Component } from "react";
import Header from "./components/header";
import ChatBox from "./components/chatbox";
import ListRooms from "./components/ListRooms";
import RankList from "./components/RankList";
import { Button } from "react-bootstrap";
import { MDBRow, MDBCol, MDBContainer } from "mdbreact";
import "./App.css";
import { retrieveCookie } from "./components/cookies";
import Chess from "chess.js";

export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.handleRouteChange = this.handleRouteChange.bind(this);

    this.state = {
      gameList: [],
      gameID: "",
      userid: retrieveCookie("userid")
    };
    this.createGame = this.createGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }
  handleRouteChange(link) {
    //var openGame = window.open("/Game" + );
    //openGame.window.parameters = JSON.stringify(this.state.gameID);
  }
  joinGame() {
    this.setState = {
      gameID: ""
    };
    this.handleRouteChange();
  }
  createGame() {
    if (retrieveCookie("userid")) {
      var chess = new Chess();
      chess.header("Black", this.state.userid);
      this.setState({
        pgn: new Buffer(chess.pgn()).toString()
      });
      fetch("/game/newgame", {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify(this.state),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(res => {
          alert("created new game, gameId: " + res.gameid);
          window.open("/Game/" + res.gameid);
        });
    } else alert("please log in");
  }
  componentDidMount() {
    //this.getLobbies();
  }
  render() {
    const { title } = this.state;
    return (
      <div className="homepage">
        <Header userid={this.state.userid} />
        <br />
        <Button type="submit" onClick={this.createGame} className="createGame">
          Create Game
        </Button>
        <MDBContainer>
          <br />
          <MDBRow>
            <MDBCol md="3">
              {" "}
              <div className="text-center">
                {" "}
                <h3> {title} </h3>
                <h3> Leaderboard </h3>
                <RankList />
              </div>
            </MDBCol>
            <MDBCol md="6">
              {" "}
              <div className="text-center">
                {" "}
                <h3> {title} </h3>
                <h3> Lobbies </h3>
                <ListRooms link="/game/allgames" />
              </div>
            </MDBCol>
            <MDBCol md="3">
              {" "}
              <div className="text-center">
                {" "}
                <h3> {title} </h3>
                <h3> Chat </h3>
                <ChatBox userid={this.state.userid} url={"lobby"} />
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}
