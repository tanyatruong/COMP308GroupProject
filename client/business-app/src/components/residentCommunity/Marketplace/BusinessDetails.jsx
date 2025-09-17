import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Badge, 
  Button, 
  Alert, 
  Spinner,
  ListGroup,
  Image,
  Form,
  Modal
} from 'react-bootstrap';
import { 
  Star, 
  StarFill, 
  GeoAlt, 
  ArrowLeft, 
  Shop, 
  Calendar,
  ChatLeftText,
  PencilFill,
  PlusCircle
} from 'react-bootstrap-icons';
import * as yup from 'yup';
import { Formik } from 'formik';

import { 
  GET_BUSINESS_PROFILE_BY_ID, 
  ANALYZE_SENTIMENT 
} from '../../../graphql/queries';
import { 
  CREATE_REVIEW, 
  UPDATE_REVIEW 
} from '../../../graphql/mutations';

// Review form validation schema
const reviewSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Review content is required').min(10, 'Review must be at least 10 characters'),
  rating: yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5')
});

// Helper component for displaying star ratings
const StarRating = ({ rating }) => {
  const ratingValue = typeof rating === 'number' ? rating : 0;
  
  return (
    <div className="d-flex align-items-center">
      {[...Array(5)].map((_, i) => (
        i < Math.round(ratingValue) 
          ? <StarFill key={i} className="text-warning" /> 
          : <Star key={i} className="text-warning" />
      ))}
      <span className="ms-2">{ratingValue.toFixed(1)}</span>
    </div>
  );
};

// Star selector component for review form
const StarSelector = ({ value, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="d-flex align-items-center mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <div 
          key={star} 
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onChange(star)}
          style={{ cursor: 'pointer', padding: '0 5px' }}
        >
          {(hoverRating || value) >= star ? (
            <StarFill size={30} className="text-warning" />
          ) : (
            <Star size={30} className="text-warning" />
          )}
        </div>
      ))}
      {value > 0 && <span className="ms-2 text-muted">({value} star{value !== 1 ? 's' : ''})</span>}
    </div>
  );
};

