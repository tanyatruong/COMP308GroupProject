import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Card, Form, Button, ListGroup, Modal } from "react-bootstrap";
import "./NeighborhoodHelpRequests.css";
// import "../NeighborhoodHelpRequests/NeighborhoodHelpRequests.css";

// import queries
import { GET_HELP_REQUEST_POSTS } from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.post.queries.js";
import { GET_HELP_REQUEST_COMMENTS_OF_SPECIFIC_HELP_REQUEST_POST } from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.comment.queries.js";
// import mutations
import {
  CREATE_HELP_REQUEST_POST,
  DELETE_HELP_REQUEST_POST,
} from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.post.mutations.js";
import {
  CREATE_AND_ADD_HELP_REQUEST_COMMENT_TO_HELP_REQUEST_POST,
  DELETE_HELP_REQUEST_COMMENT,
} from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.comment.mutations.js";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

const postFilterEnum = {
  AllPosts: "AllPosts",
  MyPosts: "MyPosts",
};

const NeighborhoodHelpRequests = () => {
  const [validated, setValidated] = useState(false);
  const [isAddPostDialogOpen, setIsAddPostDialogOpen] = useState(false);
  const [postToBeCreatedTitle, setPostToBeCreatedTitle] = useState();
  const [postToBeCreatedContent, setPostToBeCreatedContent] = useState();
  const [isDeletePostDialogOpen, setIsDeletePostDialogOpen] = useState(false);
  const [postToBeDeletedId, setPostToBeDeletedId] = useState(null);
  const [postToBeDeletedTitle, setPostToBeDeletedTitle] = useState(null);

  const [postFilter, setPostFilter] = useState(postFilterEnum.AllPosts);
  const [loggedInUserID, setLoggedInUserID] = useState(
    localStorage.getItem("userId")
  );
  const isLoggedIn = Boolean(loggedInUserID);
  const [loggedInUserRole, setLoggedInUserRole] = useState(
    localStorage.getItem("role")
  );
  const [loggedInUserUsername, setLoggedInUserUsername] = useState(
    localStorage.getItem("username")
  );
  const [neighborhoodHelpRequestsPosts, setNeighborhoodHelpRequestsPosts] =
    useState(undefined);
  const [posts, setPosts] = useState(undefined);

  const { data: data_AllHelpRequestPosts } = useQuery(GET_HELP_REQUEST_POSTS);
  const [createHelpRequestPost] = useMutation(CREATE_HELP_REQUEST_POST);
  const [deleteHelpRequestPost] = useMutation(DELETE_HELP_REQUEST_POST);
  const [createHelpRequestComment] = useMutation(
    CREATE_AND_ADD_HELP_REQUEST_COMMENT_TO_HELP_REQUEST_POST
  );
  const [deleteHelpRequestComment] = useMutation(DELETE_HELP_REQUEST_COMMENT);
  const [commentInputs, setCommentInputs] = useState({});

  const [getCommentForPost, { data: data_GetCommentForPost }] = useLazyQuery(
    GET_HELP_REQUEST_COMMENTS_OF_SPECIFIC_HELP_REQUEST_POST
  );

  const handleAllPostsFilterClick = () => {
    setPostFilter(postFilterEnum.AllPosts);
    console.log("postFilter set to: AllPosts");
    // console.log("postFilter set to: " + postFilter);
  };
  const handleMyPostsFilterClick = () => {
    setPostFilter(postFilterEnum.MyPosts);
    console.log("postFilter set to: MyPosts");
    // console.log("postFilter set to: " + postFilter);
  };
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="text-primary mb-2">
            <i className="bi bi-heart-fill me-2"></i>Neighborhood Help Requests
          </h1>
          <p className="text-muted">Connect with neighbors who need assistance or offer help to your community</p>
        </div>
        <div>
          {isLoggedIn ? (
            <Button
              variant="success"
              size="lg"
              onClick={() => setIsAddPostDialogOpen(true)}
              className="shadow-sm"
            >
              <i className="bi bi-plus-circle me-2"></i>Add Help Request
            </Button>
          ) : (
            <div className="text-center">
              <Button
                variant="outline-warning"
                size="lg"
                onClick={() => { window.location.href = 'http://127.0.0.1:5173'; }}
                className="shadow-sm"
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>Login to Post
              </Button>
              <p className="text-muted small mt-2">Login required to create help requests</p>
            </div>
          )}
        </div>
      </div>
      <div className="row">
        {data_AllHelpRequestPosts?.getHelpRequestPosts?.length > 0 ? (
          data_AllHelpRequestPosts?.getHelpRequestPosts.map((post, index) => {
            return (
              <div key={post.id} className="col-12 mb-4">
                <Card className="shadow-sm h-100">
                  {post.author.id == loggedInUserID && (
                    <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center">
                      <span><i className="bi bi-person-badge me-2"></i>Your Post</span>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => {
                          setPostToBeDeletedId(post.id);
                          setPostToBeDeletedTitle(post.title);
                          setIsDeletePostDialogOpen(true);
                        }}
                      >
                        <i className="bi bi-trash me-1"></i>Delete
                      </Button>
                    </Card.Header>
                  )}
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h4 className="text-primary mb-0">{post.title}</h4>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {new Date(Number(post.createdAt)).toLocaleString(undefined, {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                    
                    <div className="mb-3">
                      <span className="badge bg-info me-2">
                        <i className="bi bi-person-circle me-1"></i>
                        {post?.author?.username || `Anonymous ${post?.author?.role}`}
                      </span>
                    </div>
                    
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                          {post.content}
                        </p>
                      </Card.Body>
                    </Card>

                    <hr className="my-4" />

                    <h5 className="text-secondary mb-3">
                      <i className="bi bi-chat-dots me-2"></i>Comments ({post.comments.length})
                    </h5>

                    <div className="comments-section">
                      {post.comments.map((comment, index) => (
                        <div key={comment.id} className="comment-item mb-3 p-3 bg-light rounded">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-2">
                                <strong className="text-primary me-2">
                                  {comment?.resident?.username ?? `Anonymous ${comment?.resident?.role ?? ""}`}
                                </strong>
                                <small className="text-muted">
                                  <i className="bi bi-clock me-1"></i>
                                  {new Date(Number(comment.createdAt)).toLocaleString()}
                                </small>
                              </div>
                              <p className="mb-0">{comment.text}</p>
                            </div>
                            {isLoggedIn && comment.authorid == loggedInUserID && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={async () => {
                                  await deleteHelpRequestComment({
                                    variables: {
                                      deleteHelpRequestCommentId: comment.id,
                                    },
                                    refetchQueries: [
                                      {
                                        query: GET_HELP_REQUEST_POSTS,
                                      },
                                    ],
                                  });
                                }}
                                className="ms-2"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      {isLoggedIn ? (
                        <Form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const createCommentInputVariables = commentInputs[post.id];
                            if (!createCommentInputVariables.text?.trim()) return;

                            await createHelpRequestComment({
                              variables: {
                                input: {
                                  postid: post.id,
                                  text: createCommentInputVariables.text,
                                  authorid: createCommentInputVariables.authorid,
                                },
                              },
                              refetchQueries: [{ query: GET_HELP_REQUEST_POSTS }],
                            }).then(() => {
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: {
                                  text: "",
                                  authorid: loggedInUserID,
                                },
                              }));
                            });
                          }}
                        >
                          <div className="input-group">
                            <Form.Control
                              type="text"
                              placeholder="Write a helpful comment..."
                              value={commentInputs[post.id]?.text || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [post.id]: {
                                    text: e.target.value,
                                    authorid: loggedInUserID,
                                  },
                                }))
                              }
                              className="form-control-lg"
                            />
                            <Button variant="primary" type="submit" className="px-4">
                              <i className="bi bi-send me-1"></i>Comment
                            </Button>
                          </div>
                        </Form>
                      ) : (
                        <div className="text-center p-3 bg-warning bg-opacity-10 rounded">
                          <p className="text-muted mb-2">
                            <i className="bi bi-lock-fill me-1"></i>
                            Please log in to comment and help your neighbors
                          </p>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => { window.location.href = 'http://127.0.0.1:5173'; }}
                          >
                            <i className="bi bi-box-arrow-in-right me-1"></i>Login
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-heart text-muted" style={{fontSize: '3rem'}}></i>
              <h4 className="text-muted mt-3">No Help Requests Yet</h4>
              <p className="text-muted">Be the first to ask for help or offer assistance to your community!</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Post Dialog */}
      <Modal
        show={isAddPostDialogOpen}
        onHide={() => {
          setIsAddPostDialogOpen(false);
          setValidated(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Help Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              if (form.checkValidity() === false) {
                e.stopPropagation();
                setValidated(true);
                return;
              }

              await createHelpRequestPost({
                variables: {
                  input: {
                    title: postToBeCreatedTitle,
                    content: postToBeCreatedContent,
                    authorid: loggedInUserID,
                  },
                },
                refetchQueries: [{ query: GET_HELP_REQUEST_POSTS }],
              });

              setValidated(false);
              setIsAddPostDialogOpen(false);
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="What do you need help with?"
                value={postToBeCreatedTitle}
                onChange={(e) => setPostToBeCreatedTitle(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a title for your help request.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={4}
                placeholder="Describe what you need help with in detail..."
                value={postToBeCreatedContent}
                onChange={(e) => setPostToBeCreatedContent(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a description of your help request.
              </Form.Control.Feedback>
            </Form.Group>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddPostDialogOpen(false);
                  setValidated(false);
                }}
              >
                Cancel
              </Button>
              <Button variant="success" type="submit">
                <i className="bi bi-plus-circle me-1"></i>Create Help Request
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Post Dialog */}
      <Modal
        show={isDeletePostDialogOpen}
        onHide={() => setIsDeletePostDialogOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Help Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete this help request?
            <br />
            <strong>Title:</strong> {postToBeDeletedTitle}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsDeletePostDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              await deleteHelpRequestPost({
                variables: {
                  deleteHelpRequestPostId: postToBeDeletedId,
                },
                refetchQueries: [{ query: GET_HELP_REQUEST_POSTS }],
              });

              setPostToBeDeletedId(null);
              setIsDeletePostDialogOpen(false);
            }}
          >
            <i className="bi bi-trash me-1"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NeighborhoodHelpRequests;
