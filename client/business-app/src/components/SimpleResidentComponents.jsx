import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, ListGroup, Badge, Row, Col, Form, Modal, InputGroup } from 'react-bootstrap';

export const SimpleResidentDashboard = () => {
  return (
    <Container className="mt-4">
      <h2>Resident Dashboard</h2>
      <p>Welcome to your resident dashboard! Here you can access community features.</p>
      
      <div className="row mt-4">
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <h5 className="card-title">Bulletin Board</h5>
              <p className="card-text">View and post community announcements and discussions.</p>
              <Button variant="primary" href="/resident/bulletinboard">Go to Bulletin Board</Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <h5 className="card-title">Marketplace</h5>
              <p className="card-text">Browse local businesses and their offers.</p>
              <Button variant="primary" href="/resident/marketplace">Go to Marketplace</Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <h5 className="card-title">Help Requests</h5>
              <p className="card-text">Request or offer help within your community.</p>
              <Button variant="primary" href="/resident/neighborhoodhelprequests">Go to Help Requests</Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export const SimpleBulletinBoard = () => {
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Add CSS for modal fixes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .modal {
        z-index: 1055 !important;
        display: block !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }
      .modal-backdrop {
        z-index: 1050 !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
      }
      .modal-dialog {
        margin: 0 !important;
        max-width: 99vw !important;
        min-width: 1200px !important;
        width: 98vw !important;
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        max-height: 90vh !important;
      }
      .modal-content {
        max-height: 90vh !important;
        width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        border: none !important;
        border-radius: 0.5rem !important;
        background-color: white !important;
        position: relative !important;
      }
      .modal-body {
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 1.5rem !important;
        background-color: white !important;
      }
      .modal-footer {
        flex-shrink: 0 !important;
        border-top: 1px solid #dee2e6 !important;
        background-color: #f8f9fa !important;
        padding: 1rem 1.5rem !important;
      }
      .modal-header {
        border-bottom: 1px solid #dee2e6 !important;
        padding: 1rem 1.5rem !important;
        background-color: white !important;
      }
      .modal.show {
        display: block !important;
      }
      .modal.fade .modal-dialog {
        transform: translate(-50%, -50%) !important;
      }
      @media (max-width: 1400px) {
        .modal-dialog {
          min-width: 95vw !important;
          max-width: 95vw !important;
          width: 95vw !important;
        }
      }
      @media (max-width: 1200px) {
        .modal-dialog {
          min-width: 98vw !important;
          max-width: 98vw !important;
          width: 98vw !important;
        }
      }
      @media (max-width: 768px) {
        .modal-dialog {
          min-width: 99vw !important;
          max-width: 99vw !important;
          width: 99vw !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Community Garden Meeting",
      content: "Join us this Saturday at 10 AM for our monthly community garden meeting. We'll discuss the new planting schedule and upcoming events.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "Event",
      comments: [
        { id: 1, author: "Mike Chen", content: "I'll be there! Looking forward to it.", date: "2024-01-15" },
        { id: 2, author: "Lisa Rodriguez", content: "Can I bring my kids?", date: "2024-01-15" }
      ]
    },
    {
      id: 2,
      title: "Lost Dog - Please Help!",
      content: "Our golden retriever Max went missing yesterday near the park. He's wearing a blue collar and is very friendly. Please call 555-0123 if you see him.",
      author: "Mike Chen",
      date: "2024-01-14",
      category: "Lost & Found",
      comments: [
        { id: 3, author: "Sarah Johnson", content: "I'll keep an eye out for Max!", date: "2024-01-14" },
        { id: 4, author: "Tom Anderson", content: "Shared on my social media. Hope you find him soon!", date: "2024-01-14" }
      ]
    },
    {
      id: 3,
      title: "Block Party Planning",
      content: "We're organizing a neighborhood block party for next month. Looking for volunteers to help with setup, food, and activities. Contact me if interested!",
      author: "Lisa Rodriguez",
      date: "2024-01-13",
      category: "Community",
      comments: [
        { id: 5, author: "David Kim", content: "I can help with setup!", date: "2024-01-13" },
        { id: 6, author: "Maria Garcia", content: "I'll bring some food. What should I make?", date: "2024-01-13" }
      ]
    },
    {
      id: 4,
      title: "Garage Sale This Weekend",
      content: "Big garage sale at 123 Oak Street this Saturday 8 AM - 2 PM. Furniture, electronics, books, and more. Cash only.",
      author: "David Kim",
      date: "2024-01-12",
      category: "Sale",
      comments: [
        { id: 7, author: "Robert Wilson", content: "What kind of electronics do you have?", date: "2024-01-12" }
      ]
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      const post = {
        id: posts.length + 1,
        title: newPost.title,
        content: newPost.content,
        author: "You",
        date: new Date().toISOString().split('T')[0],
        category: "General",
        comments: []
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '' });
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && selectedPost) {
      const comment = {
        id: Date.now(),
        author: "You",
        content: newComment.trim(),
        date: new Date().toISOString().split('T')[0]
      };
      
      const updatedPosts = posts.map(post => 
        post.id === selectedPost.id 
          ? { ...post, comments: [...post.comments, comment] }
          : post
      );
      setPosts(updatedPosts);
      
      const updatedSelectedPost = { ...selectedPost, comments: [...selectedPost.comments, comment] };
      setSelectedPost(updatedSelectedPost);
      setNewComment('');
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bulletin Board</h2>
        <Button variant="primary" href="/resident">
          <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
        </Button>
      </div>

      {/* Create New Post */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Create New Post</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter post title"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter post content"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit">
              <i className="bi bi-plus-circle me-2"></i>Post Message
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Posts List */}
      <div className="row">
        {posts.map((post) => (
          <div key={post.id} className="col-md-6 mb-3">
            <Card 
              className="h-100 cursor-pointer" 
              style={{ cursor: 'pointer' }}
              onClick={() => handlePostClick(post)}
            >
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{post.title}</h6>
                <div>
                  <Badge bg="secondary" className="me-2">{post.category}</Badge>
                  <Badge bg="info">{post.comments.length} comments</Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <p className="card-text">{post.content}</p>
                <small className="text-muted">
                  By {post.author} on {post.date}
                </small>
              </Card.Body>
              <Card.Footer>
                <Button variant="outline-primary" size="sm" className="w-100">
                  <i className="bi bi-chat me-1"></i>View & Comment
                </Button>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>

      {/* Post Detail Modal */}
      <Modal 
        show={showPostModal} 
        onHide={() => setShowPostModal(false)} 
        size="xl" 
        centered
        animation={true}
        style={{ zIndex: 1055 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedPost?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {selectedPost && (
            <>
              <div className="mb-3">
                <Badge bg="secondary" className="me-2">{selectedPost.category}</Badge>
                <small className="text-muted">
                  By {selectedPost.author} on {selectedPost.date}
                </small>
              </div>
              <p>{selectedPost.content}</p>
              
              <hr />
              <h6>Comments ({selectedPost.comments.length})</h6>
              
              {/* Comments List */}
              <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {selectedPost.comments.map((comment) => (
                  <div key={comment.id} className="border-bottom pb-2 mb-2">
                    <div className="d-flex justify-content-between">
                      <strong>{comment.author}</strong>
                      <small className="text-muted">{comment.date}</small>
                    </div>
                    <p className="mb-0 mt-1">{comment.content}</p>
                  </div>
                ))}
                {selectedPost.comments.length === 0 && (
                  <p className="text-muted">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex flex-column">
          {/* Add Comment Form */}
          <Form onSubmit={handleCommentSubmit} className="w-100 mb-3">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button variant="primary" type="submit">
                <i className="bi bi-send"></i>
              </Button>
            </InputGroup>
          </Form>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setShowPostModal(false)}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export const SimpleMarketplace = () => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  // Ensure modal centering/width CSS is present even when landing directly on Marketplace
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('global-modal-style');
    if (existing) return;
    const style = document.createElement('style');
    style.id = 'global-modal-style';
    style.textContent = `
      .modal {
        z-index: 1055 !important;
        display: block !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }
      .modal-backdrop {
        z-index: 1050 !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
      }
      .modal-dialog {
        margin: 0 !important;
        max-width: 99vw !important;
        min-width: 1200px !important;
        width: 98vw !important;
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        max-height: 90vh !important;
      }
      .modal-content {
        max-height: 90vh !important;
        width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        border: none !important;
        border-radius: 0.5rem !important;
        background-color: white !important;
        position: relative !important;
      }
      .modal-body { flex: 1 !important; overflow-y: auto !important; padding: 1.5rem !important; background-color: white !important; }
      .modal-footer { flex-shrink: 0 !important; border-top: 1px solid #dee2e6 !important; background-color: #f8f9fa !important; padding: 1rem 1.5rem !important; }
      .modal-header { border-bottom: 1px solid #dee2e6 !important; padding: 1rem 1.5rem !important; background-color: white !important; }
      .modal.show { display: block !important; }
      .modal.fade .modal-dialog { transform: translate(-50%, -50%) !important; }
      @media (max-width: 1400px) { .modal-dialog { min-width: 95vw !important; max-width: 95vw !important; width: 95vw !important; } }
      @media (max-width: 1200px) { .modal-dialog { min-width: 98vw !important; max-width: 98vw !important; width: 98vw !important; } }
      @media (max-width: 768px) { .modal-dialog { min-width: 99vw !important; max-width: 99vw !important; width: 99vw !important; } }
    `;
    document.head.appendChild(style);
  }, []);
  

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business);
    setShowBusinessModal(true);
  };

  const [businesses] = useState([
      {
        id: 1,
        name: "Tony's Pizza",
        category: "Restaurant",
        rating: 4.5,
        description: "Authentic Italian pizza with fresh ingredients and family recipes passed down for generations.",
        address: "123 Main Street",
        phone: "(555) 123-4567",
        hours: "Mon-Sun: 11 AM - 10 PM",
        offers: ["20% off first order", "Free delivery within 2 miles"],
        menu: ["Margherita Pizza - $12.99", "Pepperoni Pizza - $14.99", "Vegetarian Pizza - $13.99", "Caesar Salad - $8.99"],
        reviews: [
          { author: "Sarah J.", rating: 5, comment: "Best pizza in town! Fresh ingredients and great service." },
          { author: "Mike C.", rating: 4, comment: "Love the thin crust. Delivery was fast too." }
        ]
      },
      {
        id: 2,
        name: "Green Thumb Garden Center",
        category: "Garden & Home",
        rating: 4.8,
        description: "Your one-stop shop for all gardening needs. Plants, tools, soil, and expert advice.",
        address: "456 Oak Avenue",
        phone: "(555) 234-5678",
        hours: "Mon-Sat: 8 AM - 6 PM, Sun: 10 AM - 4 PM",
        offers: ["10% off all plants", "Free soil testing"],
        menu: ["Indoor Plants - $15-50", "Garden Tools - $10-30", "Soil & Fertilizer - $5-25", "Plant Pots - $8-20"],
        reviews: [
          { author: "Lisa R.", rating: 5, comment: "Amazing selection and the staff really knows their stuff!" },
          { author: "Tom A.", rating: 4, comment: "Great prices and quality plants. My garden looks amazing!" }
        ]
      },
      {
        id: 3,
        name: "TechFix Computer Repair",
        category: "Technology",
        rating: 4.3,
        description: "Professional computer and laptop repair services. Fast, reliable, and affordable.",
        address: "789 Pine Street",
        phone: "(555) 345-6789",
        hours: "Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM",
        offers: ["Free diagnostic", "Same-day service available"],
        menu: ["Virus Removal - $75", "Hardware Repair - $100+", "Data Recovery - $150+", "Software Installation - $50"],
        reviews: [
          { author: "David K.", rating: 4, comment: "Fixed my laptop quickly and reasonably priced." },
          { author: "Maria G.", rating: 5, comment: "Very professional and honest about what needed to be done." }
        ]
      },
      {
        id: 4,
        name: "FitLife Gym",
        category: "Fitness",
        rating: 4.6,
        description: "Modern fitness center with state-of-the-art equipment and personal training services.",
        address: "321 Elm Street",
        phone: "(555) 456-7890",
        hours: "Mon-Fri: 5 AM - 10 PM, Sat-Sun: 7 AM - 8 PM",
        offers: ["Free trial week", "Personal training packages"],
        menu: ["Monthly Membership - $49.99", "Personal Training - $60/hour", "Group Classes - $15/class", "Day Pass - $10"],
        reviews: [
          { author: "Robert W.", rating: 5, comment: "Great equipment and friendly staff. Highly recommend!" },
          { author: "Jennifer S.", rating: 4, comment: "Clean facility and good variety of classes available." }
        ]
      }
    ]);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Local Marketplace</h2>
        <Button variant="primary" href="/resident">
          <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
        </Button>
      </div>

      <Row className="g-4">
        {businesses.map((business) => (
          <Col key={business.id} md={6} lg={4} className="mb-4">
            <Card 
              className="h-100 shadow-sm" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease-in-out' }}
              onClick={() => handleBusinessClick(business)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Card.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">{business.name}</h6>
                  <Badge bg="primary" className="px-2 py-1">{business.category}</Badge>
                </div>
                <div className="d-flex align-items-center mt-2">
                  <span className="text-warning fs-6">
                    {'★'.repeat(Math.floor(business.rating))}
                    {'☆'.repeat(5 - Math.floor(business.rating))}
                  </span>
                  <span className="ms-2 text-muted fw-bold">({business.rating})</span>
                </div>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <p className="card-text flex-grow-1">{business.description}</p>
                <div className="mt-auto">
                  <div className="mb-2">
                    <small className="text-muted d-flex align-items-center">
                      <i className="bi bi-geo-alt me-2"></i>{business.address}
                    </small>
                  </div>
                  <div className="mb-2">
                    <small className="text-muted d-flex align-items-center">
                      <i className="bi bi-telephone me-2"></i>{business.phone}
                    </small>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-flex align-items-center">
                      <i className="bi bi-clock me-2"></i>{business.hours}
                    </small>
                  </div>
                  <div>
                    <h6 className="text-success mb-2">
                      <i className="bi bi-tag me-1"></i>Current Offers:
                    </h6>
                    <div className="mb-2">
                      {business.offers.slice(0, 2).map((offer, index) => (
                        <Badge key={index} bg="success" className="me-1 mb-1">
                          {offer}
                        </Badge>
                      ))}
                      {business.offers.length > 2 && (
                        <Badge bg="secondary">
                          +{business.offers.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-light">
                <Button variant="outline-primary" size="sm" className="w-100">
                  <i className="bi bi-info-circle me-1"></i>View Details
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Business Detail Modal */}
      <Modal 
        show={showBusinessModal} 
        onHide={() => setShowBusinessModal(false)} 
        size="xl" 
        centered
        animation={true}
        style={{ zIndex: 1055 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedBusiness?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {selectedBusiness && (
            <>
              <div className="mb-3">
                <Badge bg="primary" className="me-2">{selectedBusiness.category}</Badge>
                <div className="d-flex align-items-center mt-2">
                  <span className="text-warning">
                    {'★'.repeat(Math.floor(selectedBusiness.rating))}
                    {'☆'.repeat(5 - Math.floor(selectedBusiness.rating))}
                  </span>
                  <span className="ms-2 text-muted">({selectedBusiness.rating})</span>
                </div>
              </div>
              
              <p className="mb-3">{selectedBusiness.description}</p>
              
                    <Row className="g-4">
                      <Col lg={4} md={6}>
                        <div className="bg-light p-3 rounded h-100">
                          <h6 className="text-primary mb-3">
                            <i className="bi bi-info-circle me-2"></i>Contact Info
                          </h6>
                          <div className="mb-2">
                            <i className="bi bi-geo-alt me-2 text-muted"></i>
                            <span className="fw-medium">{selectedBusiness.address}</span>
                          </div>
                          <div className="mb-2">
                            <i className="bi bi-telephone me-2 text-muted"></i>
                            <span className="fw-medium">{selectedBusiness.phone}</span>
                          </div>
                          <div className="mb-0">
                            <i className="bi bi-clock me-2 text-muted"></i>
                            <span className="fw-medium">{selectedBusiness.hours}</span>
                          </div>
                        </div>
                      </Col>
                      <Col lg={4} md={6}>
                        <div className="bg-success bg-opacity-10 p-3 rounded h-100">
                          <h6 className="text-success mb-3">
                            <i className="bi bi-tag me-2"></i>Current Offers
                          </h6>
                          <div className="d-flex flex-wrap gap-2">
                            {selectedBusiness.offers.map((offer, index) => (
                              <Badge key={index} bg="success" className="px-3 py-2">
                                <i className="bi bi-check-circle me-1"></i>{offer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Col>
                      <Col lg={4} md={12}>
                        <div className="bg-warning bg-opacity-10 p-3 rounded h-100">
                          <h6 className="text-warning mb-3">
                            <i className="bi bi-star me-2"></i>Quick Info
                          </h6>
                          <div className="d-flex align-items-center mb-2">
                            <span className="text-warning fs-5 me-2">
                              {'★'.repeat(Math.floor(selectedBusiness.rating))}
                              {'☆'.repeat(5 - Math.floor(selectedBusiness.rating))}
                            </span>
                            <span className="fw-bold">({selectedBusiness.rating})</span>
                          </div>
                          <div className="mb-2">
                            <Badge bg="primary" className="px-3 py-2">
                              {selectedBusiness.category}
                            </Badge>
                          </div>
                          <div className="text-muted small">
                            <i className="bi bi-people me-1"></i>
                            {selectedBusiness.reviews.length} reviews
                          </div>
                        </div>
                      </Col>
                    </Row>

              <hr />
              
              <Row className="g-4">
                <Col lg={7} md={6}>
                  <div className="bg-light p-3 rounded h-100">
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-list-ul me-2"></i>Menu/Services
                    </h6>
                    <div className="row g-2">
                      {selectedBusiness.menu.map((item, index) => (
                        <div key={index} className="col-lg-6 col-md-12">
                          <div className="d-flex align-items-center p-2 bg-white rounded border h-100">
                            <i className="bi bi-dot text-primary me-2"></i>
                            <span className="fw-medium">{item}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
                <Col lg={5} md={6}>
                  <div className="bg-warning bg-opacity-10 p-3 rounded h-100">
                    <h6 className="text-warning mb-3">
                      <i className="bi bi-star me-2"></i>Customer Reviews
                    </h6>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {selectedBusiness.reviews.map((review, index) => (
                        <div key={index} className="bg-white p-3 rounded mb-3 border">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong className="text-dark">{review.author}</strong>
                            <span className="text-warning fs-6">
                              {'★'.repeat(review.rating)}
                              {'☆'.repeat(5 - review.rating)}
                            </span>
                          </div>
                          <p className="mb-0 text-muted small">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>

            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <div className="d-flex gap-2 w-100">
            <Button variant="outline-secondary" onClick={() => setShowBusinessModal(false)} className="flex-grow-1">
              <i className="bi bi-x-circle me-1"></i>Close
            </Button>
            <Button variant="success" className="flex-grow-1">
              <i className="bi bi-telephone me-1"></i>Call Now
            </Button>
            <Button variant="primary" className="flex-grow-1">
              <i className="bi bi-geo-alt me-1"></i>Get Directions
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export const SimpleNeighborhoodHelpRequests = () => {
  const [newRequest, setNewRequest] = useState({ title: '', description: '', category: 'General' });
  const [requests, setRequests] = useState([
    {
      id: 1,
      title: "Need help moving furniture",
      description: "Moving a heavy dresser from upstairs to downstairs. Need 2-3 people to help. Will provide lunch!",
      category: "Moving",
      author: "Jennifer Smith",
      date: "2024-01-15",
      status: "Open",
      location: "456 Oak Street"
    },
    {
      id: 2,
      title: "Pet sitting needed",
      description: "Going out of town for 3 days. Need someone to feed and walk my dog twice daily. Very friendly golden retriever.",
      category: "Pet Care",
      author: "Robert Wilson",
      date: "2024-01-14",
      status: "Open",
      location: "789 Pine Street"
    },
    {
      id: 3,
      title: "Computer help needed",
      description: "My laptop is running very slow. Need someone tech-savvy to help diagnose and fix the issue. Will pay for your time.",
      category: "Technology",
      author: "Maria Garcia",
      date: "2024-01-13",
      status: "In Progress",
      location: "321 Elm Street"
    },
    {
      id: 4,
      title: "Garden cleanup assistance",
      description: "Need help cleaning up my backyard garden. Raking leaves, trimming bushes, and general maintenance. Tools provided.",
      category: "Garden",
      author: "Tom Anderson",
      date: "2024-01-12",
      status: "Completed",
      location: "123 Main Street"
    },
    {
      id: 5,
      title: "Tutoring for math homework",
      description: "My 8th grader needs help with algebra homework. Looking for someone with teaching experience or strong math skills.",
      category: "Education",
      author: "Sarah Johnson",
      date: "2024-01-11",
      status: "Open",
      location: "654 Maple Avenue"
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newRequest.title && newRequest.description) {
      const request = {
        id: requests.length + 1,
        title: newRequest.title,
        description: newRequest.description,
        category: newRequest.category,
        author: "You",
        date: new Date().toISOString().split('T')[0],
        status: "Open",
        location: "Your Location"
      };
      setRequests([request, ...requests]);
      setNewRequest({ title: '', description: '', category: 'General' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'success';
      case 'In Progress': return 'warning';
      case 'Completed': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Neighborhood Help Requests</h2>
        <Button variant="primary" href="/resident">
          <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
        </Button>
      </div>

      {/* Create New Request */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Request Help</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Brief description of help needed"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                  >
                    <option value="General">General</option>
                    <option value="Moving">Moving</option>
                    <option value="Pet Care">Pet Care</option>
                    <option value="Technology">Technology</option>
                    <option value="Garden">Garden</option>
                    <option value="Education">Education</option>
                    <option value="Home Repair">Home Repair</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Provide more details about what help you need"
                value={newRequest.description}
                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit">
              <i className="bi bi-plus-circle me-2"></i>Post Request
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Requests List */}
      <div className="row">
        {requests.map((request) => (
          <div key={request.id} className="col-md-6 mb-3">
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{request.title}</h6>
                <div>
                  <Badge bg={getStatusColor(request.status)} className="me-2">{request.status}</Badge>
                  <Badge bg="outline-secondary">{request.category}</Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <p className="card-text">{request.description}</p>
                <div className="mb-2">
                  <small className="text-muted">
                    <i className="bi bi-geo-alt me-1"></i>{request.location}
                  </small>
                </div>
                <div className="mb-2">
                  <small className="text-muted">
                    <i className="bi bi-person me-1"></i>By {request.author}
                  </small>
                </div>
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>{request.date}
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-hand-thumbs-up me-1"></i>Help
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    <i className="bi bi-chat me-1"></i>Message
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  );
};
