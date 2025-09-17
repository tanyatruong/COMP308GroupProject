import React, {useState} from 'react'
import { Card, Container, Form, Button, Alert} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import './auth.css';
import {gql, useMutation} from '@apollo/client'

const RES_SIGNUP = gql`
    mutation ResSignup($role: String!, $username: String!, $password: String!, $location: LocationInput!, $interests: [String!]!) {
        resSignup(role: $role, username: $username, password: $password, location: $location, interests: $interests) {
            id
            role
        }
    }
`
const CO_SIGNUP = gql`
    mutation CoSignup($role: String!, $username: String!, $password: String!) {
        coSignup(role: $role, username: $username, password: $password) {
            id
            role
        }
    }
`
const BO_SIGNUP = gql`
    mutation BoSignup($role: String!, $username: String!, $password: String!) {
        boSignup(role: $role, username: $username, password: $password) {
            id
            role
        }
    }
`

const SignUp = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [interests, setInterests] = useState('');
    const [location, setLocation] = useState({
        city: '',
        postalCode: '',
        address: ''
    });
    const [resSignup] = useMutation(RES_SIGNUP);
    const [coSignup] = useMutation(CO_SIGNUP);
    const [boSignup] = useMutation(BO_SIGNUP);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            let response;
            if (role === 'Resident') {
                response = await resSignup({
                    variables: {
                        role,
                        username,
                        password,
                        location,
                        interests: interests.split(',').map(interest => interest.trim()).filter(interest => interest)
                    }
                });
            } else if (role === "CommunityOrganizer") {
                response = await coSignup({
                    variables: {
                        role,
                        username,
                        password
                    }
                });
            } else if (role === "BusinessOwner") {
                response = await boSignup({
                    variables: {
                        role,
                        username,
                        password
                    }
                });
            }
            
            if (response && response.data) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.message);
        }
    }

  return (
    <div className="auth-container">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="auth-card">
          <Card.Header className="auth-header">
            <h2 className="text-center mb-0">
              <i className="bi bi-person-plus me-2"></i>Join Our Community
            </h2>
            <p className="text-center text-muted mb-0">Create your account today</p>
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
                  placeholder="Choose a username"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control-lg"
                  placeholder="Create a password"
                />
              </Form.Group>

              {role === 'Resident' && (
                <>
                  <hr className="my-4" />
                  <h5 className="mb-3">Resident Information</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      value={location.city}
                      onChange={(e) => setLocation({ ...location, city: e.target.value })}
                      required={role === 'Resident'}
                      className="form-control-lg"
                      placeholder="Enter your city"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={location.address}
                      onChange={(e) => setLocation({ ...location, address: e.target.value })}
                      required={role === 'Resident'}
                      className="form-control-lg"
                      placeholder="Enter your address"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={location.postalCode}
                      onChange={(e) => setLocation({ ...location, postalCode: e.target.value })}
                      required={role === 'Resident'}
                      className="form-control-lg"
                      placeholder="Enter postal code"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Interests</Form.Label>
                    <Form.Control
                      type="text"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      required={role === 'Resident'}
                      className="form-control-lg"
                      placeholder="e.g., community events, volunteering, local businesses"
                    />
                    <Form.Text className="text-muted">
                      Separate multiple interests with commas
                    </Form.Text>
                  </Form.Group>
                </>
              )}

              <div className="d-grid gap-2 mb-3">
                <Button variant="success" type="submit" size="lg" className="auth-btn">
                  <i className="bi bi-person-plus me-2"></i>Create Account
                </Button>
              </div>

              <div className="text-center">
                <p className="mb-0">
                  Already have an account? 
                  <Button variant="link" onClick={() => navigate('/login')} className="p-0 ms-1">
                    Sign in here
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

export default SignUp
