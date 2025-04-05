import React, { useState } from 'react';
import { Card, Row, Col, Button, Badge, Modal } from 'react-bootstrap';
import { format } from 'date-fns';
import { useMutation } from '@apollo/client';
import { DELETE_OFFER } from '../../graphql/mutations';

const OffersList = ({ offers, onEditClick }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [deleteOffer] = useMutation(DELETE_OFFER, {
    onCompleted: () => {
      setShowDeleteModal(false);
      window.location.reload(); // Simple refresh - in a real app you'd use the cache
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
                      Expires: {format(new Date(offer.expiresAt), 'MMM d, yyyy')}
                    </small>
                  </p>
                )}
                
                <p className="text-muted mb-3">
                  <small>
                    Created: {format(new Date(offer.createdAt), 'MMM d, yyyy')}
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
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OffersList;