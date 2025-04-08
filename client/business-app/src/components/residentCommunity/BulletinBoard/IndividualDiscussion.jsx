import React, { useState } from "react";
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
  
  // Query to fetch post details and comments
  const { loading, error, data, refetch } = useQuery(GET_POST_WITH_COMMENTS, {
    variables: { postId },
    skip: !postId
  });
  
  // Mutation to add a comment
  const [addComment, { loading: commentLoading }] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setComment("");
      refetch();
    },
    onError: (error) => {
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
            text: comment,
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
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Error loading discussion: {error.message}</Alert>
        <Link to="/resident/bulletinboard">
          <Button variant="primary">Back to Bulletin Board</Button>
        </Link>
      </Container>
    );
  }
  
  const post = data?.post;
  
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
      
      {post && (
        <>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>{post.title}</h4>
              <div>
              <small className="text-muted me-2">Posted by User {post.author.id}</small>
              <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>{post.content}</Card.Text>
            </Card.Body>
          </Card>
          
          <h4>Comments ({post.comments?.length || 0})</h4>
          
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          
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
            {post.comments?.map(comment => (
              <ListGroup.Item key={comment.id}>
                <div className="d-flex justify-content-between">
                <strong>User {comment.author.id}</strong>
                <small className="text-muted">
                    {new Date(comment.createdAt).toLocaleString()}
                  </small>
                </div>
                <p className="mb-0 mt-2">{comment.text}</p>
              </ListGroup.Item>
            ))}
            
            {(!post.comments || post.comments.length === 0) && (
              <Alert variant="light">No comments yet. Be the first to comment!</Alert>
            )}
          </ListGroup>
        </>
      )}
    </Container>
  );
};

export default IndividualDiscussion;
