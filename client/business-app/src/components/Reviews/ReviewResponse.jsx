import React from 'react';
import { Card } from 'react-bootstrap';

const ReviewResponse = ({ response }) => {
  return (
    <Card className="ms-4 mb-2 bg-light border-start border-primary border-3">
      <Card.Body className="py-2">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="mb-0">Your Response</h6>
            <small className="text-muted">
              Responded on {new Date(response.responseDate).toLocaleDateString()}
            </small>
          </div>
        </div>
        <p className="mt-2 mb-0">{response.content}</p>
      </Card.Body>
    </Card>
  );
};

export default ReviewResponse;