import React, { useState, useEffect } from "react";
import ResidentNavBar from "../commonComponents/ResidentNavBar/ResidentNavBar";
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
    <>
      <ResidentNavBar />
      <Card className="p-3">
        <Card className="px-3 py-1 mx-1 mb-3 shadow-sm">
          <h1>NeighborhoodHelpRequests</h1>
        </Card>
        <Container id="filterBarContainer">
          <Row>
            <Col
              id="filterButtonAllPosts"
              className="d-flex justify-content-center"
            >
              {/* <Button variant="primary" onClick={handleAllPostsFilterClick}>
                All Posts
              </Button> */}
            </Col>
            <Col
              id="filterButtonMyPosts"
              className="d-flex justify-content-center"
            >
              {/* <Button variant="primary" onClick={handleMyPostsFilterClick}>
                My Posts
              </Button> */}
            </Col>
            <Col id="addPostButton" className="d-flex justify-content-center">
              <Button
                variant="success"
                onClick={() => {
                  setIsAddPostDialogOpen(true);
                }}
              >
                Add Post
              </Button>
            </Col>
          </Row>
        </Container>
        <Container id="postsList">
          {data_AllHelpRequestPosts?.getHelpRequestPosts?.length > 0 ? (
            data_AllHelpRequestPosts?.getHelpRequestPosts.map((post, index) => {
              return (
                <Row key={post.id}>
                  <Col>
                    <Card className="my-4 shadow">
                      {/* TODO Render if loggedin User is author of post */}
                      {post.author.id == loggedInUserID && (
                        <Card.Header>
                          <Container>
                            <Row>
                              <Col
                                id="deletePostButtonCol"
                                className="d-flex justify-content-end"
                              >
                                <Button
                                  variant="danger"
                                  onClick={() => {
                                    setPostToBeDeletedId(post.id);
                                    setPostToBeDeletedTitle(post.title);
                                    setIsDeletePostDialogOpen(true);
                                  }}
                                >
                                  🗑️ Delete Post
                                </Button>
                              </Col>
                            </Row>
                          </Container>
                        </Card.Header>
                      )}
                      <Card.Body>
                        <Card.Title className="d-flex justify-content-between">
                          <div>Title: {post.title}</div>
                          <div>
                            author:{" "}
                            {post?.author?.username ||
                              `Anonymous ${post?.author?.role}`}
                          </div>
                        </Card.Title>
                        {/* <hr /> */}
                        {/* <Card.Text>Content{post.content}</Card.Text> */}
                        <Card>
                          <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                            {post.content}
                          </Card.Text>
                        </Card>
                        <div className="d-flex justify-content-end">
                          <span>
                            Created at:{" "}
                            {new Date(Number(post.createdAt)).toLocaleString(
                              undefined,
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>

                        <hr />

                        <h5>Comments</h5>

                        <ListGroup className="mt-3">
                          {post.comments.map((comment, index) => (
                            <ListGroup.Item key={comment.id}>
                              <Container>
                                {/* <Card
                                id="individualCommentContainer"
                                className="d-flex"
                                > */}

                                <div
                                  id="individualCommentContainer"
                                  // className="d-flex"
                                >
                                  <Row>
                                    <div
                                      id="commentAuthorName"
                                      // className="flex-shrink-1"
                                    >
                                      <strong>
                                        {/* {comment?.resident?.username
                                        ? comment.resident.username
                                        : `Anonymous ${
                                          comment?.resident?.role || ""
                                          }`} */}
                                        {/* Sleeker version of above */}
                                        {comment?.resident?.username ??
                                          `Anonymous ${
                                            comment?.resident?.role ?? ""
                                          }`}
                                      </strong>
                                    </div>
                                  </Row>
                                  <Row>
                                    <Col
                                    // className="flex-grow-1"
                                    >
                                      <div id="commentText">{comment.text}</div>
                                    </Col>
                                    {comment.authorid == loggedInUserID && (
                                      <Col xs="auto">
                                        <div
                                          id="commentDeleteButtonContainer"
                                          // className="flex-shrink-1"
                                        >
                                          <Button
                                            variant="danger"
                                            style={{ fontSize: "small" }}
                                            onClick={async () => {
                                              await deleteHelpRequestComment({
                                                variables: {
                                                  deleteHelpRequestCommentId:
                                                    comment.id,
                                                },
                                                refetchQueries: [
                                                  {
                                                    query:
                                                      GET_HELP_REQUEST_POSTS,
                                                  },
                                                ],
                                              });
                                            }}
                                          >
                                            🗑️
                                          </Button>
                                        </div>
                                      </Col>
                                    )}
                                  </Row>
                                  {/* </Card> */}
                                </div>
                              </Container>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                        <Form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const createCommentInputVariables =
                              commentInputs[post.id];
                            if (!createCommentInputVariables.text?.trim())
                              return;

                            await createHelpRequestComment({
                              variables: {
                                input: {
                                  postid: post.id,
                                  text: createCommentInputVariables.text,
                                  authorid:
                                    createCommentInputVariables.authorid,
                                },
                              },
                              refetchQueries: [
                                { query: GET_HELP_REQUEST_POSTS },
                              ],
                            }).then(() => {
                              // Clear input
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
                          <Form.Group className="mt-3 mb-1">
                            <Form.Control
                              type="text"
                              placeholder="Write a comment..."
                              value={commentInputs[post.id]?.text || ""}
                              onChange={
                                (e) =>
                                  setCommentInputs((prev) => ({
                                    ...prev,
                                    [post.id]: {
                                      text: e.target.value,
                                      authorid: loggedInUserID,
                                    },
                                  }))
                                // authorid, postid, text
                              }
                            />
                          </Form.Group>
                          <div className="d-flex justify-content-end">
                            <Button variant="primary" type="submit">
                              Add Comment
                            </Button>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              );
            })
          ) : (
            <p>Is NOT greater than 0</p>
          )}
        </Container>
      </Card>
      {/* <Container id="filterBarContainer">
        <Row>
          <Col id="filterButtonAllPosts">
            <Button variant="primary">Primary</Button>
          </Col>
          <Col id="filterButtonMyPosts">
            <Button variant="primary">Primary</Button>
          </Col>
        </Row>
      </Container>
      <h1>NeighborhoodHelpRequests</h1>; */}
      {/* Add Post Dialog */}
      {/* New AddPostDialog */}
      <Modal
        show={isAddPostDialogOpen}
        onHide={() => setIsAddPostDialogOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title"
                onChange={(e) => setPostToBeCreatedTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Content"
                onChange={(e) => setPostToBeCreatedContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsAddPostDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={async () => {
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
              setIsAddPostDialogOpen(false);
            }}
          >
            ✏️ Create Post
          </Button>
        </Modal.Footer>
      </Modal>
      {/* OLD AddPostDialog */}
      {/* {isAddPostDialogOpen && (
        <div>
          <h1>Add Post Dialog</h1>
          <div className="modal">
            <div className="modal-content">
              <span
                className="close-btn"
                onClick={() => {
                  setIsAddPostDialogOpen(false);
                }}
              >
                &times;
              </span>
              <h2>Add Post</h2>
              <br />
              <>
                <Form>
                  <Form.Group>
                    <Form.Label>title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="title"
                      onChange={(e) => {
                        setPostToBeCreatedTitle(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>content</Form.Label>
                    <Form.Control
                      as="textarea"
                      aria-label="With textarea"
                      placeholder="content"
                      onChange={(e) => {
                        setPostToBeCreatedContent(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <button
                    className="add-btn"
                    style={{ marginTop: "1rem" }}
                    onClick={async () => {
                      console.log("complete post create Click");
                      await createHelpRequestPost({
                        variables: {
                          input: {
                            title: postToBeCreatedTitle,
                            content: postToBeCreatedContent,
                            authorid: loggedInUserID,
                          },
                        },
                        refetchQueries: [{ query: GET_HELP_REQUEST_POSTS }],
                      }).then(() => {
                        // Clear input
                        setPostToBeCreatedTitle(null);
                        setPostToBeCreatedContent(null);
                        console.log("Post Creation Success");
                      });
                      setIsAddPostDialogOpen(false);
                    }}
                  >
                    ✏️ Complete Create Post
                  </button>
                </Form>
              </>
            </div>
          </div>
        </div>
      )} */}
      {/* Delete Post Dialog */}
      {/* New Delete Post Dialog */}
      <Modal
        show={isDeletePostDialogOpen}
        onHide={() => setIsDeletePostDialogOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete this post?
            <br />
            <strong>Post Title:</strong> {postToBeDeletedTitle}
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
              console.log("Complete delete post click");

              await deleteHelpRequestPost({
                variables: {
                  deleteHelpRequestPostId: postToBeDeletedId,
                },
                refetchQueries: [{ query: GET_HELP_REQUEST_POSTS }],
              });

              setPostToBeDeletedId(null);
              console.log("Post Deletion Success");
              setIsDeletePostDialogOpen(false);
            }}
          >
            🗑️ Delete Post
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Old Delete Post Dialog */}
      {/* {isDeletePostDialogOpen && (
        <div>
          <h1>Delete Post Dialog</h1>
          <div className="modal">
            <div className="modal-content">
              <span
                className="close-btn"
                onClick={() => {
                  setIsDeletePostDialogOpen(false);
                }}
              >
                &times;
              </span>
              <h2>Delete Post</h2>
              <br />
              <strong>postToBeDeletedId:</strong>
              {postToBeDeletedId}
              <>
                <button
                  className="delete-btn"
                  style={{ marginTop: "1rem" }}
                  onClick={async () => {
                    console.log("complete post create Click");
                    // DeleteMutation
                    await deleteHelpRequestPost({
                      variables: {
                        deleteHelpRequestPostId: postToBeDeletedId,
                      },
                      refetchQueries: [{ query: GET_HELP_REQUEST_POSTS }],
                    });
                    // Clear input
                    setPostToBeDeletedId(null);
                    console.log("Post Deletion Success");

                    setIsDeletePostDialogOpen(false);
                  }}
                >
                  🗑️ Complete Delete Post
                </button>
              </>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default NeighborhoodHelpRequests;
