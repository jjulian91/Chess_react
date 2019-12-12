import React, { Component } from "react";
import Board from "./components/board";
import GameControls from "./components/gameControls";
import { MDBRow, MDBCol, MDBContainer } from "mdbreact";
import ChatBox from "./components/chatbox";
import "./App.css";
import { retrieveCookie } from "./components/cookies";

class Game extends Component {
  constructor() {
    super();
    //Set default message
    this.state = {
      gameid: ""
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <MDBContainer fluid="true" className="game-page">
          <MDBRow>
            <MDBCol md="9">
              <Board
                gameid={this.props.match.params.gameid}
                hostid={this.props.match.params.hostid}
                playerid={this.props.match.params.playerid}
              />
            </MDBCol>
            <MDBCol md="3" className="chat-section">
              <ChatBox
                url={"game/" + this.props.match.params.gameid}
                userid={retrieveCookie()}
              />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default Game;
