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
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check user role from localStorage
  const checkUserRole = () => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    console.log('Checking user role:', { userId, username, role });
    
    if (userId && username && role) {
      setUserRole(role);
      setIsLoggedIn(true);
    } else {
      setUserRole(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // Check on mount
    checkUserRole();
    
    // Listen for storage changes (when user logs in from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'userId' || e.key === 'username' || e.key === 'role') {
        checkUserRole();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case localStorage was updated in same tab
    const interval = setInterval(checkUserRole, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              {userRole === 'BusinessOwner' ? 'Business Dashboard' : 
               userRole === 'Resident' ? 'Resident Community Hub' : 
               userRole === 'CommunityOrganizer' ? 'Community Organizer Hub' :
               'Community Platform'}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {isLoggedIn && userRole === 'BusinessOwner' && (
                  <>
                    <Nav.Link as={Link} to="/business/profile">Profile</Nav.Link>
                    <Nav.Link as={Link} to="/business/offers">Promotions</Nav.Link>
                    <Nav.Link as={Link} to="/business/reviews">Reviews</Nav.Link>
                  </>
                )}
                {isLoggedIn && (userRole === 'Resident' || userRole === 'CommunityOrganizer') && (
                  <>
                    <Nav.Link as={Link} to="/resident/bulletinboard">Bulletin Board</Nav.Link>
                    <Nav.Link as={Link} to="/resident/marketplace">Marketplace</Nav.Link>
                    <Nav.Link as={Link} to="/resident/neighborhoodhelprequests">Help Requests</Nav.Link>
                  </>
                )}
              </Nav>
              <Nav className="ms-auto">
                {isLoggedIn ? (
                  <Button 
                    variant="outline-light" 
                    onClick={() => {
                      localStorage.removeItem('userId');
                      localStorage.removeItem('username');
                      localStorage.removeItem('role');
                      window.location.reload();
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={() => window.open('http://localhost:5173', '_blank')}
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
                !isLoggedIn ? (
                  <div className="text-center p-5">
                    <h2>Welcome to the Community Platform</h2>
                    <p>Please log in to access your dashboard</p>
                    <div className="d-flex justify-content-center gap-3">
                      <Button 
                        variant="primary" 
                        onClick={() => window.open('http://localhost:5173', '_blank')}
                      >
                        Login
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => window.location.reload()}
                      >
                        Refresh Status
                      </Button>
                    </div>
                    <p className="text-muted mt-3 small">
                      If you just logged in, click "Refresh Status" to update your session
                    </p>
                    <div className="mt-3 p-3 bg-light rounded">
                      <small className="text-muted">
                        Debug Info: User Role: {userRole || 'None'}, Logged In: {isLoggedIn ? 'Yes' : 'No'}<br/>
                        Check browser console for detailed localStorage values
                      </small>
                      <div className="mt-2 d-flex gap-2">
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => {
                            console.log('Current localStorage:', {
                              userId: localStorage.getItem('userId'),
                              username: localStorage.getItem('username'),
                              role: localStorage.getItem('role')
                            });
                            checkUserRole();
                          }}
                        >
                          Debug localStorage
                        </Button>
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => {
                            // Test with demo business owner
                            localStorage.setItem('userId', '67fbccd0b088a381cdcef65c');
                            localStorage.setItem('username', 'tony_restaurant');
                            localStorage.setItem('role', 'BusinessOwner');
                            console.log('Set test localStorage for BusinessOwner');
                            checkUserRole();
                          }}
                        >
                          Test Business Login
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : userRole === 'BusinessOwner' ? (
                  <BusinessDashboard />
                ) : (
                  <ResidentDashboard />
                )
              }
            />

            {/* Business routes - only accessible to BusinessOwner */}
            {isLoggedIn && userRole === 'BusinessOwner' && (
              <>
                <Route path="/business" element={<BusinessDashboard />} />
                <Route path="/business/profile" element={<BusinessProfile onlyDisplay={true} />}/>
                <Route path="/business/create-profile" element={<CreateBusinessProfile />} />
                <Route path="/business/offers" element={<OffersList />} />
                <Route path="/business/create-offer" element={<CreateOffer />} />
                <Route path="/business/reviews" element={<ReviewsList />} />
              </>
            )}

            {/* Resident routes - accessible to Resident and CommunityOrganizer */}
            {isLoggedIn && (userRole === 'Resident' || userRole === 'CommunityOrganizer') && (
              <>
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
              </>
            )}

            {/* Authentication routes */}
            <Route path="/login" element={
              <div className="text-center p-5">
                <h2>Please use the Auth App at <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer">http://localhost:5173</a></h2>
              </div>
            } />
            
            {/* Fallback for unauthorized access */}
            <Route path="*" element={
              <div className="text-center p-5">
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
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
    </Router>
  );
}

export default App;
