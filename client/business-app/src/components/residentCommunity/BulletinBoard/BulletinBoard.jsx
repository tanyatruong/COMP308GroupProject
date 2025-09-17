import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, ListGroup, Spinner, Alert, Modal } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_ALL_POSTS } from "../../../graphql/queries";
import { CREATE_POST, DELETE_POST } from "../../../graphql/mutations";

const BulletinBoard = () => {
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [postToDelete, setPostToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [componentReady, setComponentReady] = useState(false);
  
  // Get user ID from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
    if (userId) setCurrentUserId(userId); else setCurrentUserId("");
    
    // Loading layout
    setTimeout(() => {
      setComponentReady(true);
    }, 100);
  }, []);
  
  // Query to fetch all posts
  const { loading, error, data, refetch } = useQuery(GET_ALL_POSTS, {
    fetchPolicy: "network-only",
    onError: (err) => {
      console.error("Error fetching posts:", err);
      setErrorMessage(`Error loading posts: ${err.message}`);
    }
  });
  
  // Mutation to create a new post
  const [createPost, { loading: postLoading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      setNewPost({ title: "", content: "" });
      setSuccessMessage("Post created successfully!");
      refetch();
      
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      setErrorMessage(`Error creating post: ${error.message}`);
    }
  });
  
  // Mutation to delete a post
  const [deletePost, { loading: deleteLoading }] = useMutation(DELETE_POST, {
    onCompleted: () => {
      setSuccessMessage("Post deleted successfully!");
      refetch();
      
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      setErrorMessage(`Error deleting post: ${error.message}`);
    }
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setErrorMessage("Please log in to create a post.");
      return;
    }
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setErrorMessage("Please provide both title and content");
      return;
    }
    
    try {
      await createPost({ 
        variables: { 
          input: {
            title: newPost.title.trim(),
            content: newPost.content.trim(),
            authorId: currentUserId
          }
        }
      });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      await deletePost({ 
        variables: { id: postToDelete.id }
      });
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error during post deletion:", error);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'No date available';
    
    try {
      if (!isNaN(dateValue) && typeof dateValue === 'string') {
        const date = new Date(parseInt(dateValue));
        if (!isNaN(date.getTime())) {
          return date.toLocaleString();
        }
      }
      
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString();
      }
      
      return dateValue;
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Invalid date';
    }
  };
  
  // Check if current user is the author of a post
  const isAuthor = (post) => {
    return post.author && post.author.id === currentUserId;
  };
  
  // Show loading state until component is ready
  if (!componentReady) {
    return (
      <Container>
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p className="mt-2">Loading bulletin board...</p>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="bulletin-board-container pb-5">
      <h2 className="my-4">Community Bulletin Board</h2>
      <p>Stay updated with local news and join discussions with your neighbors</p>
      
      {errorMessage && (
        <Alert variant="danger" dismissible onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}
      
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}
      
      {isLoggedIn ? (
        <Card className="mb-4 shadow-sm">
          <Card.Header as="h5" className="bg-primary text-white">
            <i className="bi bi-pencil-square me-2"></i>Create a New Post
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Title</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter post title" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="form-control-lg"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Content</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  placeholder="What would you like to share with the community?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="form-control-lg"
                />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={postLoading} size="lg">
                <i className="bi bi-send me-2"></i>
                {postLoading ? 'Posting...' : 'Post to Community'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-4 border-warning">
          <Card.Body className="text-center py-4">
            <i className="bi bi-lock-fill text-warning" style={{fontSize: '2rem'}}></i>
            <h5 className="mt-2">Login Required</h5>
            <p className="text-muted">Please log in to create posts and participate in discussions.</p>
            <Button variant="warning" onClick={() => { window.location.href = 'http://127.0.0.1:5173'; }}>
              <i className="bi bi-box-arrow-in-right me-2"></i>Login
            </Button>
          </Card.Body>
        </Card>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Recent Posts</h3>
        <Button variant="outline-secondary" size="sm" onClick={() => refetch()}>
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <p className="mt-2">Loading posts...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">Error loading posts: {error.message}</Alert>
      ) : (
        <div className="row">
          {data?.posts?.map(post => (
            <div key={post.id} className="col-12 mb-3">
              <Card className="shadow-sm h-100">
                <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                  <h5 className="mb-0 text-primary">{post.title}</h5>
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>{formatDate(post.createdAt)}
                  </small>
                </Card.Header>
                <Card.Body>
                  <p className="card-text">{post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {post.author && (
                        <small className="text-muted me-3">
                          <i className="bi bi-person-circle me-1"></i>User-{post.author.id?.substring(0, 6) || 'Unknown'}
                        </small>
                      )}
                      <span className="badge bg-secondary">
                        <i className="bi bi-chat-dots me-1"></i>{post.comments?.length || 0} comments
                      </span>
                    </div>
                    <div>
                      <Link to={`/resident/bulletinboard/${post.id}`}>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          <i className="bi bi-eye me-1"></i>View Discussion
                        </Button>
                      </Link>
                      
                      {/* Delete Button */}
                      {isLoggedIn && isAuthor(post) && (
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(post)}
                        >
                          <i className="bi bi-trash me-1"></i>Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
          
          {(!data?.posts || data.posts.length === 0) && (
            <div className="col-12">
              <Alert variant="info" className="text-center py-4">
                <i className="bi bi-info-circle me-2"></i>
                No posts yet. Be the first to share something with your community!
              </Alert>
            </div>
          )}
        </div>
      )}
      
      {/* Delete Confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this post?
          {postToDelete && (
            <div className="mt-3">
              <h6>Title: {postToDelete.title}</h6>
              <p className="text-muted small">Content: {postToDelete.content}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            disabled={deleteLoading || !isLoggedIn}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Post'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BulletinBoard;
