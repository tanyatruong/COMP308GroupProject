import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CREATE_OFFER } from '../../graphql/mutations';
import { GET_BUSINESS_PROFILES, GET_OFFERS_BY_BUSINESS } from '../../graphql/queries';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';
import SuccessMessage from '../UI/SuccessMessage';

const CreateOffer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [],
    startDate: new Date().toISOString().split('T')[0], // Today in YYYY-MM-DD format
    endDate: ''
  });
  const [success, setSuccess] = useState(false);

  // Get business profiles
  const { loading: businessLoading, error: businessError, data: businessData } = useQuery(GET_BUSINESS_PROFILES);
  
  // Get business ID
  const businessId = businessData?.getBusinessProfilesByOwner[0]?.id;

  // Create offer mutation
  const [createOffer, { loading: createLoading, error: createError }] = useMutation(CREATE_OFFER, {
    variables: {
      input: {
        ...formData,
        businessId
      }
    },
    onCompleted: () => {
      setSuccess(true);
      // Redirect to offers list after 2 seconds
      setTimeout(() => {
        navigate('/offers');
      }, 2000);
    },
    refetchQueries: [
      { 
        query: GET_OFFERS_BY_BUSINESS, 
        variables: { businessId } 
      }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createOffer();
  };

  if (businessLoading) return <Loader />;
  if (businessError) return <ErrorMessage message={businessError.message} />;

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

  return (
    <Container>
      <h1 className="mb-4">Create New Offer</h1>
      {createError && <ErrorMessage message={createError.message} />}
      {success && <SuccessMessage message="Offer created successfully!" />}
      
      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Offer Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="E.g., Special Weekend Discount, Buy One Get One Free"
              />
              <Form.Text className="text-muted">
                Make it catchy to attract customers' attention
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Offer Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Describe your offer in detail"
              />
              <Form.Text className="text-muted">
                Include important details like discount percentages, conditions, etc.
              </Form.Text>
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date (Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                  />
                  <Form.Text className="text-muted">
                    Leave blank for ongoing offers
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => navigate('/offers')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={createLoading}>
                {createLoading ? 'Creating...' : 'Create Offer'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateOffer;