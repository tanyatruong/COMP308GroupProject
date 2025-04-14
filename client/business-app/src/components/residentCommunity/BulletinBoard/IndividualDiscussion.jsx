import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Button, Form, ListGroup, Spinner, Alert } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import ResidentNavBar from "../commonComponents/ResidentNavBar/ResidentNavBar";
import { GET_POST_WITH_COMMENTS } from "../../../graphql/queries";
import { ADD_COMMENT } from "../../../graphql/mutations";

const IndividualDiscussion = () => {
  const { postId } = useParams();
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
  
  // Function for date formatting
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
  
  // Query to fetch post details and comments
  const { loading, error, data, refetch } = useQuery(GET_POST_WITH_COMMENTS, {
    variables: { postId },
    fetchPolicy: "network-only",
    onError: (err) => {
      console.error("Error fetching post:", err);
    }
  });
  
  // Mutation to add a comment
  const [addComment, { loading: commentLoading }] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setComment("");
      refetch();
    },
    onError: (error) => {
      console.error("Comment error:", error);
      setErrorMessage(`Error adding comment: ${error.message}`);
    }
  });
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage("Comment cannot be empty");
      return;
    }
    
    try {
      await addComment({ 
        variables: { 
          input: {
            postId,
            text: comment.trim(),
            authorId: currentUserId
          }
        }
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  if (loading) {
    return (
      <Container>
        <ResidentNavBar />
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Loading discussion...</p>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <ResidentNavBar />
        <div className="my-5">
          <Alert variant="danger">
            Error loading discussion: {error.message}
          </Alert>
          <Link to="/resident/bulletinboard">
            <Button variant="primary">Back to Bulletin Board</Button>
          </Link>
        </div>
      </Container>
    );
  }
  
  const post = data?.post;
  
  if (!post) {
    return (
      <Container>
        <ResidentNavBar />
        <div className="my-5">
          <Alert variant="warning">
            Post not found or has been deleted.
          </Alert>
          <Link to="/resident/bulletinboard">
            <Button variant="primary">Back to Bulletin Board</Button>
          </Link>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <ResidentNavBar />
      
      <div className="my-3">
        <Link to="/resident/bulletinboard">
          <Button variant="outline-secondary" size="sm">
            <i className="bi bi-arrow-left"></i> Back to Bulletin Board
          </Button>
        </Link>
      </div>
      
      <Card className="mb-4">
        <Card.Header>
          <h4>{post.title}</h4>
          <div>
            {post.author && (
              <small className="text-muted me-2">Posted by User {post.author.id && post.author.id.substring(0, 6)}</small>
            )}
            <small className="text-muted">{formatDate(post.createdAt)}</small>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text>{post.content}</Card.Text>
        </Card.Body>
      </Card>
      
      <h4>Comments ({post.comments?.length || 0})</h4>
      
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
          {errorMessage}
        </Alert>
      )}
      
      <Form onSubmit={handleAddComment} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Add a Comment</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={2} 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
          />
        </Form.Group>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={commentLoading}
        >
          {commentLoading ? 'Posting...' : 'Post Comment'}
        </Button>
      </Form>
      
      <ListGroup className="mb-4">
        {post.comments?.length > 0 ? (
          post.comments.map(comment => (
            <ListGroup.Item key={comment.id}>
              <div className="d-flex justify-content-between">
                {comment.author && (
                  <strong>User {comment.author.id && comment.author.id.substring(0, 6)}</strong>
                )}
                <small className="text-muted">
                  {formatDate(comment.createdAt)}
                </small>
              </div>
              <p className="mb-0 mt-2">{comment.text}</p>
            </ListGroup.Item>
          ))
        ) : (
          <Alert variant="light">No comments yet. Be the first to comment!</Alert>
        )}
      </ListGroup>
    </Container>
  );
};

export default IndividualDiscussion;
