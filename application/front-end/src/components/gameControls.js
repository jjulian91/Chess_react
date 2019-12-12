import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export default class GameControls extends Component {
  constructor() {
    super();
    this.forfeit = this.forfeit.bind(this);

    this.state = {
      gameid: "",
      winner: 0
    };
  }
  componentDidMount() {}

  forfeit() {
    this.setState = {
      gameid: this.props.gameid,
      winner: this.props.winner
    };

    fetch("/game/" + this.props.gameid, {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(window.close());
  }

  render() {
    return (
      <div className="gamecontrols">
        <Row>
          <Col>
            <h1>{this.props.turn}</h1>
          </Col>
          <Col className="justify-content-end">
            <Button
              className="btn-danger"
              type="submit"
              onClick={e => {
                if (window.confirm("Are you sure you wish to forfeit?"))
                  this.forfeit(e);
              }}
            >
              Forfeit Game
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
