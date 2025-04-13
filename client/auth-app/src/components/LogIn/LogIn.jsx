import React, {useState} from 'react'
import { Card, Container, Form} from 'react-bootstrap'
import './login.css';
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
    const [formData, setFormData] = useState({
        role: '',
        username: '',
        password: ''
    });
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
                if(user.role === "BusinessOwner"){
                    navigate('/businessdashboard');
                }
                // Add other roles once they are created
            }
        }catch(err){
            setError(err.message);
        }
    }
  return (
    <Container>
        <Card className='card'>
        <Form onSubmit={handleSubmit}>
            <Card.Header as="h2" className="title">Log In</Card.Header>
            {error && (
                <div className="errorMsg mt-3" role="alert">
                    {error}
                </div>
            )}
            <table className="table borderless" style={{ width: 'auto' }}>
                <tbody>
                <tr>
                    <td className="label">
                    <Form.Label htmlFor="role">Role:</Form.Label>
                    </td>
                    <td className='roleSelect'>
                    <Form.Select
                        className='input'
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="Resident">Resident</option>
                        <option value="BusinessOwner">Business Owner</option>
                        <option value="CommunityOrganizer">Community Organizer</option>
                    </Form.Select>
                    </td>
                </tr>

                <tr>
                    <td className="label">
                    <Form.Label htmlFor="username">Username:</Form.Label>
                    </td>
                    <td>
                    <Form.Control
                        className='input'
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    </td>
                </tr>

                <tr>
                    <td className="label">
                    <Form.Label htmlFor="password">Password:</Form.Label>
                    </td>
                    <td>
                    <Form.Control
                        className='input'
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </td>
                </tr>
                </tbody>
            </table>
            
            <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary">Log In</button>
            </div>
            </Form>
        </Card>    
    </Container>
  )
}

export default LogIn

