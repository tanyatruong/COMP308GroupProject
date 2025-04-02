import React from 'react';
import { Alert } from 'react-bootstrap';
import './UI.css';

const ErrorMessage = ({ message }) => {
  return (
    <Alert variant="danger" className="my-3">
      <Alert.Heading>Error!</Alert.Heading>
      <p>{message || 'An unexpected error occurred. Please try again.'}</p>
    </Alert>
  );
};

export default ErrorMessage;