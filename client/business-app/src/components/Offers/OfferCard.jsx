// Reusable offer card component
// Offer Card component for displaying individual offers in a list.
// This component is responsible for rendering the offer details, including title, content, start and end dates, and action buttons for editing and deleting the offer.
import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const OfferCard = ({ offer, onDelete }) => {
  const navigate = useNavigate();

  const isActive = () => {
    return !offer.endDate || new Date(offer.endDate) >= new Date();
  };

  return (
    <Card className="h-100 shadow-sm hover-card">
      <Card.Body className="position-relative">
        <div className="position-absolute top-0 end-0 pt-2 pe-2">
          {isActive() ? (
            <Badge bg="success">Active</Badge>
          ) : (
            <Badge bg="secondary">Expired</Badge>
          )}
        </div>
        <h5 className="mt-2 mb-3">{offer.title}</h5>
        <p className="text-muted" style={{ minHeight: '60px' }}>{offer.content}</p>
        
        <div className="mt-auto mb-2">
          <div className="small text-muted">
            <div>
              Start: {new Date(offer.startDate).toLocaleDateString()}
            </div>
            {offer.endDate && (
              <div>
                End: {new Date(offer.endDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between bg-white">
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={() => navigate(`/offers/${offer.id}/edit`)}
        >
          <FaEdit className="me-1" /> Edit
        </Button>
        <Button 
          variant="outline-danger" 
          size="sm"
          onClick={() => onDelete(offer.id)}
        >
          <FaTrash className="me-1" /> Delete
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default OfferCard;