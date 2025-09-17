import React, {useState} from 'react'
import { Card, Container, Form, Button, Alert} from 'react-bootstrap'
import './auth.css';
import {gql, useMutation} from '@apollo/client'
import { useNavigate } from 'react-router-dom';

const LOGIN = gql`
    mutation Login($role: String!, $username: String!, $password: String!) {
        Login(role: $role, username: $username, password: $password) {
        ... on Resident {
            id
            role
            }
        ... on BusinessOwner {
            id
            role
            }
        ... on CommunityOrganizer {
            id
            role
            }
        }
    }
`

const LogIn = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [login] = useMutation(LOGIN);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try{
            const response = await login({
                variables: {
                    role,
                    username,
                    password
                }
            });
            if(response.data.Login){
                const user = response.data.Login;
                // Save user data to localStorage
                localStorage.setItem('userId', user.id);
                localStorage.setItem('username', username);
                localStorage.setItem('role', user.role);
                
                if(user.role === "BusinessOwner"){
                    navigate('/businessdashboard');
                }
                if(user.role === "Resident"){
                    navigate('/residentdashboard');
                }
                if(user.role === "CommunityOrganizer"){
                    navigate('/residentdashboard');
                }
            }
        }catch(err){
            setError(err.message);
        }
    }
    
  return (
    <div className="auth-container">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="auth-card">
          <Card.Header className="auth-header">
            <h2 className="text-center mb-0">
              <i className="bi bi-person-circle me-2"></i>Welcome Back
            </h2>
            <p className="text-center text-muted mb-0">Sign in to your account</p>
          </Card.Header>
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              {error && (
                <Alert variant="danger" className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="form-control-lg"
                >
                  <option value="">Select your role</option>
                  <option value="Resident">Resident</option>
                  <option value="BusinessOwner">Business Owner</option>
                  <option value="CommunityOrganizer">Community Organizer</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="form-control-lg"
                  placeholder="Enter your username"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control-lg"
                  placeholder="Enter your password"
                />
              </Form.Group>

              <div className="d-grid gap-2 mb-3">
                <Button variant="primary" type="submit" size="lg" className="auth-btn">
                  <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                </Button>
              </div>

              <div className="text-center">
                <p className="mb-0">
                  Don't have an account? 
                  <Button variant="link" onClick={() => navigate('/signup')} className="p-0 ms-1">
                    Sign up here
                  </Button>
                </p>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default LogIn
