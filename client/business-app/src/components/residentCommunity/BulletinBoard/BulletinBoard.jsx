import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, ListGroup, Spinner, Alert, Modal } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import ResidentNavBar from "../commonComponents/ResidentNavBar/ResidentNavBar";
import { GET_ALL_POSTS } from "../../../graphql/queries";
import { CREATE_POST, DELETE_POST } from "../../../graphql/mutations";

const BulletinBoard = () => {
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [postToDelete, setPostToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  
  // Get user ID from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    console.log("LocalStorage userId:", userId);
    
    if (userId) {
      console.log("Using stored user ID:", userId);
      setCurrentUserId(userId);
    } else {
      // Fall back to test ID for testing
      console.log("No userId in localStorage, using test ID");
      setCurrentUserId("507f1f77bcf86cd799439011");
    }
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
  
  return (
    <Container>
      <ResidentNavBar />
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
      
      <Card className="mb-4">
        <Card.Header as="h5">Create a New Post</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter post title" 
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="What would you like to share with the community?"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={postLoading}>
              {postLoading ? 'Posting...' : 'Post'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      
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
        <ListGroup className="mb-4">
          {data?.posts?.map(post => (
            <ListGroup.Item key={post.id} className="mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <h5>{post.title}</h5>
                <small className="text-muted">{formatDate(post.createdAt)}</small>
              </div>
              <p>{post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}</p>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  {post.author && (
                    <small className="text-muted me-3">
                      By: User-{post.author.id?.substring(0, 6) || 'Unknown'}
                    </small>
                  )}
                  <span>
                    <i className="bi bi-chat-dots"></i> {post.comments?.length || 0} comments
                  </span>
                </div>
                <div>
                  <Link to={`/resident/bulletinboard/${post.id}`}>
                    <Button variant="outline-primary" size="sm" className="me-2">View Discussion</Button>
                  </Link>
                  
                  {/* Delete Button */}
                  {isAuthor(post) && (
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteClick(post)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </ListGroup.Item>
          ))}
          
          {(!data?.posts || data.posts.length === 0) && (
            <Alert variant="info">No posts yet. Be the first to share something!</Alert>
          )}
        </ListGroup>
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
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Post'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BulletinBoard;
