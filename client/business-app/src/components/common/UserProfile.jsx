import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';

const UserProfile = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    setUsername(localStorage.getItem('username'));
    setRole(localStorage.getItem('role'));
  }, []);

  const goBack = () => window.history.back();

  return (
    <div className="container mt-4">
      <Card className="shadow-sm">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <strong>User Profile</strong>
            </Col>
            <Col className="text-end">
              {role ? <Badge bg="primary">{role}</Badge> : <Badge bg="secondary">Guest</Badge>}
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {username ? (
            <>
              <p className="mb-1"><strong>Username:</strong> {username}</p>
              <p className="mb-1"><strong>User ID:</strong> {userId}</p>
              <p className="text-muted">Your session is stored locally in this browser.</p>
              <div className="d-flex gap-2">
                <Button variant="outline-primary" onClick={goBack}>Back</Button>
              </div>
            </>
          ) : (
            <>
              <p>You are not logged in.</p>
              <div className="d-flex gap-2">
                <Button variant="primary" onClick={() => { window.location.href = 'http://127.0.0.1:5173'; }}>Log in</Button>
                <Button variant="outline-secondary" onClick={goBack}>Back</Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserProfile;

