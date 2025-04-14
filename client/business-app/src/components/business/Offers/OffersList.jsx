import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Modal, Alert, Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_OFFER, UPDATE_OFFER } from '../../../graphql/mutations';
import { GET_BUSINESS_PROFILE } from '../../../graphql/queries';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';

const OffersList = ({ offers: propOffers }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingOfferId, setEditingOfferId] = useState(null);

  const userId = localStorage.getItem('userId');

  const {
    loading: profileLoading,
    error: profileError,
    data: profileData,
    refetch,
  } = useQuery(GET_BUSINESS_PROFILE, {
    variables: { ownerId: userId },
    fetchPolicy: 'network-only',
    skip: Array.isArray(propOffers),
  });

  useEffect(() => {
    if (Array.isArray(propOffers)) {
      setOffers(propOffers);
      setLoading(false);
      setError(null);
    } else if (profileData?.businessProfileByOwner) {
      setOffers(profileData.businessProfileByOwner.offers || []);
      setLoading(false);
      setError(null);
    } else if (profileLoading) {
      setLoading(true);
    } else if (profileError) {
      setError(profileError.message);
      setLoading(false);
    }
  }, [propOffers, profileData, profileLoading, profileError]);

  const [deleteOffer, { loading: deleteLoading }] = useMutation(DELETE_OFFER, {
    onCompleted: () => {
      setShowDeleteModal(false);
      setOffers((prev) => prev.filter((o) => o.id !== selectedOffer.id));
      refetch();
    },
    onError: (error) => {
      setError(error.message);
      setShowDeleteModal(false);
    },
  });

  const [updateOffer, { loading: updateLoading }] = useMutation(UPDATE_OFFER, {
    onCompleted: () => {
      setEditingOfferId(null);
      refetch();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(Number(dateString));
    return isNaN(date.getTime())
      ? 'N/A'
      : `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const handleDeleteClick = (offer) => {
    setSelectedOffer(offer);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedOffer) {
      deleteOffer({ variables: { id: selectedOffer.id } });
    }
  };

  const handleCreateOffer = () => navigate('/business/create-offer');
  const handleBackToDashboard = () => navigate('/businessdashboard');

  if (loading) {
    return <div className="text-center p-5">Loading offers...</div>;
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-4 text-center">
        Error loading offers: {error}
      </Alert>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="text-center p-5">
        <h4 className="mb-3">No Promotions Yet</h4>
        <p>Create promotions to attract more customers to your business!</p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <Button variant="primary" onClick={handleCreateOffer}>
            Create New Promotion
          </Button>
          <Button variant="outline-secondary" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <div className="mb-2">
          <h3 className="mb-0">Business Promotions</h3>
        </div>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={handleCreateOffer}>
            Create New
          </Button>
          <Button variant="outline-secondary" onClick={handleBackToDashboard}>
            Dashboard
          </Button>
        </div>
      </div>

      <Row>
        {offers.map((offer) => (
          <Col md={6} lg={4} key={offer.id} className="mb-4">
            <Card className={`shadow-sm h-100 ${!offer.isActive ? 'border-danger' : ''}`}>
              <Card.Body className="d-flex flex-column justify-content-between">
                {editingOfferId === offer.id ? (
                  <Formik
                    initialValues={{
                      title: offer.title,
                      content: offer.content,
                      expiresAt: offer.expiresAt ? new Date(Number(offer.expiresAt)).toISOString().substr(0, 10) : '',
                    }}
                    onSubmit={(values) => {
                      updateOffer({
                        variables: {
                          id: offer.id,
                          input: {
                            title: values.title,
                            content: values.content,
                            expiresAt: values.expiresAt ? new Date(values.expiresAt).getTime().toString() : null,
                          },
                        },
                      });
                    }}
                  >
                    {({ handleSubmit, handleChange, values }) => (
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2">
                          <Form.Label>Title</Form.Label>
                          <Form.Control name="title" value={values.title} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Content</Form.Label>
                          <Form.Control as="textarea" name="content" value={values.content} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Expires At</Form.Label>
                          <Form.Control type="date" name="expiresAt" value={values.expiresAt} onChange={handleChange} />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                          <Button variant="outline-secondary" size="sm" onClick={() => setEditingOfferId(null)}>
                            Cancel
                          </Button>
                          <Button type="submit" variant="primary" size="sm" disabled={updateLoading}>
                            {updateLoading ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <>
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="mb-0">{offer.title}</Card.Title>
                        {!offer.isActive && <Badge bg="danger">Inactive</Badge>}
                      </div>
                      <Card.Text>{offer.content}</Card.Text>
                    </div>

                    <div className="mt-3">
                      {offer.expiresAt && (
                        <div className="text-muted small mb-1">
                          <strong>Expires:</strong> {formatDate(offer.expiresAt)}
                        </div>
                      )}
                      <div className="text-muted small mb-2">
                        <strong>Created:</strong> {formatDate(offer.createdAt)}
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setEditingOfferId(offer.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(offer)}
                          disabled={deleteLoading}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Promotion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "<strong>{selectedOffer?.title}</strong>"?
          <br />
          <small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OffersList;