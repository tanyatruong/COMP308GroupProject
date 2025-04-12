import React, { useState, useEffect } from "react";
import ResidentNavBar from "../commonComponents/ResidentNavBar/ResidentNavBar";
import { Container, Row, Col } from "react-bootstrap";
<<<<<<< HEAD
import { Card, Form, Button, ListGroup } from "react-bootstrap";

// import queries
import { GET_HELP_REQUEST_POSTS } from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.post.queries.js";
import {} from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.comment.queries.js";
// import mutations
import {} from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.post.mutations.js";
import {} from "../../../graphql/NeighborhoodHelpRequests/NeighborhoodHelpRequests.comment.mutations.js";
import { useQuery } from "@apollo/client";

const postFilterEnum = {
  AllPosts: "AllPosts",
  MyPosts: "MyPosts",
};
=======
import Button from "react-bootstrap/Button";
>>>>>>> e6f6811 (neighborhood HelpRequests Comment functionalities of community microservice, WORK)

const NeighborhoodHelpRequests = () => {
  const [postFilter, setPostFilter] = useState(postFilterEnum.AllPosts);
  const [neighborhoodHelpRequestsPosts, setNeighborhoodHelpRequestsPosts] =
    useState(undefined);

  const dummy_data_AllHelpRequestPosts = [
    {
      authorid: "0",
      title: "t0",
      content: "c0",
      comments: ["comm0", "comm1", "comm2"],
    },
    {
      authorid: "1",
      title: "t1",
      content: "c1",
      comments: ["comm0", "comm1", "comm2"],
    },
    {
      authorid: "2",
      title: "t2",
      content: "c2",
      comments: ["comm0", "comm1", "comm2"],
    },
  ];

  // const { data: data_AllHelpRequestPosts } = useQuery(GET_HELP_REQUEST_POSTS);

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
<<<<<<< HEAD
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
          {dummy_data_AllHelpRequestPosts?.length > 0 ? (
            dummy_data_AllHelpRequestPosts.map((post, index) => {
              return (
                <Row>
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
                              {comment}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                        <Form
                        // onSubmit={handleCommentSubmit}
                        >
                          <Form.Group className="mt-3 mb-1">
                            <Form.Control
                              type="text"
                              placeholder="Write a comment..."
                              // value={commentInput}
                              // onChange={(e) => setCommentInput(e.target.value)}
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
=======
      <Container id="filterBarContainer">
        <Row>
          <Col id="filterButtonAllPosts">
            <Button variant="primary">Primary</Button>
          </Col>
          <Col id="filterButtonMyPosts">
            <Button variant="primary">Primary</Button>
          </Col>
        </Row>
      </Container>
      <h1>NeighborhoodHelpRequests</h1>;
>>>>>>> e6f6811 (neighborhood HelpRequests Comment functionalities of community microservice, WORK)
    </>
  );
};

export default NeighborhoodHelpRequests;
