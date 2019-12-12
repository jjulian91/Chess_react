import React, { Component } from "react";
// eslint-disable-next-line import/no-unresolved
import { Link } from "react-router-dom";
import Header from "./components/header";
import ChatBox from "./components/chatbox";
import ListRooms from "./components/ListRooms";
import RankList from "./components/RankList";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn
} from "mdbreact";
import "./App.css";

export default class App extends Component {
  state = { title: null };

  constructor(props) {
    super(props);
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleRouteChange() {
    this.props.history.push("/");
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  componentDidMount() {
    fetch("/api/").then(res => res.json());
  }

  render() {
    const { title } = this.state;
    return (
      <div classname="homepage">
        <Header />
        <br />
        <MDBContainer>
          <MDBRow>
            <MDBCol md="3">
              {" "}
              <div class="text-center">
                {" "}
                <h3> {title} </h3>:<h3> leaderboard </h3>
                <RankList />
              </div>
            </MDBCol>
            <MDBCol md="6">
              {" "}
              <div class="text-center">
                {" "}
                <h3> Lobbies </h3>
                <ListRooms />
              </div>
            </MDBCol>
            <MDBCol md="3">
              {" "}
              <div class="text-center">
                {" "}
                <h3> Chat </h3>
                <ChatBox />
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}
