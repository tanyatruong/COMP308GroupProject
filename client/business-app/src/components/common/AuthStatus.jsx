import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';

const AuthStatus = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);

  const refreshFromStorage = () => {
    setUserId(localStorage.getItem('userId'));
    setUsername(localStorage.getItem('username'));
    setRole(localStorage.getItem('role'));
  };

  useEffect(() => {
    refreshFromStorage();

    const onStorage = (e) => {
      if (['userId', 'username', 'role'].includes(e.key)) {
        refreshFromStorage();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    refreshFromStorage();
  };

  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:5173';
  };

  const handleBackToDashboard = () => {
    window.location.href = '/';
  };

  const isLoggedIn = Boolean(userId && username && role);

  return (
    <div className="p-3">
      <Card className="shadow-sm">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <strong>Authentication Status</strong>
            </Col>
            <Col className="text-end">
              {isLoggedIn ? (
                <Badge bg="success">Logged In</Badge>
              ) : (
                <Badge bg="secondary">Logged Out</Badge>
              )}
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {isLoggedIn ? (
            <>
              <p className="mb-2">Welcome, <strong>{username}</strong></p>
              <p className="text-muted mb-4">Role: {role} · User ID: {userId}</p>

              <div className="d-flex gap-2 flex-wrap">
                <Button variant="primary" onClick={handleBackToDashboard}>
                  Back to Dashboard
                </Button>
                <Button variant="outline-danger" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="mb-3">You are not logged in.</p>
              <div className="d-flex gap-2 flex-wrap">
                <Button variant="primary" onClick={handleLogin}>Log In</Button>
                <Button variant="outline-secondary" onClick={handleBackToDashboard}>
                  Back to Dashboard
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AuthStatus;


