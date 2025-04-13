import React from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { CREATE_BUSINESS_PROFILE } from '../../graphql/mutations';

// Validation schema for business profile form
const profileSchema = yup.object().shape({
  businessName: yup.string().required('Business name is required'),
  description: yup.string().required('Description is required'),
  businessTags: yup.string(),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal code is required'),
  address: yup.string().required('Address is required')
});

const CreateBusinessProfile = ({ onSuccess }) => {
  const [createBusinessProfile, { loading, error }] = useMutation(CREATE_BUSINESS_PROFILE, {
    onCompleted: (data) => {
      console.log("Business profile created:", data);
      if (onSuccess) onSuccess();
    }
  });

  const initialValues = {
    businessName: '',
    description: '',
    businessTags: '',
    city: '',
    postalCode: '',
    address: ''
  };

  const handleSubmit = (values) => {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId') || '67fbccd0b088a381cdcef65c'; // Fallback for testing
    
    const formattedValues = {
      businessName: values.businessName,
      description: values.description,
      businessTags: values.businessTags ? values.businessTags.split(',').map(tag => tag.trim()) : [],
      businessOwnerId: userId,
      locationInput: {
        city: values.city,
        postalCode: values.postalCode,
        address: values.address
      }
    };

    createBusinessProfile({ 
      variables: { input: formattedValues }
    });
  };

  return (
    <div>
      <h3 className="mb-4">Create Business Profile</h3>
      
      {error && (
        <Alert variant="danger">
          Error creating profile: {error.message}
        </Alert>
      )}
      
      <Card>
        <Card.Body>
          <p className="mb-4">Complete the form below to create your business profile:</p>
          
          <Formik
            initialValues={initialValues}
            validationSchema={profileSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form onSubmit={handleSubmit}>
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

                <div className="d-flex justify-content-end mt-4">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Business Profile'}
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

export default CreateBusinessProfile;