import React, { useState } from "react";
import { Container, Card, Button, Form, ListGroup, Spinner, Alert } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import ResidentNavBar from "../commonComponents/ResidentNavBar/ResidentNavBar";
import { GET_ALL_POSTS } from "../../../graphql/queries";
import { CREATE_POST } from "../../../graphql/mutations";

const BulletinBoard = () => {
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [errorMessage, setErrorMessage] = useState("");
  
  const currentUserId = "12345"; // test
  
  // Query to fetch all posts
  const { loading, error, data, refetch } = useQuery(GET_ALL_POSTS);
  
  // Mutation to create a new post
  const [createPost, { loading: postLoading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      setNewPost({ title: "", content: "" });
      refetch(); // Refresh the posts list
    },
    onError: (error) => {
      setErrorMessage(`Error creating post: ${error.message}`);
    }
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      setErrorMessage("Please provide both title and content");
      return;
    }
    
    try {
      await createPost({ 
        variables: { 
          input: {
            ...newPost,
            authorId: currentUserId 
          }
        }
      });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  
  return (
    <Container>
      <ResidentNavBar />
      <h2 className="my-4">Community Bulletin Board</h2>
      <p>Stay updated with local news and join discussions with your neighbors</p>
      
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      
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
      
      <h3>Recent Posts</h3>
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">Error loading posts: {error.message}</Alert>
      ) : (
        <ListGroup className="mb-4">
          {data?.posts?.map(post => (
            <ListGroup.Item key={post.id} className="mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <h5>{post.title}</h5>
                <small className="text-muted">{new Date(post.createdAt).toLocaleDateString()}</small>
              </div>
              <p>{post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}</p>
              <div className="d-flex justify-content-between">
                <div>
                  <i className="bi bi-chat"></i> {post.comments?.length || 0} comments
                </div>
                <Link to={`/resident/bulletinboard/${post.id}`}>
                  <Button variant="outline-primary" size="sm">View Discussion</Button>
                </Link>
              </div>
            </ListGroup.Item>
          ))}
          
          {(!data?.posts || data.posts.length === 0) && (
            <Alert variant="info">No posts yet. Be the first to share something!</Alert>
          )}
        </ListGroup>
      )}
    </Container>
  );
};

export default BulletinBoard;
