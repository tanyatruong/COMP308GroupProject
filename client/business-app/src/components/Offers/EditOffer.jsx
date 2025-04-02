import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { UPDATE_OFFER } from '../../graphql/mutations';
import { GET_OFFER, GET_OFFERS_BY_BUSINESS } from '../../graphql/queries';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';
import SuccessMessage from '../UI/SuccessMessage';

const EditOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [],
    startDate: '',
    endDate: '',
    businessId: ''
  });
  const [success, setSuccess] = useState(false);

  // Get offer data
  const { loading: offerLoading, error: offerError, data: offerData } = useQuery(GET_OFFER, {
    variables: { id },
    onCompleted: (data) => {
      const { title, content, images, startDate, endDate, business } = data.getOffer;
      
      // Format dates for the form
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
      const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';
      
      setFormData({
        title,
        content,
        images: images || [],
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        businessId: business.id
      });
    }
  });

  // Update offer mutation
  const [updateOffer, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_OFFER, {
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
        variables: { businessId: formData.businessId } 
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
    updateOffer({
      variables: {
        id,
        input: {
          title: formData.title,
          content: formData.content,
          images: formData.images,
          startDate: formData.startDate,
          endDate: formData.endDate || null,
          businessId: formData.businessId
        }
      }
    });
  };

  if (offerLoading) return <Loader />;
  if (offerError) return <ErrorMessage message={offerError.message} />;

  return (
    <Container>
      <h1 className="mb-4">Edit Offer</h1>
      {updateError && <ErrorMessage message={updateError.message} />}
      {success && <SuccessMessage message="Offer updated successfully!" />}
      
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
              <Button variant="primary" type="submit" disabled={updateLoading}>
                {updateLoading ? 'Updating...' : 'Update Offer'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditOffer;