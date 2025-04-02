import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CREATE_BUSINESS_PROFILE } from '../../graphql/mutations';
import { GET_BUSINESS_PROFILES } from '../../graphql/queries';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';
import SuccessMessage from '../UI/SuccessMessage';
import './BusinessProfile.css';

const CreateBusinessProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    address: '',
    city: '',
    postalCode: '',
    images: [],
    businessTags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [success, setSuccess] = useState(false);

  const [createBusinessProfile, { loading, error }] = useMutation(CREATE_BUSINESS_PROFILE, {
    variables: {
      input: {
        businessName: formData.businessName,
        description: formData.description,
        location: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        images: formData.images,
        businessTags: formData.businessTags
      }
    },
    onCompleted: (data) => {
      setSuccess(true);
      // Redirect to business profile view after 2 seconds
      setTimeout(() => {
        navigate(`/business/${data.createBusinessProfile.id}`);
      }, 2000);
    },
    refetchQueries: [{ query: GET_BUSINESS_PROFILES }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    if (tagInput.trim() !== '' && !formData.businessTags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        businessTags: [...formData.businessTags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      businessTags: formData.businessTags.filter(t => t !== tag)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createBusinessProfile();
  };

  if (loading) return <Loader />;

  return (
    <Container>
      <h1 className="mb-4">Create Business Profile</h1>
      {error && <ErrorMessage message={error.message} />}
      {success && <SuccessMessage message="Business profile created successfully!" />}
      
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Business Name</Form.Label>
              <Form.Control
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                placeholder="Enter your business name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your business"
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Street address"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="Postal code"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Business Tags</Form.Label>
              <div className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  placeholder="Add tags (e.g., restaurant, family-friendly)"
                />
                <Button variant="outline-primary" className="ms-2" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="tags-container">
                {formData.businessTags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button type="button" className="tag-remove" onClick={() => removeTag(tag)}>
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                Create Business Profile
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateBusinessProfile;