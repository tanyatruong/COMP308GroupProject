import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaStar, FaEdit, FaPlus } from 'react-icons/fa';
import { GET_BUSINESS_PROFILE } from '../../graphql/queries';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';

const BusinessProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_BUSINESS_PROFILE, {
    variables: { id }
  });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  const { businessName, description, location, averageRating, businessTags, images } = data.getBusinessProfile;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Business Profile</h1>
        <Button variant="primary" onClick={() => navigate(`/business/${id}/edit`)}>
          <FaEdit className="me-2" /> Edit Profile
        </Button>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={8}>
              <h2>{businessName}</h2>
              <div className="mb-3 d-flex align-items-center">
                {averageRating > 0 ? (
                  <>
                    <div className="me-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`me-1 ${i < Math.round(averageRating) ? 'text-warning' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <span>{averageRating.toFixed(1)} average rating</span>
                  </>
                ) : (
                  <span className="text-muted">No ratings yet</span>
                )}
              </div>
              <p className="lead mb-4">{description}</p>
              
              <h5>Address:</h5>
              <p>
                {location.address}<br />
                {location.city}, {location.postalCode}
              </p>

              <div className="mt-4">
                <h5>Business Tags:</h5>
                <div className="d-flex flex-wrap">
                  {businessTags && businessTags.length > 0 ? (
                    businessTags.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="me-2 mb-2 py-2 px-3 rounded-pill">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted">No tags added</p>
                  )}
                </div>
              </div>
            </Col>
            <Col md={4}>
              {images && images.length > 0 ? (
                <div>
                  <img 
                    src={images[0]} 
                    alt={businessName} 
                    className="img-fluid rounded w-100 mb-2"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  {images.length > 1 && (
                    <Row className="mt-2">
                      {images.slice(1, 4).map((img, index) => (
                        <Col key={index} xs={4}>
                          <img 
                            src={img} 
                            alt={`${businessName} ${index + 2}`} 
                            className="img-fluid rounded w-100"
                            style={{ height: '60px', objectFit: 'cover' }}
                          />
                        </Col>
                      ))}
                    </Row>
                  )}
                </div>
              ) : (
                <div className="bg-light rounded d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                  <div className="text-center text-muted">
                    <p>No images available</p>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="mt-4 d-flex justify-content-between">
        <Button 
          variant="success" 
          onClick={() => navigate('/offers/create')}
          className="me-2"
        >
          <FaPlus className="me-2" /> Create New Offer
        </Button>
        <Button 
          variant="outline-primary" 
          onClick={() => navigate('/offers')}
        >
          View All Offers
        </Button>
      </div>
    </Container>
  );
};

export default BusinessProfileView;