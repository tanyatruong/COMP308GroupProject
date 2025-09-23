import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Container, Nav, Navbar, Button, NavDropdown } from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext';

// Business components
import BusinessDashboard from "./business/BusinessDashboard";
import BusinessProfile from "./business/BusinessProfile";
import OffersList from "./business/Offers/OffersList";
import CreateOffer from "./business/Offers/CreateOffer";
import ReviewsList from "./business/Reviews/ReviewsList";
import CreateBusinessProfile from "./business/CreateBusinessProfile";

// Resident components - using simplified versions for now
import { 
  SimpleResidentDashboard, 
  SimpleBulletinBoard, 
  SimpleMarketplace, 
  SimpleNeighborhoodHelpRequests 
} from "./SimpleResidentComponents";
import AuthStatus from "./common/AuthStatus";
import UserProfile from "./common/UserProfile";

const AuthenticatedApp = () => {
  const { user, loading, logout } = useAuth();

  // Add CSS for dropdown fix
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Username toggle: match dark navbar/button styling */
      .navbar .user-dropdown > .dropdown-toggle,
      .navbar .user-dropdown > .nav-link.dropdown-toggle {
        background-color: #212529 !important; /* same as navbar */
        border: 1px solid rgba(255,255,255,0.15) !important;
        color: #fff !important;
        border-radius: .5rem !important;
        padding: .375rem .75rem !important;
        line-height: 1.2 !important;
        box-shadow: none !important;
      }
      .navbar .user-dropdown.show > .dropdown-toggle,
      .navbar .user-dropdown > .dropdown-toggle:focus,
      .navbar .user-dropdown > .dropdown-toggle:hover,
      .navbar .user-dropdown > .nav-link.dropdown-toggle:focus,
      .navbar .user-dropdown > .nav-link.dropdown-toggle:hover {
        background-color: #2b3035 !important; /* hover like nav */
        border-color: rgba(255,255,255,0.25) !important;
        color: #fff !important;
        box-shadow: 0 0 0 .2rem rgba(13,110,253,0.15) !important; /* subtle focus */
      }
      .navbar .user-dropdown > .dropdown-toggle::after,
      .navbar .user-dropdown > .nav-link.dropdown-toggle::after { filter: invert(1); }
      .user-dropdown .dropdown-menu {
        z-index: 1050 !important;
        min-width: 220px;
        background-color: #212529 !important; /* dark */
        color: #f8f9fa !important;
        border: 1px solid rgba(255,255,255,0.1) !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.35) !important;
      }
      .user-dropdown .dropdown-item {
        padding: 10px 16px;
        color: #f8f9fa !important;
        background: transparent !important;
      }
      .user-dropdown .dropdown-item:hover {
        background-color: rgba(255,255,255,0.08) !important;
        color: #fff !important;
      }
      .user-dropdown .dropdown-divider { border-top: 1px solid rgba(255,255,255,0.15) !important; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg" className="px-2">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-white">
            {user?.role === 'BusinessOwner' ? 'Business Dashboard' : 
             user?.role === 'Resident' ? 'Resident Community Hub' : 
             user?.role === 'CommunityOrganizer' ? 'Community Organizer Hub' :
             'Community Platform'}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user?.role === 'BusinessOwner' && (
                <>
                  <Nav.Link as={Link} to="/business/profile">Profile</Nav.Link>
                  <Nav.Link as={Link} to="/business/offers">Promotions</Nav.Link>
                  <Nav.Link as={Link} to="/business/reviews">Reviews</Nav.Link>
                </>
              )}
              {(user?.role === 'Resident' || user?.role === 'CommunityOrganizer' || !user) && (
                <>
                  <Nav.Link as={Link} to="/resident/bulletinboard">Bulletin Board</Nav.Link>
                  <Nav.Link as={Link} to="/resident/marketplace">Marketplace</Nav.Link>
                  <Nav.Link as={Link} to="/resident/neighborhoodhelprequests">Help Requests</Nav.Link>
                </>
              )}
            </Nav>
            <Nav className="ms-auto">
              {user ? (
                <NavDropdown 
                  title={<span className="text-white">{user.username || 'Account'} <i className="bi bi-chevron-down"></i></span>} 
                  align="end" 
                  menuVariant="dark"
                  className="user-dropdown"
                >
                  <NavDropdown.Item onClick={() => window.location.href = '/profile'}>
                    <i className="bi bi-person me-2"></i>View Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={() => { window.location.href = import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5173'; }}
                >
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="mt-3">
        <Routes>
          {/* Default route - role-based */}
          <Route
            path="/"
            element={
              (() => {
                console.log('🎯 Business App - Route decision:', { user });
                if (!user) {
                  console.log('👋 Business App - Showing welcome page (not logged in)');
                  return (
                    <div className="text-center p-5">
                      <h2>Welcome to the Community Platform</h2>
                      <p className="lead">Connect with your community and local businesses</p>
                      <div className="d-flex justify-content-center gap-3">
                        <Button 
                          variant="primary" 
                          onClick={() => { window.location.href = 'http://127.0.0.1:5173'; }}
                        >
                          Login
                        </Button>
                      </div>
                      <div className="mt-4">
                        <p className="text-muted">
                          <i className="bi bi-people me-2"></i>
                          Browse community posts, marketplace, and help requests
                        </p>
                      </div>
                    </div>
                  );
                } else if (user.role === 'BusinessOwner') {
                  console.log('🏢 Business App - Showing BusinessDashboard for BusinessOwner');
                  return <BusinessDashboard />;
                  } else {
                    console.log('🏘️ Business App - Showing SimpleResidentDashboard for role:', user.role);
                    return <SimpleResidentDashboard />;
                  }
              })()
            }
          />

          {/* Business routes - only accessible to BusinessOwner */}
          {user?.role === 'BusinessOwner' && (
            <>
              <Route path="/business" element={<BusinessDashboard />} />
              <Route path="/business/profile" element={<BusinessProfile onlyDisplay={true} />}/>
              <Route path="/business/create-profile" element={<CreateBusinessProfile />} />
              <Route path="/business/offers" element={<OffersList />} />
              <Route path="/business/create-offer" element={<CreateOffer />} />
              <Route path="/business/reviews" element={<ReviewsList />} />
            </>
          )}

          {/* Resident routes - using simplified components */}
          <Route path="/resident" element={<SimpleResidentDashboard />} />
          <Route path="/resident/bulletinboard" element={<SimpleBulletinBoard />} />
          <Route path="/resident/marketplace" element={<SimpleMarketplace />} />
          <Route
            path="/resident/neighborhoodhelprequests"
            element={<SimpleNeighborhoodHelpRequests />}
          />

          {/* Authentication routes */}
          <Route path="/auth" element={<AuthStatus />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={
            <div className="text-center p-5">
              <h2>Please use the Auth App at <a href={import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5173'} target="_blank" rel="noopener noreferrer">{import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5173'}</a></h2>
            </div>
          } />
          
          {/* Test files - allow access */}
          <Route path="/test-session.html" element={
            <div className="text-center p-5">
              <h2>Test Session Page</h2>
              <p>This page should be accessed via the shell app at <a href={`${import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5173'}/test-session.html`} target="_blank">{import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5173'}/test-session.html</a></p>
              <Button 
                variant="primary" 
                onClick={() => window.location.href = `${import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5173'}/test-session.html`}
              >
                Open Test Page
              </Button>
            </div>
          } />
          <Route path="/test-login.html" element={
            <div className="text-center p-5">
              <h2>Test Login Page</h2>
              <p>This page should be accessed via the shell app at <a href={`${import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5173'}/test-login.html`} target="_blank">{import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5173'}/test-login.html</a></p>
              <Button 
                variant="primary" 
                onClick={() => window.location.href = `${import.meta.env.VITE_AUTH_APP_URL || 'http://localhost:5173'}/test-login.html`}
              >
                Open Test Page
              </Button>
            </div>
          } />

          {/* Fallback for unauthorized access */}
          <Route path="*" element={
            <div className="text-center p-5">
              <h2>Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
              <Button 
                variant="primary" 
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </div>
          } />
        </Routes>
      </Container>
    </div>
  );
};

export default AuthenticatedApp;
