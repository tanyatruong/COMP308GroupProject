import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_OFFER } from '../../../graphql/mutations';
import { GET_BUSINESS_PROFILE } from '../../../graphql/queries';
import { useNavigate } from 'react-router-dom';

// Validation schema for offers
const offerSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  expiresAt: yup.date().nullable().min(new Date(), 'Expiration date must be in the future')
});

const CreateOffer = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  // Get the business profile to access the ID
  const { loading: profileLoading, error: profileError, data: profileData } = useQuery(GET_BUSINESS_PROFILE, {
    variables: { ownerId: userId },
    fetchPolicy: 'network-only'
  });

  const [createOffer, { loading, error }] = useMutation(CREATE_OFFER, {
    onCompleted: () => {
      navigate('/business/offers');
    }
  });

  const initialValues = {
    title: '',
    content: '',
    expiresAt: '',
    isActive: true
  };

  const handleSubmit = (values) => {
    const businessId = profileData?.businessProfileByOwner?.id;
    
    if (!businessId) {
      console.error("No business profile found");
      return;
    }
    
    createOffer({ 
      variables: {
        input: {
          title: values.title,
          content: values.content,
          expiresAt: values.expiresAt ? values.expiresAt : null,
          businessId: businessId,
          images: []
        }
      }
    });
  };

  if (profileLoading) return <div className="text-center p-5">Loading business profile...</div>;
  if (profileError) return <div className="text-center p-5">Error loading business profile: {profileError.message}</div>;
  if (!profileData?.businessProfileByOwner) return <div className="text-center p-5">No business profile found. Please create a profile first.</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-4">Create New Promotion</h3>
      {error && <Alert variant="danger">{error.message}</Alert>}
      
      <Card>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={offerSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, handleChange, setFieldValue, values, touched, errors }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Promotion Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    isInvalid={touched.title && !!errors.title}
                    placeholder="e.g. Summer Special 20% Off"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Promotion Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    isInvalid={touched.content && !!errors.content}
                    placeholder="Provide details about your promotion..."
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.content}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Expiration Date (Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    name="expiresAt"
                    value={values.expiresAt}
                    onChange={handleChange}
                    isInvalid={touched.expiresAt && !!errors.expiresAt}
                  />
                  <Form.Text className="text-muted">
                    Leave blank if this promotion doesn't expire
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.expiresAt}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-end mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/businessdashboard')} 
                    className="me-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Promotion'}
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

export default CreateOffer;