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
import "./ResidentDashboard.css";

const ResidentDashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    if (userId && username && role) {
      setUserRole(role);
      setIsLoggedIn(true);
    } else {
      setUserRole(null);
      setIsLoggedIn(false);
    }
  }, []);

  // Check if user has correct role
  if (isLoggedIn && userRole !== 'Resident' && userRole !== 'CommunityOrganizer') {
    return (
      <div className="text-center p-5">
        <h2>Access Denied</h2>
        <p>This dashboard is only available for Residents and Community Organizers.</p>
        <Button 
          variant="primary" 
          onClick={() => window.location.href = '/'}
        >
          Go Home
        </Button>
      </div>
    );
  }
  return (
    <div className="resident-dashboard">
      <ResidentNavBar />
      
      <div className="dashboard-header">
        <div className="container">
          <h1>🏘️ Resident Community Hub</h1>
          <p>Connect with your neighbors, discover local businesses, and build a stronger community together</p>
        </div>
      </div>

      <div className="container">
        <Row className="g-4">
          <Col lg={4} md={6}>
            <Card className="resident-card">
              <div className="card-img-top d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(45deg, #667eea, #764ba2)', height: '200px'}}>
                <i className="bi bi-chat-dots text-white" style={{fontSize: '4rem'}}></i>
              </div>
              <Card.Body>
                <Card.Title>
                  <i className="bi bi-chat-dots me-2 text-primary"></i>
                  Bulletin Board
                </Card.Title>
                <Card.Text>
                  Share local updates, news, and discuss topics with your neighbors. Stay informed about what's happening in your community.
                </Card.Text>
                <Link to="/resident/bulletinboard" className="btn btn-primary w-100">
                  <i className="bi bi-arrow-right me-2"></i>Visit Bulletin Board
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={6}>
            <Card className="resident-card">
              <div className="card-img-top d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(45deg, #f093fb, #f5576c)', height: '200px'}}>
                <i className="bi bi-heart text-white" style={{fontSize: '4rem'}}></i>
              </div>
              <Card.Body>
                <Card.Title>
                  <i className="bi bi-heart me-2 text-danger"></i>
                  Help Requests
                </Card.Title>
                <Card.Text>
                  Request help from your community or offer assistance to neighbors. Build connections through mutual support and kindness.
                </Card.Text>
                <Link to="/resident/neighborhoodhelprequests" className="btn btn-danger w-100">
                  <i className="bi bi-arrow-right me-2"></i>View Help Requests
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4} md={6}>
            <Card className="resident-card">
              <div className="card-img-top d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(45deg, #4facfe, #00f2fe)', height: '200px'}}>
                <i className="bi bi-shop text-white" style={{fontSize: '4rem'}}></i>
              </div>
              <Card.Body>
                <Card.Title>
                  <i className="bi bi-shop me-2 text-info"></i>
                  Marketplace
                </Card.Title>
                <Card.Text>
                  Discover local businesses, view promotions, and read reviews. Support your community by choosing local services and products.
                </Card.Text>
                <Link to="/resident/marketplace" className="btn btn-info w-100">
                  <i className="bi bi-arrow-right me-2"></i>Explore Marketplace
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ResidentDashboard;
