import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import { UPDATE_OFFER } from '../../graphql/mutations';

// Validation schema for offers
const offerSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  expiresAt: yup.date().nullable().min(new Date(), 'Expiration date must be in the future')
});

const CreateOffer = ({ existingOffer, onCreateOffer, onCancel }) => {
  const [updateOffer] = useMutation(UPDATE_OFFER, {
    onCompleted: () => {
      window.location.reload(); // Simple refresh - in a real app you'd update the cache
    }
  });

  const initialValues = existingOffer ? {
    title: existingOffer.title,
    content: existingOffer.content,
    expiresAt: existingOffer.expiresAt ? new Date(existingOffer.expiresAt).toISOString().split('T')[0] : '',
    isActive: existingOffer.isActive
  } : {
    title: '',
    content: '',
    expiresAt: '',
    isActive: true
  };

  const handleSubmit = (values) => {
    const formattedValues = {
      ...values,
      expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : null
    };

    if (existingOffer) {
      updateOffer({ 
        variables: {
          id: existingOffer.id,
          input: formattedValues
        }
      });
    } else {
      onCreateOffer(formattedValues);
    }
  };

  return (
    <div>
      <h3 className="mb-4">{existingOffer ? 'Edit Promotion' : 'Create New Promotion'}</h3>
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

                {existingOffer && (
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="isActive"
                      label="Active"
                      checked={values.isActive}
                      onChange={() => setFieldValue('isActive', !values.isActive)}
                    />
                    <Form.Text className="text-muted">
                      Inactive promotions won't be shown to customers
                    </Form.Text>
                  </Form.Group>
                )}

                <div className="d-flex justify-content-end mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={onCancel} 
                    className="me-2"
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    {existingOffer ? 'Update Promotion' : 'Create Promotion'}
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