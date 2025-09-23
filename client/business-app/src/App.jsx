import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ApolloProvider } from '@apollo/client';
import { Container, Nav, Navbar, Button, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AuthProvider, client } from './contexts/AuthContext';
import AuthenticatedApp from './components/AuthenticatedApp';

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
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <AuthenticatedApp />
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
