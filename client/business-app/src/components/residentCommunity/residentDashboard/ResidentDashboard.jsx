import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Nav,
  Tab,
  Alert,
} from "react-bootstrap";

import ResidentNavBar from "../commonComponents/ResidentNavBar/ResidentNavBar";

const ResidentDashboard = () => {
  return (
    <>
      {/* <ResidentNavBar style={{ "margin-bottom": "2rem" }}></ResidentNavBar> */}
      <ResidentNavBar></ResidentNavBar>
      {/* <h1>Resident Dashboard</h1>
       */}
      <Row className="mt-2">
        <Col>
          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src="../../../../public/bulletinBoard.png"
            />
            <Card.Body>
              <Card.Title>Bulletin Board</Card.Title>
              <Card.Text>
                Post or interact with: local updates, news, and discuss topics.
              </Card.Text>
              <Link to="/resident/bulletinboard" className="btn btn-primary">
                Bulletin Board
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: "18rem" }}>
            <Card.Img
              variant="top"
              src="../../../../public/neighborhoodhelprequests_1.png"
            />
            <Card.Body>
              <Card.Title>Neighborhood Help Requests</Card.Title>
              <Card.Text>
                Request help of, or give help to, your community
              </Card.Text>
              <Button
                variant="primary"
                href="/resident/neighborhoodhelprequests"
              >
                Neighborhood Help Requests
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src="../../../../public/marketplace.png" />
            <Card.Body>
              <Card.Title>Marketplace</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <Button variant="primary" href="/resident/marketplace">
                Marketplace
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ResidentDashboard;
