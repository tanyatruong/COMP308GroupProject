import React from 'react';
import { Spinner, Container } from 'react-bootstrap';
import './UI.css';

const Loader = () => {
  return (
    <Container className="text-center my-5">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
};

export default Loader;