import React, { Component } from "react";
import "./Lobby.css";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn, Button } from "mdbreact";

export default class ListRoom extends Component {
  constructor() {
    super();
    this.state = {
      data: null
      // userid:null,
      // wins:null,
      // losses:null
    };
    this.getLeaderboard = this.getLeaderboard.bind(this);
  }

  getLeaderboard() {
    console.log("before");
    fetch("/Lobby/getleaderboard")
      .then(response => response.json(), console.log("during"))
      .then(res => {
        this.setState(
          {
            data: res
          },
          () => console.log(this.state.data)
        );
      });
    console.log("after");
  }

  componentDidMount() {
    this.getLeaderboard();
  }

  createTable = () => {
    let table = []; //Sets empty table
    let children = [];
    if (this.state.data !== null) {
      if (this.state.data.length === 0) {
        children.push(<div class="leaderboard">{"No winners..."}</div>);
      } else {
        children.push(
          <MDBTable>
            <MDBTableHead>
              <tr class="leaderboard_List">
                <th scope="col"> {"Username:"}</th>
                <th scope="col">{"Wins:"}</th>
              </tr>
            </MDBTableHead>
          </MDBTable>
        );

        for (let i = 0; i < this.state.data.length; i++) {
          //Inner loop to create children
          for (let j = 0; j < this.state.data.length; j++) {
            if (this.state.data[j].PlayerUserid === null) {
            }

            if (j === i && this.state.data.PlayerUserid !== null) {
              console.log(this.state.data);
              children.push(
                <MDBTable>
                  <MDBTableBody>
                    <tr>
                      <td>{this.state.data[i].userid}</td>
                      <td>{this.state.data[i].wins}</td>
                    </tr>
                  </MDBTableBody>
                </MDBTable>
              );
            }
          }
        }
      }
      //Creates the parent and adds the children
      table.push(<td>{children}</td>);
    }
    return table;
  };

  render() {
    return (
      <MDBTable scrollY maxHeight="70vh" striped boredered centered small>
        {this.createTable()}
      </MDBTable>
    );
  }
}
