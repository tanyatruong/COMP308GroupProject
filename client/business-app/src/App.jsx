import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Business components
import BusinessDashboard from "./components/business/BusinessDashboard";
import BusinessProfile from "./components/business/BusinessProfile";
import OffersList from "./components/business/Offers/OffersList";
import CreateOffer from "./components/business/Offers/CreateOffer";
import ReviewsList from "./components/business/Reviews/ReviewsList";
import CreateBusinessProfile from "./components/business/CreateBusinessProfile";

// Resident components
import ResidentDashboard from "./components/residentCommunity/residentDashboard/ResidentDashboard";
import BulletinBoard from "./components/residentCommunity/BulletinBoard/BulletinBoard";
import Marketplace from "./components/residentCommunity/Marketplace/Marketplace";
import BusinessDetails from "./components/residentCommunity/Marketplace/BusinessDetails";
import NeighborhoodHelpRequests from "./components/residentCommunity/NeighborhoodHelpRequests/NeighborhoodHelpRequests";
import IndividualDiscussion from "./components/residentCommunity/BulletinBoard/IndividualDiscussion";

function App() {
  const [userType, setUserType] = useState("business"); // Default to business view

  // For the View toggle buttons
  const handleBusinessView = () => {
    setUserType("business");
    localStorage.setItem("userType", "business");
    window.location.href = "/business";
  };

  const handleResidentView = () => {
    setUserType("resident");
    localStorage.setItem("userType", "resident");
    window.location.href = "/resident";
  };

  // Initialize userType from localStorage if available
  useEffect(() => {
    const savedUserType = localStorage.getItem("userType");
    if (savedUserType) {
      setUserType(savedUserType);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              Business & Resident Center
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {/* Removed the Dashboard links as requested */}
              </Nav>
              <div className="d-flex">
                <Button
                  variant={
                    userType === "business" ? "primary" : "outline-primary"
                  }
                  onClick={handleBusinessView}
                  className="me-2"
                >
                  Business View
                </Button>
                <Button
                  variant={
                    userType === "resident" ? "primary" : "outline-primary"
                  }
                  onClick={handleResidentView}
                >
                  Resident View
                </Button>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container fluid className="mt-3">
          <Routes>
            {/* Default route */}
            <Route
              path="/"
              element={
                userType === "business" ? (
                  <BusinessDashboard />
                ) : (
                  <ResidentDashboard />
                )
              }
            />

            {/* Business routes */}
            <Route path="/business" element={<BusinessDashboard />} />
            <Route path="/business/profile" element={<BusinessProfile onlyDisplay={true} />}/>
            <Route path="/business/create-profile" element={<CreateBusinessProfile />} />
            
            <Route path="/business/offers" element={<OffersList />} />
            <Route path="/business/create-offer" element={<CreateOffer />} />
            <Route path="/business/reviews" element={<ReviewsList />} />

            {/* Authentication routes */}
            <Route path="/login" element={<div className="text-center p-5"><h2>Please use the Auth App at <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer">http://localhost:3001</a></h2></div>} />
            
            {/* Resident routes */}
            <Route path="/resident" element={<ResidentDashboard />} />
            <Route path="/resident/bulletinboard" element={<BulletinBoard />} />
            <Route path="/resident/marketplace" element={<Marketplace />} />
            <Route
              path="/resident/marketplace/businessdetails/:businessId"
              element={<BusinessDetails />}
            />
            <Route
              path="/resident/neighborhoodhelprequests"
              element={<NeighborhoodHelpRequests />}
            />
            <Route
              path="/resident/bulletinboard/:postId"
              element={<IndividualDiscussion />}
            />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
