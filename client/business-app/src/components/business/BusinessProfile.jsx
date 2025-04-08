import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

// Validation schema for business profile form
const profileSchema = yup.object().shape({
  businessName: yup.string().required('Business name is required'),
  description: yup.string().required('Description is required'),
  businessTags: yup.string(),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal code is required'),
  address: yup.string().required('Address is required')
});

const BusinessProfile = ({ profile, onUpdateProfile, onlyDisplay = false }) => {
  const [isEditing, setIsEditing] = useState(false);

  const initialValues = profile ? {
    businessName: profile.businessName,
    description: profile.description,
    businessTags: profile.businessTags.join(', '),
    city: profile.location?.city || '',
    postalCode: profile.location?.postalCode || '',
    address: profile.location?.address || ''
  } : {
    businessName: '',
    description: '',
    businessTags: '',
    city: '',
    postalCode: '',
    address: ''
  };

  const handleSubmit = (values) => {
    const formattedValues = {
      ...values,
      businessTags: values.businessTags ? values.businessTags.split(',').map(tag => tag.trim()) : [],
      locationInput: {
        city: values.city,
        postalCode: values.postalCode,
        address: values.address
      }
    };

    // Remove location fields from the top level
    delete formattedValues.city;
    delete formattedValues.postalCode;
    delete formattedValues.address;

    onUpdateProfile?.(profile.id, formattedValues);
    setIsEditing(false);
  };

  if (!isEditing && profile) {
    return (
      <div>
        {!onlyDisplay && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">Business Profile</h3>
            <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>
        )}

        <Card className="mb-4">
          <Card.Body>
            <h2>{profile.businessName}</h2>
            <div className="mb-3">
              {profile.businessTags.map((tag, index) => (
                <Badge key={index} bg="secondary" className="me-2 mb-2">{tag}</Badge>
              ))}
            </div>
            <p className="text-muted">
              <strong>Rating:</strong> {profile.averageRating ? `${profile.averageRating.toFixed(1)}/5` : 'No ratings yet'}
            </p>
            <h5>About</h5>
            <p>{profile.description}</p>
            
            {profile.location && (
              <div>
                <h5>Location</h5>
                <p>
                  {profile.location.address}<br />
                  {profile.location.city}, {profile.location.postalCode}
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (onlyDisplay) {
    return <div>No profile data available</div>;
  }

  return (
    <div>
      <h3 className="mb-4">Edit Business Profile</h3>
      
      <Formik
        initialValues={initialValues}
        validationSchema={profileSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Business Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="businessName"
                    value={values.businessName}
                    onChange={handleChange}
                    isInvalid={touched.businessName && !!errors.businessName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.businessName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Business Tags (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="businessTags"
                    value={values.businessTags}
                    onChange={handleChange}
                    placeholder="e.g. restaurant, italian, family-friendly"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={values.description}
                onChange={handleChange}
                isInvalid={touched.description && !!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <h5 className="mt-4">Business Location</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    isInvalid={touched.address && !!errors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    isInvalid={touched.city && !!errors.city}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="postalCode"
                    value={values.postalCode}
                    onChange={handleChange}
                    isInvalid={touched.postalCode && !!errors.postalCode}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.postalCode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-4 d-flex justify-content-end">
              <Button 
                variant="outline-secondary" 
                className="me-2" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Profile
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BusinessProfile;