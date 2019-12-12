import React, { Component } from "react";
import "./Lobby.css";
import { MDBTable, MDBTableHead, MDBTableBody, Button } from "mdbreact";
export default class ListRoom extends Component {
  constructor() {
    super();
    this.state = {
      data: null
    };
    this.getLobbies = this.getLobbies.bind(this);
  }

  getLobbies() {
    fetch(this.props.link)
      .then(response => response.json())
      .then(res => {
        this.setState(
          {
            data: res
          },
          () => console.log()
        );
      });
  }
  componentDidMount() {
    this.getLobbies();
  }
  handleRouteChange(link) {
    window.open("Game/" + link.gameid);
  }
  //Create a table function
  createTable = () => {
    let table = []; //Sets empty table
    let children = [];
    if (this.state.data !== null) {
      if (this.state.data.length === 0) {
        children.push(
          <div class="lobby_NoGames">
            {"No games available... please create one."}
          </div>
        );
      } else {
        children.push(
          <MDBTable>
            <MDBTableHead>
              <tr class="lobby_Games">
                <th scope="col"> {"GameID: "}</th>
                <th scope="col">{"Host:"}</th>
                <th scope="col" style={{ color: "white" }}>
                  {"-"}
                </th>
                <th scope="col" style={{ color: "white" }}>
                  {"-----------------------------------"}
                </th>
              </tr>
            </MDBTableHead>
          </MDBTable>
        );

        for (let i = 0; i < this.state.data.length; i++) {
          //Inner loop to create children
          for (let j = 0; j < this.state.data.length; j++) {
            var playerCount = "2/2";
            if (this.state.data[j].PlayerUserid === null) {
              playerCount = "1/2";
            }

            if (j === i && this.state.data.PlayerUserid !== null) {
              console.log(this.state.data);
              children.push(
                <MDBTable>
                  <MDBTableBody>
                    <tr>
                      <td>{this.state.data[i].gameid}</td>
                      <td>{this.state.data[i].HostUserid}</td>
                      <td>{playerCount}</td>
                      <td>
                        <Button
                          size="sm"
                          onClick={() =>
                            this.handleRouteChange(this.state.data[i])
                          }
                        >
                          Join
                        </Button>
                      </td>
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
