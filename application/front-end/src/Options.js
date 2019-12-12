import React, { Component } from "react";
// eslint-disable-next-line import/no-unresolved
import Header from "./components/header";
import OptionSelector from "./components/optionSelector";
import { SketchPicker } from "react-color";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage
} from "mdbreact";

class Options extends Component {
  state = {
    background: "#fff"
  };

  handleChangeComplete = (color, event) => {
    this.setState({ background: color.hex });
  };

  render() {
    return (
      <div style={{ backgroundColor: this.state.background }}>
        <Header />
        <MDBContainer className="options">
          <MDBRow className="justify-content-center">
            <MDBCol>
              <MDBCard bg={this.state.background}>
                <MDBCardBody>
                  <MDBCardTitle>Player Info</MDBCardTitle>
                  <MDBCardImage
                    variant="bottom"
                    src="https://i1.wp.com/postmatura.al/wp-content/uploads/2018/10/blank-profile-picture-png.png?fit=512%2C512&ssl=1"
                  />
                  <MDBCardText>Name</MDBCardText>
                  <MDBCardText>Rank 3</MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <OptionSelector />

              <OptionSelector />

              <SketchPicker
                color={this.state.background}
                onChange={this.handleChangeComplete}
              />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}
export default Options;
