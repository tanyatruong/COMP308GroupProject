import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { GET_BUSINESS_PROFILES, GET_OFFERS_BY_BUSINESS } from '../../graphql/queries';
import { DELETE_OFFER } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';
import OfferCard from './OfferCard';

const OffersList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'expired'
  
  // Get business profiles
  const { loading: businessLoading, error: businessError, data: businessData } = useQuery(GET_BUSINESS_PROFILES);
  
  // Get offers for the first business
  const businessId = businessData?.getBusinessProfilesByOwner[0]?.id;
  const { loading: offersLoading, error: offersError, data: offersData, refetch } = useQuery(GET_OFFERS_BY_BUSINESS, {
    variables: { businessId },
    skip: !businessId
  });
  
  // Delete offer mutation
  const [deleteOffer, { loading: deleteLoading }] = useMutation(DELETE_OFFER, {
    onCompleted: () => {
      refetch();
    }
  });
  
  const loading = businessLoading || offersLoading;
  const error = businessError || offersError;
  
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  
  if (!businessId) {
    return (
      <Container>
        <ErrorMessage message="You need to create a business profile first." />
        <Button 
          variant="primary" 
          onClick={() => navigate('/create-business')}
          className="mt-3"
        >
          Create Business Profile
        </Button>
      </Container>
    );
  }
  
  const offers = offersData?.getOffersByBusiness || [];
  
  // Filter offers based on current filter
  const filteredOffers = offers.filter(offer => {
    const now = new Date();
    if (filter === 'active') {
      return !offer.endDate || new Date(offer.endDate) >= now;
    } else if (filter === 'expired') {
      return offer.endDate && new Date(offer.endDate) < now;
    }
    return true;
  });
  
  const handleDeleteOffer = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      deleteOffer({ variables: { id } });
    }
  };
  
  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Offers & Promotions</h1>
        <Button 
          variant="primary" 
          onClick={() => navigate('/offers/create')}
        >
          <FaPlus className="me-2" /> Create New Offer
        </Button>
      </div>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Offers</option>
              <option value="active">Active Offers</option>
              <option value="expired">Expired Offers</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6} className="text-end">
          <p className="mb-0 mt-2">
            {filteredOffers.length} offers found
            {filter === 'active' && (
              <Badge bg="success" className="ms-2">
                {filteredOffers.length} Active
              </Badge>
            )}
          </p>
        </Col>
      </Row>
      
      {filteredOffers.length === 0 ? (
        <Card className="shadow-sm">
          <Card.Body className="text-center p-5">
            <h4 className="text-muted">No offers found</h4>
            <p>Create a new offer to promote your business.</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/offers/create')}
            >
              <FaPlus className="me-2" /> Create New Offer
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredOffers.map(offer => (
            <Col md={6} lg={4} key={offer.id} className="mb-4">
              <OfferCard 
                offer={offer}
                onDelete={handleDeleteOffer}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default OffersList;