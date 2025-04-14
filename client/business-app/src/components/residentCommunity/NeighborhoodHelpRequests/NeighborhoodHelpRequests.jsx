import React, { useState, useEffect } from "react";
import ResidentNavBar from "../commonComponents/ResidentNavBar/ResidentNavBar";
import { Container, Row, Col } from "react-bootstrap";
import { Card, Form, Button, ListGroup } from "react-bootstrap";

// import queries
import { GET_HELP_REQUEST_POSTS } from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.post.queries.js";
import { GET_HELP_REQUEST_COMMENTS_OF_SPECIFIC_HELP_REQUEST_POST } from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.comment.queries.js";
// import mutations
import {} from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.post.mutations.js";
import { CREATE_AND_ADD_HELP_REQUEST_COMMENT_TO_HELP_REQUEST_POST } from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.comment.mutations.js";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";

const postFilterEnum = {
  AllPosts: "AllPosts",
  MyPosts: "MyPosts",
};

const NeighborhoodHelpRequests = () => {
  const [postFilter, setPostFilter] = useState(postFilterEnum.AllPosts);
  const [loggedInUserID, setLoggedInUserID] = useState(
    localStorage.getItem("userId")
  );
  const [neighborhoodHelpRequestsPosts, setNeighborhoodHelpRequestsPosts] =
    useState(undefined);
  const [posts, setPosts] = useState(undefined);

  // const dummy_data_AllHelpRequestPosts = [
  //   {
  //     authorid: "0",
  //     title: "t0",
  //     content: "c0",
  //     comments: ["comm0", "comm1", "comm2"],
  //   },
  //   {
  //     authorid: "1",
  //     title: "t1",
  //     content: "c1",
  //     comments: ["comm0", "comm1", "comm2"],
  //   },
  //   {
  //     authorid: "2",
  //     title: "t2",
  //     content: "c2",
  //     comments: ["comm0", "comm1", "comm2"],
  //   },
  // ];

  const { data: data_AllHelpRequestPosts } = useQuery(GET_HELP_REQUEST_POSTS);
  const [createHelpRequestComment] = useMutation(
    CREATE_AND_ADD_HELP_REQUEST_COMMENT_TO_HELP_REQUEST_POST
  );
  // useEffect(() => {
  //   data_AllHelpRequestPosts?.getHelpRequestPosts.forEach((post) => {});
  // }, [data_AllHelpRequestPosts]);

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
              <Button variant="primary" onClick={handleAllPostsFilterClick}>
                All Posts
              </Button>
            </Col>
            <Col
              id="filterButtonMyPosts"
              className="d-flex justify-content-center"
            >
              <Button variant="primary" onClick={handleMyPostsFilterClick}>
                My Posts
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
                    {/* <Card style={{ width: "18rem" }}>
                  <Card.Body>
                  <Card.Title>Post Title</Card.Title>
                  <Card.Text>Post Content</Card.Text>
                  <Button variant="primary">View Individual Post</Button>
                  </Card.Body>
                  </Card> */}
                    <Card className="my-4 shadow">
                      <Card.Body>
                        <Card.Title className="d-flex justify-content-between">
                          <div>Title: {post.title}</div>
                          <div>authorid: {post.authorid}</div>
                        </Card.Title>
                        <hr />
                        <Card.Text>Content{post.content}</Card.Text>

                        <hr />

                        <h5>Comments</h5>

                        <ListGroup className="mt-3">
                          {post.comments.map((comment, index) => (
                            <ListGroup.Item key={index}>
                              <strong>
                                {comment.authorid || "Anonymous"}:
                              </strong>{" "}
                              {comment.text}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                        <Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const createCommentInputVariables =
                              commentInputs[post.id];
                            if (!createCommentInputVariables.text?.trim())
                              return;

                            createHelpRequestComment({
                              variables: {
                                postid: post.id,
                                text: createCommentInputVariables.text,
                                authorid: createCommentInputVariables.authorid,
                              },
                            }).then(() => {
                              // Clear input
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: "",
                              }));
                            });
                          }}
                        >
                          <Form.Group className="mt-3 mb-1">
                            <Form.Control
                              type="text"
                              placeholder="Write a comment..."
                              onChange={
                                (e) =>
                                  setCommentInputs((prev) => ({
                                    ...prev,
                                    [post.id]: {
                                      text: e.target.value,
                                      authorid: loggedInUserID, //TODO POSSIBLY BAD
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
      <Button
        onClick={() => {
          // getPosts();
        }}
      >
        Get Posts
      </Button>
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
    </>
  );
};

export default NeighborhoodHelpRequests;
