import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Container, Nav, Navbar, Button, NavDropdown } from "react-bootstrap";
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
import AuthStatus from "./components/common/AuthStatus";
import UserProfile from "./components/common/UserProfile";

function App() {
  // Synchronously capture session parameters on first load to avoid race conditions
  if (typeof window !== 'undefined' && !window.__sessionSyncDone) {
    try {
      const url = new URL(window.location.href);
      const uid = url.searchParams.get('uid') || url.searchParams.get('userId');
      const uname = url.searchParams.get('username');
      const r = url.searchParams.get('role');
      console.log('🔄 Business App - URL params detected:', { uid, uname, r });
      if (uid && uname && r) {
        localStorage.setItem('userId', uid);
        localStorage.setItem('username', uname);
        localStorage.setItem('role', r);
        console.log('✅ Business App - URL params synced to localStorage');
        url.searchParams.delete('uid');
        url.searchParams.delete('userId');
        url.searchParams.delete('username');
        url.searchParams.delete('role');
        window.history.replaceState({}, document.title, url.pathname);
      }
    } catch (error) {
      console.error('Error syncing URL params:', error);
    }
    window.__sessionSyncDone = true;
  }

  const [userRole, setUserRole] = useState(() => {
    const role = localStorage.getItem('role');
    console.log('🔍 Business App - Initial userRole from localStorage:', role);
    return role;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const uid = localStorage.getItem('userId');
    const uname = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const loggedIn = Boolean(uid && uname && role);
    console.log('🔍 Business App - Initial isLoggedIn:', loggedIn, { uid, uname, role });
    return loggedIn;
  });
  const [username, setUsername] = useState(() => {
    const uname = localStorage.getItem('username');
    console.log('🔍 Business App - Initial username from localStorage:', uname);
    return uname;
  });

  // Check user role from localStorage
  const checkUserRole = () => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    console.log('🔍 Business App - checkUserRole called:', { userId, username, role });
    
    if (userId && username && role) {
      setUserRole(role);
      setIsLoggedIn(true);
      setUsername(username);
      console.log('✅ Business App - User logged in with role:', role);
    } else {
      setUserRole(null);
      setIsLoggedIn(false);
      setUsername(null);
      console.log('❌ Business App - User not logged in');
    }
  };

  useEffect(() => {
    // Sync from URL params if present
    try {
      const url = new URL(window.location.href);
      const uid = url.searchParams.get('uid') || url.searchParams.get('userId');
      const uname = url.searchParams.get('username');
      const r = url.searchParams.get('role');
      if (uid && uname && r) {
        localStorage.setItem('userId', uid);
        localStorage.setItem('username', uname);
        localStorage.setItem('role', r);
        // Clean query params to avoid re-processing on refresh
        url.searchParams.delete('uid');
        url.searchParams.delete('userId');
        url.searchParams.delete('username');
        url.searchParams.delete('role');
        window.history.replaceState({}, document.title, url.pathname);
      }
    } catch {}

    // Check on mount
    checkUserRole();
    
    // Listen for storage changes (when user logs in from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'userId' || e.key === 'username' || e.key === 'role') {
        console.log('Storage change detected:', e.key, e.newValue);
        checkUserRole();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case localStorage was updated in same tab
    const interval = setInterval(() => {
      checkUserRole();
    }, 500); // Check more frequently
    
    // Check when page becomes visible (user might have logged in in another tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkUserRole();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg" className="px-2">
          <Container>
            <Navbar.Brand as={Link} to="/" className="text-white">
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
                {(userRole === 'Resident' || userRole === 'CommunityOrganizer' || !isLoggedIn) && (
                  <>
                    <Nav.Link as={Link} to="/resident/bulletinboard">Bulletin Board</Nav.Link>
                    <Nav.Link as={Link} to="/resident/marketplace">Marketplace</Nav.Link>
                    <Nav.Link as={Link} to="/resident/neighborhoodhelprequests">Help Requests</Nav.Link>
                  </>
                )}
              </Nav>
              <Nav className="ms-auto">
                {isLoggedIn ? (
                  <NavDropdown 
                    title={<span className="text-white">{username || 'Account'} <i className="bi bi-chevron-down"></i></span>} 
                    align="end" 
                    menuVariant="dark"
                    className="text-white"
                  >
                    <NavDropdown.Item onClick={() => window.location.href = '/profile'}>
                      View Profile
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => {
                      localStorage.removeItem('userId');
                      localStorage.removeItem('username');
                      localStorage.removeItem('role');
                      window.location.href = '/';
                    }}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
            <Button 
              variant="primary" 
              onClick={() => { window.location.href = 'http://127.0.0.1:5173'; }}
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
                  console.log('🎯 Business App - Route decision:', { isLoggedIn, userRole });
                  if (!isLoggedIn) {
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
                  } else if (userRole === 'BusinessOwner') {
                    console.log('🏢 Business App - Showing BusinessDashboard for BusinessOwner');
                    return <BusinessDashboard />;
                  } else {
                    console.log('🏘️ Business App - Showing ResidentDashboard for role:', userRole);
                    return <ResidentDashboard />;
                  }
                })()
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

            {/* Resident routes - publicly viewable (actions gated inside components) */}
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

            {/* Authentication routes */}
            <Route path="/auth" element={<AuthStatus />} />
            <Route path="/profile" element={<UserProfile />} />
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
                  onClick={() => window.location.href = 'http://127.0.0.1:5173/'}
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
