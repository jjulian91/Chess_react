import React, { Component } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { Link } from "react-router-dom";
import { saveCookie } from "./components/cookies";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.state = {
      userid: "",
      password: ""
    };
  }

  handleRouteChange() {
    this.props.history.push("/lobby");
  }

  validateForm() {
    return this.state.userid.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log("before info");
    fetch("/users/login", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 401) {
          alert("Sorry please check log-in credentials");
        } else if (res.password === true) {
          saveCookie(res.userid);
          this.handleRouteChange();
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        alert("Error logging in please try again");
        console.error(err);
      });
  };

  render() {
    return (
      <div className="wrapper">
        <div className="form-wrapper">
        <h1 className="light-blue-text">Chess</h1>
        <br />
        <form onSubmit={this.handleSubmit}>
          <FormGroup classname="userId" controlId="userid" bsSize="large">
          <FormLabel>Username</FormLabel>
            <FormControl
              autoFocus
              type="username"
              value={this.state.userid}
              onChange={this.handleChange}
            />
            
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <FormLabel>Password</FormLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              data-toggle="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            onClick={this.onSubmit}
          >
            Login
          </Button>
          <Link to="/register">Don't Have an Account?</Link>
        </form>
      </div>
      </div>
    );
  }
}

