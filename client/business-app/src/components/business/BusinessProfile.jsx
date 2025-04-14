import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BUSINESS_PROFILE } from '../../graphql/queries';
import { UPDATE_BUSINESS_PROFILE } from '../../graphql/mutations';

const profileSchema = yup.object().shape({
  businessName: yup.string().required('Business name is required'),
  description: yup.string().required('Description is required'),
  businessTags: yup.string(),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal code is required'),
  address: yup.string().required('Address is required')
});

const BusinessProfile = ({ profile: propProfile, onUpdateProfile, onlyDisplay = false }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  const { 
    loading: profileLoading, 
    error: profileError, 
    data: profileData,
    refetch
  } = useQuery(GET_BUSINESS_PROFILE, {
    variables: { ownerId: userId },
    fetchPolicy: 'network-only',
    skip: !!propProfile
  });

  const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_BUSINESS_PROFILE, {
    onCompleted: () => {
      setIsEditing(false);
      if (!propProfile) {
        refetch();
        showSuccessMessage();
      }
    },
    onError: (err) => {
      console.error("Update error:", err);
      setError(err.message);
    }
  });

  const [successMessage, setSuccessMessage] = useState('');
  const showSuccessMessage = () => {
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile);
      setLoading(false);
      setError(null);
    } else if (profileData && profileData.businessProfileByOwner) {
      setProfile(profileData.businessProfileByOwner);
      setLoading(false);
      setError(null);
    } else if (profileLoading) {
      setLoading(true);
    } else if (profileError) {
      setError(profileError.message);
      setLoading(false);
    }
  }, [propProfile, profileData, profileLoading, profileError]);

  const isStandalone = !propProfile;

  const handleSubmit = (values) => {
    const formattedValues = {
      businessName: values.businessName,
      description: values.description,
      businessTags: values.businessTags ? values.businessTags.split(',').map(tag => tag.trim()) : []
    };

    if (onUpdateProfile) {
      onUpdateProfile(profile.id, formattedValues);
      setIsEditing(false);
    } else {
      updateProfile({
        variables: {
          id: profile.id,
          input: formattedValues
        }
      });
    }
  };

  const handleCancel = () => {
    if (isStandalone) {
      // Refetch the profile data to refresh the component
      refetch();
    }
    // Set editing state to false to return to display mode
    setIsEditing(false);
  };

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  if (error && !profile) {
    return (
      <Alert variant="danger" className="m-3">
        Error loading business profile: {error}
      </Alert>
    );
  }

  if (!profile && onlyDisplay) {
    return <div>No profile data available</div>;
  }

  if (!isEditing && profile) {
    return (
      <div>
        {successMessage && (
          <Alert variant="success" className="mb-4">
            {successMessage}
          </Alert>
        )}

        <div className="d-flex gap-2 justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Business Profile</h3>
          {(!onlyDisplay || isStandalone) && (
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
              {isStandalone && (
                <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/businessdashboard')}>
                  Dashboard
                </Button>
              )}
            </div>
          )}
        </div>

        <Card className="shadow-sm">
          <Card.Body>
            <h4>{profile.businessName}</h4>
            <div className="mb-3">
              {profile.businessTags.map((tag, index) => (
                <Badge key={index} bg="info" className="me-2 mb-2 text-uppercase">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-muted">
              <strong>Rating:</strong> {profile.averageRating ? `${profile.averageRating.toFixed(1)}/5` : 'No ratings yet'}
            </p>
            <h5>Description</h5>
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

  return (
    <div>
      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Edit Business Profile</h3>
        {isStandalone && (
          <Button variant="outline-secondary" onClick={() => navigate('/businessdashboard')}>
            Back to Dashboard
          </Button>
        )}
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={profileSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="businessName">
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
                    <Form.Group controlId="businessTags">
                      <Form.Label>Business Tags</Form.Label>
                      <Form.Control
                        type="text"
                        name="businessTags"
                        placeholder="e.g. restaurant, bakery"
                        value={values.businessTags}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    isInvalid={touched.description && !!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <h5 className="mt-4">Location (read-only)</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId="city">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId="postalCode">
                      <Form.Label>Postal Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="postalCode"
                        value={values.postalCode}
                        onChange={handleChange}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                  <Button variant="outline-secondary" className="me-2" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={updateLoading}>
                    {updateLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BusinessProfile;