// Helper component for individual reviews
const ReviewItem = ({ review, isUserReview, onEditReview }) => {
  const formatReviewDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Parse timestamp properly
    let date;
    try {
      // Try as number first
      const timestampNum = Number(timestamp);
      date = !isNaN(timestampNum) ? new Date(timestampNum) : new Date(timestamp);
    } catch (e) {
      return 'Invalid date';
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    // Format the date
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const reviewRating = typeof review.rating === 'number' ? review.rating : 0;
  const responses = review.responses || [];
  const latestResponse = responses.length > 0 ? responses[responses.length - 1] : null;

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between mb-2">
          <div className="d-flex align-items-center">
            <h5 className="mb-0 me-2">{review.title || 'Review'}</h5>
            {isUserReview && (
              <Button 
                variant="link" 
                className="p-0 text-primary" 
                onClick={() => onEditReview(review)}
                title="Edit your review"
              >
                <PencilFill size={14} />
              </Button>
            )}
          </div>
          <div className="d-flex align-items-center">
            {[...Array(5)].map((_, i) => (
              i < reviewRating 
                ? <StarFill key={i} className="text-warning" size={16} /> 
                : <Star key={i} className="text-warning" size={16} />
            ))}
          </div>
        </div>
        <Card.Text>{review.content}</Card.Text>
        <div className="text-muted small">
          <Calendar size={14} className="me-1" />
          {formatReviewDate(review.createdAt)}
        </div>

        {review.sentimentAnalysis && (
          <div className="mt-3 p-2 bg-light rounded">
            <small className="text-muted fst-italic">
              Sentiment: {review.sentimentAnalysis}
            </small>
          </div>
        )}

        {latestResponse && (
          <div className="mt-3 p-3 bg-light rounded">
            <div className="d-flex align-items-center mb-2">
              <ChatLeftText size={14} className="me-1" />
              <strong>Business Response:</strong>
            </div>
            <p className="mb-0">{latestResponse}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

// Review Form Component
const ReviewForm = ({ initialValues, onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={reviewSchema}
      onSubmit={onSubmit}
    >
      {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <h4>{initialValues.id ? 'Edit Review' : 'Write a Review'}</h4>
          
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <StarSelector 
              value={values.rating} 
              onChange={(value) => setFieldValue('rating', value)} 
            />
            {touched.rating && errors.rating && (
              <div className="text-danger">{errors.rating}</div>
            )}
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              isInvalid={touched.title && !!errors.title}
              placeholder="Summarize your experience"
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="content"
              value={values.content}
              onChange={handleChange}
              isInvalid={touched.content && !!errors.content}
              placeholder="Share details of your experience with this business"
            />
            <Form.Control.Feedback type="invalid">
              {errors.content}
            </Form.Control.Feedback>
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button 
              variant="outline-secondary" 
              className="me-2" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {initialValues.id ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// Main business details component
const BusinessDetails = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState(null);
  const [sortedReviews, setSortedReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [sentimentSummary, setSentimentSummary] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Improved authentication checks
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isResident, setIsResident] = useState(false);
  const [userId, setUserId] = useState(null);
  
  // Check authentication status when component mounts
  useEffect(() => {
    // Get authentication data from localStorage
    const storedUserId = localStorage.getItem('userId');
    
    // Check for different possible keys storing user role information
    const storedUserType = localStorage.getItem('userType');
    const storedRole = localStorage.getItem('role');
    
    // Check if user is resident from either userType or role (case insensitive)
    const isUserResident = 
      (storedUserType && storedUserType.toLowerCase() === 'resident') || 
      (storedRole && storedRole.toLowerCase() === 'resident');
    
    // If we have a userId but no role information, infer the user is a resident
    // based on application context
    const isUserLoggedIn = !!storedUserId;
    const isInferredResident = isUserLoggedIn;
    
    // Log for debugging
    console.log('Authentication Check (Improved):', {
      storedUserId,
      storedUserType,
      storedRole,
      isUserResident,
      isInferredResident
    });
    
    // Update state - use explicit resident role if available, or infer based on userId
    setUserId(storedUserId);
    setIsLoggedIn(isUserLoggedIn);
    setIsResident(isUserResident || isInferredResident);
    
  }, []);
  
  // Fetch business profile data
  const { loading, error, data, refetch } = useQuery(GET_BUSINESS_PROFILE_BY_ID, {
    variables: { businessId },
    fetchPolicy: 'network-only',
  });

  // Sentiment analysis query
  const [analyzeSentiment, { loading: analyzingLoading }] = useLazyQuery(ANALYZE_SENTIMENT, {
    onCompleted: (data) => {
      if (data && data.analyzeSentiment) {
        setSentimentSummary(data.analyzeSentiment);
      }
    },
    onError: (error) => {
      console.error("Error analyzing sentiment:", error);
      setSentimentSummary("Unable to analyze reviews at this time.");
    }
  });

  // Mutations for reviews
  const [createReview, { loading: creatingReview }] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      setShowReviewForm(false);
      refetch();
    },
    onError: (error) => {
      setErrorMessage(`Failed to submit review: ${error.message}`);
    }
  });

  const [updateReview, { loading: updatingReview }] = useMutation(UPDATE_REVIEW, {
    onCompleted: () => {
      setShowReviewForm(false);
      setCurrentReview(null);
      refetch();
    },
    onError: (error) => {
      setErrorMessage(`Failed to update review: ${error.message}`);
    }
  });

  // Set business data and sort reviews safely
  useEffect(() => {
    if (data && data.businessProfile) {
      setBusinessData(data.businessProfile);
      
      // Safely create a copy of reviews array and sort it
      if (data.businessProfile.reviews && Array.isArray(data.businessProfile.reviews)) {
        const reviewsCopy = [...data.businessProfile.reviews];
        reviewsCopy.sort((a, b) => {
          const dateA = a.createdAt ? Number(a.createdAt) : 0;
          const dateB = b.createdAt ? Number(b.createdAt) : 0;
          return dateB - dateA; // Sort by most recent first
        });
        setSortedReviews(reviewsCopy);
        
        // Run sentiment analysis on review content
        const reviewContents = reviewsCopy.map(review => review.content);
        if (reviewContents.length > 0) {
          analyzeSentiment({ variables: { reviews: reviewContents } });
        }
      } else {
        setSortedReviews([]);
      }
    }
  }, [data, analyzeSentiment]);

  // Debugging
  useEffect(() => {
    console.log('Business data received:', data?.businessProfile);
  }, [data]);

  // Handle review submission
  const handleSubmitReview = (values) => {
    if (currentReview) {
      updateReview({
        variables: {
          reviewId: currentReview.id,
          input: {
            title: values.title,
            content: values.content,
            rating: values.rating
          }
        }
      });
    } else {
      // Using exact field names from the ReviewInput type in the schema
      createReview({
        variables: {
          input: {
            businessProfileId: businessId,
            authorId: userId,  // Schema expects authorId, not author
            title: values.title,
            content: values.content,
            rating: values.rating
          }
        }
      });
      
      // Log the submission for debugging
      console.log('Submitting review with data:', {
        businessProfileId: businessId,
        authorId: userId,
        title: values.title,
        content: values.content,
        rating: values.rating
      });
    }
  };

  // Handle review editing
  const handleEditReview = (review) => {
    setCurrentReview(review);
    setShowReviewForm(true);
  };

  // Improved function to check if the current user has already left a review
  const getUserReview = () => {
    if (!userId || !sortedReviews || !sortedReviews.length) return null;
    
    // Find a review by this user
    const review = sortedReviews.find(review => 
      review.author && 
      (review.author.id === userId || review.author === userId)
    );
    
    console.log('User Review Check:', {
      userId,
      reviewFound: !!review,
      reviewAuthorId: review?.author?.id || 'N/A'
    });
    
    return review;
  };

  const userReview = getUserReview();
  const hasUserReview = !!userReview;

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading business details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Error loading business details: {error.message}
          <div className="mt-3">
            <Button variant="outline-primary" onClick={() => navigate('/resident/marketplace')}>
              <ArrowLeft className="me-1" />
              Back to Marketplace
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!businessData) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Business not found. The requested business profile may no longer exist.
          <div className="mt-3">
            <Button variant="outline-primary" onClick={() => navigate('/resident/marketplace')}>
              <ArrowLeft className="me-1" />
              Back to Marketplace
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Calculate rating distribution safely
  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // For ratings 1-5
    
    if (!sortedReviews.length) return distribution;
    
    sortedReviews.forEach(review => {
      if (typeof review.rating === 'number' && review.rating >= 1 && review.rating <= 5) {
        const index = Math.round(review.rating) - 1;
        distribution[index]++;
      }
    });
    
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const averageRating = typeof businessData.averageRating === 'number' ? businessData.averageRating : 0;
  const businessTags = Array.isArray(businessData.businessTags) ? businessData.businessTags : [];
  const businessImages = Array.isArray(businessData.images) ? businessData.images : [];

  // Initial values for review form
  const reviewInitialValues = currentReview ? {
    id: currentReview.id,
    title: currentReview.title || '',
    content: currentReview.content || '',
    rating: currentReview.rating || 5
  } : {
    id: '',
    title: '',
    content: '',
    rating: 5
  };

  return (
    <Container className="mt-4">
      {/* Error message alert */}
      {errorMessage && (
        <Alert 
          variant="danger" 
          dismissible 
          onClose={() => setErrorMessage('')}
          className="mb-4"
        >
          {errorMessage}
        </Alert>
      )}
      
      {/* Top Bar */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="mb-0">
            <Shop className="me-2" />
            {businessData.businessName || 'Business Details'}
          </h2>
          <div className="text-muted mt-2">
            {businessTags.length > 0 && (
              <div className="mb-2">
                {businessTags.map(tag => (
                  <Badge key={tag} bg="secondary" className="me-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {businessData.location && (
              <div>
                <GeoAlt className="me-1" />
                {businessData.location.address}{businessData.location.city && `, ${businessData.location.city}`}
                {businessData.location.postalCode && `, ${businessData.location.postalCode}`}
              </div>
            )}
          </div>
        </Col>
        <Col md="auto">
          <Button variant="outline-primary" onClick={() => navigate('/resident/marketplace')}>
            <ArrowLeft className="me-1" />
            Back to Marketplace
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        {/* Business Details Card */}
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col>
                  <h4 className="mb-3">About This Business</h4>
                  <Card.Text>{businessData.description || 'No description available'}</Card.Text>
                  
                  {averageRating > 0 && (
                    <div className="mt-4">
                      <h5>Rating</h5>
                      <div className="d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                          i < Math.round(averageRating) 
                            ? <StarFill key={i} className="text-warning" /> 
                            : <Star key={i} className="text-warning" />
                        ))}
                        <span className="ms-2">{averageRating.toFixed(1)}</span>
                      </div>
                      <p className="text-muted mt-2">
                        Based on {sortedReviews.length} customer reviews
                      </p>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Business Images Sidebar */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Photos</h4>
              {businessImages.length > 0 ? (
                <Row>
                  {businessImages.map((imageUrl, index) => (
                    <Col xs={12} className="mb-3" key={index}>
                      <Image 
                        src={imageUrl} 
                        alt={`${businessData.businessName || 'Business'} image ${index + 1}`}
                        className="img-fluid rounded"
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="text-muted">No photos available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reviews Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Customer Reviews</h3>
        {isLoggedIn ? (
          <>
            {isResident ? (
              <Button 
                variant="primary" 
                onClick={() => {
                  setCurrentReview(null);
                  setShowReviewForm(true);
                }}
                disabled={hasUserReview}
              >
                <PlusCircle className="me-1" />
                {hasUserReview ? 'You have already reviewed this business' : 'Write a Review'}
              </Button>
            ) : (
              <Alert variant="info" className="mb-0 py-2">
                <div className="d-flex align-items-center">
                  Only residents can leave reviews
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="ms-3"
                    onClick={() => navigate('/')}
                  >
                    Go to Home
                  </Button>
                </div>
              </Alert>
            )}
          </>
        ) : (
          <Alert variant="info" className="mb-0 py-2">
            <div className="d-flex align-items-center">
              Please log in as a resident to leave a review
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="ms-3"
                onClick={() => navigate('/')}
              >
                Go to Home
              </Button>
            </div>
          </Alert>
        )}
      </div>
      
      {/* Review Form */}
      {showReviewForm && isLoggedIn && isResident && (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <ReviewForm 
              initialValues={reviewInitialValues}
              onSubmit={handleSubmitReview}
              onCancel={() => {
                setShowReviewForm(false);
                setCurrentReview(null);
              }}
            />
          </Card.Body>
        </Card>
      )}
      
      {/* Sentiment Analysis Summary */}
      {sortedReviews.length > 0 && (
        <Card className="shadow-sm mb-4 bg-light border-0">
          <Card.Body>
            <h5 className="mb-3">
              <i className="bi bi-robot me-2"></i>
              AI Sentiment Analysis
            </h5>
            {analyzingLoading ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Analyzing customer reviews...</p>
              </div>
            ) : sentimentSummary ? (
              <p className="mb-0">{sentimentSummary}</p>
            ) : (
              <p className="text-muted mb-0">Click to analyze customer sentiment</p>
            )}
          </Card.Body>
        </Card>
      )}
      
      {sortedReviews.length > 0 ? (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="shadow-sm text-center p-3">
                <h2 className="mb-0">{averageRating.toFixed(1)}</h2>
                <div className="d-flex justify-content-center my-2">
                  <div className="d-flex align-items-center">
                    {[...Array(5)].map((_, i) => (
                      i < Math.round(averageRating) 
                        ? <StarFill key={i} className="text-warning" /> 
                        : <Star key={i} className="text-warning" />
                    ))}
                  </div>
                </div>
                <p className="mb-0">{sortedReviews.length} Reviews</p>
              </Card>
            </Col>
            <Col md={8}>
              <div className="p-3">
                <h5 className="mb-3">Rating Distribution</h5>
                {[5, 4, 3, 2, 1].map((rating, idx) => {
                  const count = ratingDistribution[rating - 1];
                  const percentage = sortedReviews.length > 0 
                    ? (count / sortedReviews.length) * 100 
                    : 0;
                  
                  return (
                    <div key={rating} className="d-flex align-items-center mb-2">
                      <div style={{ width: '80px' }}>
                        {rating} {rating === 1 ? 'Star' : 'Stars'}
                      </div>
                      <div className="flex-grow-1 mx-3">
                        <div className="progress" style={{ height: '10px' }}>
                          <div 
                            className="progress-bar bg-warning" 
                            role="progressbar" 
                            style={{ width: `${percentage}%` }} 
                            aria-valuenow={percentage} 
                            aria-valuemin="0" 
                            aria-valuemax="100">
                          </div>
                        </div>
                      </div>
                      <div style={{ width: '40px' }}>{count}</div>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
          
          <ListGroup variant="flush" className="mb-4">
            {sortedReviews.map(review => (
              <ListGroup.Item key={review.id} className="border-0 p-0 mb-3">
                <ReviewItem 
                  review={review} 
                  isUserReview={review.author && (review.author.id === userId || review.author === userId)}
                  onEditReview={handleEditReview} 
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      ) : (
        <Alert variant="info">
          This business has not received any reviews yet.
        </Alert>
      )}
    </Container>
  );
};

export default BusinessDetails;