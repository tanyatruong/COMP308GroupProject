import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Modal, Alert } from 'react-bootstrap';
import { format } from 'date-fns';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_OFFER } from '../../../graphql/mutations';
import { GET_BUSINESS_PROFILE } from '../../../graphql/queries';

const OffersList = ({ offers: propOffers, onEditClick }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user ID from localStorage
  const userId = localStorage.getItem('userId') || '67fbccd0b088a381cdcef65c';

  // Query business profile if offers weren't passed as props
  const { 
    loading: profileLoading, 
    error: profileError, 
    data: profileData 
  } = useQuery(GET_BUSINESS_PROFILE, {
    variables: { ownerId: userId },
    fetchPolicy: 'network-only',
    skip: Array.isArray(propOffers)
  });

  useEffect(() => {
    // If offers are passed as props, use those
    if (Array.isArray(propOffers)) {
      setOffers(propOffers);
      setLoading(false);
      setError(null);
    }
    // Otherwise try to get offers from the query result
    else if (profileData && profileData.businessProfileByOwner) {
      const businessOffers = profileData.businessProfileByOwner.offers || [];
      setOffers(businessOffers);
      setLoading(false);
      setError(null);
    } 
    // Set loading state based on query loading
    else if (profileLoading) {
      setLoading(true);
    }
    // Set error state if query error
    else if (profileError) {
      setError(profileError.message);
      setLoading(false);
    }
  }, [propOffers, profileData, profileLoading, profileError]);

  const [deleteOffer, { loading: deleteLoading }] = useMutation(DELETE_OFFER, {
    onCompleted: () => {
      setShowDeleteModal(false);
      // Update local state to remove the deleted offer
      setOffers(offers.filter(offer => offer.id !== selectedOffer.id));
    },
    onError: (error) => {
      setError(error.message);
      setShowDeleteModal(false);
    }
  });

  const handleDeleteClick = (offer) => {
    setSelectedOffer(offer);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedOffer) {
      deleteOffer({ variables: { id: selectedOffer.id } });
    }
  };

  // Handle loading state
  if (loading) {
    return <div className="text-center p-5">Loading offers...</div>;
  }

  // Handle error state
  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        Error loading offers: {error}
      </Alert>
    );
  }

  // Handle empty offers
  if (!offers || offers.length === 0) {
    return (
      <div className="text-center p-5">
        <p className="mb-4">You haven't created any promotions yet.</p>
        <p>Create promotions to attract more customers to your business!</p>
      </div>
    );
  }

  return (
    <div>
      <Row>
        {offers.map(offer => (
          <Col md={6} lg={4} key={offer.id} className="mb-4">
            <Card className={!offer.isActive ? 'border-danger' : ''}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title>{offer.title}</Card.Title>
                  {!offer.isActive && (
                    <Badge bg="danger">Inactive</Badge>
                  )}
                </div>
                <Card.Text>{offer.content}</Card.Text>
                
                {offer.expiresAt && (
                  <p className="text-muted mb-2">
                    <small>
                      {/* Expires: {format(new Date(offer.expiresAt), 'MMM d, yyyy')} */}
                    </small>
                  </p>
                )}
                
                <p className="text-muted mb-3">
                  <small>
                    {/* Created: {format(new Date(offer.createdAt), 'MMM d, yyyy')} */}
                  </small>
                </p>

                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => onEditClick?.(offer)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDeleteClick(offer)}
                    disabled={deleteLoading}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the promotion "{selectedOffer?.title}"? 
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OffersList;