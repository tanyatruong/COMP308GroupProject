import React, { useState, useEffect } from "react";
import ResidentNavBar from "../commonComponents/ResidentNavBar/ResidentNavBar";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";

const NeighborhoodHelpRequests = () => {
  return (
    <>
      <ResidentNavBar />
      <Container id="filterBarContainer">
        <Row>
          <Col id="filterButtonAllPosts">
            <Button variant="primary">Primary</Button>
          </Col>
          <Col id="filterButtonMyPosts">
            <Button variant="primary">Primary</Button>
          </Col>
        </Row>
      </Container>
      <h1>NeighborhoodHelpRequests</h1>;
    </>
  );
};

export default NeighborhoodHelpRequests;
