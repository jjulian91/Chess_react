import React, { Component } from "react";
import Lobby from "./Lobby";
import Login from "./Login";
import Game from "./Game";
import MyGames from "./MyGames";
import Options from "./Options";
import Registration from "./Registration";
import { BrowserRouter, Route } from "react-router-dom";
import { retrieveCookie } from "./components/cookies";

export default class Routing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      loggedIn: false
    };
  }

  setUsername = username => {
    this.setState({ username });
  };

  render() {
    return (
      //Page Routing

      <BrowserRouter>
        <Route
          exact
          path="/register"
          render={props => <Registration {...props} component={Registration} />}
        />
        <Route
          path="/lobby"
          render={props => <Lobby {...props} username={this.state.username} />}
        />
        <Route
          exact
          path="/"
          render={props => (
            <Login
              {...props}
              component={Login}
              setUsername={this.setUsername}
            />
          )}
        />
        <Route
          path="/Game/:gameid"
          render={props => <Game {...props} setUsername={this.setUsername} />}
        />

        <Route
          path="/MyGames"
          render={props => (
            <MyGames {...props} setUsername={this.setUsername} />
          )}
        />
        <Route
          path="/Options"
          render={props => (
            <Options {...props} setUsername={this.setUsername} />
          )}
        />
      </BrowserRouter>
    );
  }
}
