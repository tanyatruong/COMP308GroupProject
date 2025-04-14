import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Badge, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BUSINESS_PROFILE } from '../../graphql/queries';
import { UPDATE_BUSINESS_PROFILE } from '../../graphql/mutations';

// Validation schema for business profile form
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
  
  // Get user ID from localStorage for standalone mode
  const userId = localStorage.getItem('userId') || '67fbccd0b088a381cdcef65c';
  
  // Query business profile if not passed as props (standalone mode)
  const { 
    loading: profileLoading, 
    error: profileError, 
    data: profileData,
    refetch
  } = useQuery(GET_BUSINESS_PROFILE, {
    variables: { ownerId: userId },
    fetchPolicy: 'network-only',
    skip: !!propProfile // Skip if profile was passed as props
  });
  
  // Setup mutation for updating profile
  const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_BUSINESS_PROFILE, {
    onCompleted: () => {
      setIsEditing(false);
      if (!propProfile) {
        // Refetch profile data to get updated values
        refetch();
        showSuccessMessage();
      }
    },
    onError: (err) => {
      console.error("Update error:", err);
      setError(err.message);
    }
  });

  // Show success message
  const [successMessage, setSuccessMessage] = useState('');
  const showSuccessMessage = () => {
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  // Effect to set the profile from props or query
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

  // Check if we're in standalone mode (direct URL access)
  const isStandalone = !propProfile;

  // Handle form submission
  const handleSubmit = (values) => {
    // Format values for the update mutation
    const formattedValues = {
      businessName: values.businessName,
      description: values.description,
      businessTags: values.businessTags ? values.businessTags.split(',').map(tag => tag.trim()) : []
    };

    if (onUpdateProfile) {
      // If in dashboard mode, use the callback
      onUpdateProfile(profile.id, formattedValues);
      setIsEditing(false);
    } else {
      // If in standalone mode, use the mutation
      console.log("Updating with:", {
        id: profile.id,
        input: formattedValues
      });
      
      updateProfile({
        variables: {
          id: profile.id,
          input: formattedValues
        }
      });
    }
  };

  // Handle cancel button in standalone mode
  const handleCancel = () => {
    if (isStandalone) {
      navigate('/businessdashboard');
    } else {
      setIsEditing(false);
    }
  };

  // Loading state
  if (loading) {
    return <div className="text-center p-5">Loading business profile...</div>;
  }

  // Error state
  if (error && !profile) {
    return (
      <Alert variant="danger" className="m-3">
        Error loading business profile: {error}
      </Alert>
    );
  }

  // No profile data available
  if (!profile && onlyDisplay) {
    return <div>No profile data available</div>;
  }

  // If we're not editing and we have a profile, display it
  if (!isEditing && profile) {
    return (
      <div>
        {successMessage && (
          <Alert variant="success" className="mb-4">
            {successMessage}
          </Alert>
        )}

        {isStandalone && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">Business Profile</h3>
            <div>
              <Button 
                variant="outline-secondary" 
                className="me-2" 
                onClick={() => navigate('/businessdashboard')}
              >
                Back to Dashboard
              </Button>
              <Button variant="outline-primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </div>
          </div>
        )}

        {!onlyDisplay && !isStandalone && (
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

  // If we don't have a profile or we're editing, show the form
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
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/businessdashboard')}
          >
            Back to Dashboard
          </Button>
        )}
      </div>
      
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
            <p className="text-muted mb-3">Note: Location information cannot be changed at this time.</p>
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={updateLoading}
              >
                {updateLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BusinessProfile;