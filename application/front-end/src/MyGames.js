import React, { Component } from "react";
import Header from "./components/header";
import ListRooms from "./components/ListRooms";
import { MDBRow, MDBCol, MDBContainer } from "mdbreact";
import "./App.css";
import Cookies from "universal-cookie";
import { retrieveCookie } from "./components/cookies";

export default class MyGames extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userid: retrieveCookie("userid")
    };
  }

  render() {
    return (
      <div className="homepage">
        <Header userid={this.state.userid} />
        <br />

        <MDBContainer>
          <br />
          <MDBRow>
            <MDBCol md="6">
              {" "}
              <div className="text-center">
                {" "}
                <h3> Lobbies </h3>
                <ListRooms link={"/game/" + this.state.userid + "/list"} />
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}
