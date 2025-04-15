import React, { useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Button, Form, ListGroup, Spinner, Alert, Badge } from "react-bootstrap";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import ResidentNavBar from "../commonComponents/ResidentNavBar/ResidentNavBar";
import { GET_POST_WITH_COMMENTS, SUMMARIZE_DISCUSSION } from "../../../graphql/queries";
import { ADD_COMMENT, DELETE_POST } from "../../../graphql/mutations";

const IndividualDiscussion = () => {
  const { postId } = useParams();
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
      setErrorMessage(`Error loading discussion: ${err.message}`);
    }
  });
  
  // Mutation to add a comment
  const [addComment, { loading: commentLoading }] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setComment("");
      setSuccessMessage("Comment added successfully!");
      refetch();
      
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      console.error("Comment error:", error);
      setErrorMessage(`Error adding comment: ${error.message}`);
    }
  });
  
  // Mutation to delete post
  const [deletePost, { loading: deleteLoading }] = useMutation(DELETE_POST, {
    onCompleted: () => {
      setSuccessMessage("Post deleted successfully! Redirecting...");
      
      setTimeout(() => {
        window.location.href = "/resident/bulletinboard";
      }, 2000);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      setErrorMessage(`Error deleting post: ${error.message}`);
    }
  });
  
  // AI Summary functionality
  const [getDiscussionSummary, { loading: summaryLoading, data: summaryData }] = 
    useLazyQuery(SUMMARIZE_DISCUSSION);
  
  const handleSummarizeDiscussion = () => {
    if (!data?.post) return;
    
    // Extract post content and comments
    const postContent = data.post.content || '';
    const commentsContent = data.post.comments?.map(comment => comment.text) || [];
    
    // Combine all content
    const allContent = [postContent, ...commentsContent];
    
    // Call the AI endpoint
    getDiscussionSummary({ 
      variables: { posts: allContent }
    });
  };
  
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
  
  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        await deletePost({
          variables: { id: postId }
        });
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };
  
  // Check if current user is the author of the post
  const isAuthor = (post) => {
    return post?.author && post.author.id === currentUserId;
  };
  
  if (loading) {
    return (
      <Container>
        <ResidentNavBar />
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p className="mt-3">Loading discussion...</p>
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
      
      <div className="d-flex justify-content-between align-items-center my-3">
        <Link to="/resident/bulletinboard">
          <Button variant="outline-secondary" size="sm">
            <i className="bi bi-arrow-left"></i> Back to Bulletin Board
          </Button>
        </Link>
        
        {isAuthor(post) && (
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={handleDeletePost}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Post'}
          </Button>
        )}
      </div>
      
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert variant="danger" dismissible onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header>
          <h4>{post.title}</h4>
          <div className="d-flex justify-content-between align-items-center">
            {post.author && (
              <small className="text-muted">
                Posted by User-{post.author.id?.substring(0, 6) || 'Unknown'}
              </small>
            )}
            <small className="text-muted">{formatDate(post.createdAt)}</small>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text>{post.content}</Card.Text>
        </Card.Body>
      </Card>
      
      {/* AI Summary */}
      <div className="mb-4">
        <Button 
          variant="outline-info" 
          onClick={handleSummarizeDiscussion}
          disabled={summaryLoading}
          className="mb-3"
        >
          {summaryLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Generating AI Summary...
            </>
          ) : (
            <>
              <i className="bi bi-robot me-2"></i>
              Summarize Discussion with AI
            </>
          )}
        </Button>
        
        {summaryData?.summarizeDiscussion && (
          <Card className="border-info mb-4">
            <Card.Header className="bg-info bg-opacity-10">
              <div className="d-flex align-items-center">
                <i className="bi bi-robot me-2"></i>
                <span>AI Discussion Summary</span>
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>{summaryData.summarizeDiscussion}</Card.Text>
            </Card.Body>
            <Card.Footer className="bg-light text-muted small">
              <i className="bi bi-info-circle me-2"></i>
              This summary was generated by AI and may not be completely accurate.
            </Card.Footer>
          </Card>
        )}
      </div>
      
      <h4>Comments ({post.comments?.length || 0})</h4>
      
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
          {commentLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Posting...
            </>
          ) : 'Post Comment'}
        </Button>
      </Form>
      
      <ListGroup className="mb-4">
        {post.comments?.length > 0 ? (
          post.comments.map(comment => (
            <ListGroup.Item key={comment.id}>
              <div className="d-flex justify-content-between">
                {comment.author && (
                  <strong>User-{comment.author.id?.substring(0, 6) || 'Unknown'}</strong>
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
