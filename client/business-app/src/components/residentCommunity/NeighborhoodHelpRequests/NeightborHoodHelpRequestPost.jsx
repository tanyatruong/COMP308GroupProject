import React, { useState } from 'react';
import { Card, Form, Button, ListGroup } from 'react-bootstrap';

const Post = () => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim() !== '') {
      setComments([...comments, commentInput.trim()]);
      setCommentInput('');
    }
  };

  return (
    <Card className="my-4">
      <Card.Body>
        <Card.Title>My First Post</Card.Title>
        <Card.Text>
          This is the content of the post. It can be a short story, an update, or anything you want to share.
        </Card.Text>

        <hr />

        <h5>Comments</h5>
        <Form onSubmit={handleCommentSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Comment
          </Button>
        </Form>

        <ListGroup className="mt-3">
          {comments.map((comment, index) => (
            <ListGroup.Item key={index}>{comment}</ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Post;
