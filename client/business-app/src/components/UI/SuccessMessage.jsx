import React from 'react';
import { Alert } from 'react-bootstrap';
import './UI.css';

const SuccessMessage = ({ message }) => {
  return (
    <Alert variant="success" className="my-3">
      <Alert.Heading>Success!</Alert.Heading>
      <p>{message}</p>
    </Alert>
  );
};

export default SuccessMessage;