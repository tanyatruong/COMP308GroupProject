import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import './App.css';

// Import components
import BusinessDashboard from './components/BusinessDashboard/BusinessDashboard';
import CreateBusinessProfile from './components/BusinessProfile/CreateBusinessProfile';
import EditBusinessProfile from './components/BusinessProfile/EditBusinessProfile';
import BusinessProfileView from './components/BusinessProfile/BusinessProfileView';
import OffersList from './components/Offers/OffersList';
import CreateOffer from './components/Offers/CreateOffer';
import EditOffer from './components/Offers/EditOffer';
import ReviewsList from './components/Reviews/ReviewsList';
import ErrorMessage from './components/UI/ErrorMessage';
import Loader from './components/UI/Loader';

// GraphQL query to check business profiles
const GET_BUSINESS_PROFILES = gql`
  query GetBusinessProfilesByOwner {
    getBusinessProfilesByOwner {
      id
      businessName
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_BUSINESS_PROFILES);
  const [hasBusinessProfile, setHasBusinessProfile] = useState(false);
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    if (data && data.getBusinessProfilesByOwner) {
      if (data.getBusinessProfilesByOwner.length > 0) {
        setHasBusinessProfile(true);
        setBusinessId(data.getBusinessProfilesByOwner[0].id);
      }
    }
  }, [data]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <Container fluid className="business-app-container">
      <Row>
        {/* Sidebar Navigation */}
        <Col md={3} lg={2} className="sidebar p-0">
          <div className="sidebar-heading p-3">Business Dashboard</div>
          <Nav className="flex-column">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            {hasBusinessProfile ? (
              <>
                <Nav.Link href={`/business/${businessId}`}>Business Profile</Nav.Link>
                <Nav.Link href="/offers">Offers & Promotions</Nav.Link>
                <Nav.Link href="/reviews">Reviews & Responses</Nav.Link>
              </>
            ) : (
              <Nav.Link href="/create-business">Create Business Profile</Nav.Link>
            )}
          </Nav>
        </Col>

        {/* Main Content Area */}
        <Col md={9} lg={10} className="main-content p-4">
          <Routes>
            <Route 
              path="/" 
              element={
                hasBusinessProfile ? 
                <Navigate replace to="/dashboard" /> : 
                <Navigate replace to="/create-business" />
              } 
            />
            <Route path="/dashboard" element={<BusinessDashboard />} />
            <Route path="/create-business" element={<CreateBusinessProfile />} />
            <Route path="/business/:id" element={<BusinessProfileView />} />
            <Route path="/business/:id/edit" element={<EditBusinessProfile />} />
            <Route path="/offers" element={<OffersList />} />
            <Route path="/offers/create" element={<CreateOffer />} />
            <Route path="/offers/:id/edit" element={<EditOffer />} />
            <Route path="/reviews" element={<ReviewsList />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

export default App;