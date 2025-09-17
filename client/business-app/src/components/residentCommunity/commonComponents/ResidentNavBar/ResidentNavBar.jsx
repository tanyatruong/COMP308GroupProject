import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import "./ResidentNavBar.css";


const ResidentNavBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    setIsLoggedIn(!!(role && username));
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate('/');
  }
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary mb-2">
        <Container>
          <Navbar.Brand href="/residentdashboard">Resident Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/resident/bulletinboard">Bulletin Board</Nav.Link>
              <Nav.Link href="/resident/neighborhoodhelprequests">
                Neighborhood help requests
              </Nav.Link>
              <Nav.Link href="/resident/marketplace">Marketplace</Nav.Link>
              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
            <Nav className="ms-auto">
              {isLoggedIn ? (
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Button variant="primary" onClick={() => window.open('http://localhost:3001', '_blank')}>
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default ResidentNavBar;
