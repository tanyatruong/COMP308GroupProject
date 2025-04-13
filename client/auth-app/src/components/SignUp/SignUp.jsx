import React, {useState} from 'react'
import { Card, Col, Container, Form} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import './signup.css';
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
    const [interests, setInterests] = useState([]);
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
        if (role === 'Resident') {
            setError('');
            try{
                const response = await resSignup({
                    variables: {
                        role,
                        username,
                        password,
                        location,
                        interests
                    }
                });
                if (response.data.resSignup){
                    const user = response.data.resSignup;
                    navigate('/login');
                }
            }catch(err){
                setError(err.message);
            }
        }
        if (role === "CommunityOrganizer"){
            setError('');
            try{
                const response = await coSignup({
                    variables: {
                        role,
                        username,
                        password
                    }
                });
                if (response.data.coSignup){
                    navigate('/login');
                }
            }catch(err){
                setError(err.message);
            }
        }
        if(role === "BusinessOwner"){
            setError('');
            try{
                const response = await boSignup({
                    variables: {
                        role,
                        username,
                        password
                    }
                });
                if (response.data.boSignup){
                    navigate('/login');
                
                }
            }catch(err){
                setError(err.message);
            }
        }
    }
  return (
    <Container>
        <div className='signupcard'>
        <Form onSubmit={handleSubmit}>
            <Card.Header as="h2" className="title">Sign Up</Card.Header>

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

                <tr hidden={role == ''}>
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

                <tr hidden={role == ''}>
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

                <tr hidden={role !== 'Resident'}>
                    <td className="label">
                    <Form.Label htmlFor="city">City:</Form.Label>
                    </td>
                    <td>
                    <Form.Control
                        className='input'
                        id="city"
                        type="text"
                        value={location.city}
                        onChange={(e) => setLocation({ ...location, city: e.target.value })}
                        required={role === 'Resident'}
                    />
                    </td>
                </tr>

                <tr hidden={role !== 'Resident'}>
                    <td className="label">
                    <Form.Label htmlFor="address">Address:</Form.Label>
                    </td>
                    <td>
                    <Form.Control
                        className='input'
                        id="address"
                        type="text"
                        value={location.address}
                        onChange={(e) => setLocation({ ...location, address: e.target.value })}
                        required={role === 'Resident'}
                    />
                    </td>
                </tr>

                <tr hidden={role !== 'Resident'}>
                    <td className="label">
                    <Form.Label htmlFor="postalCode">Postal Code:</Form.Label>
                    </td>
                    <td>
                    <Form.Control
                        className='input'
                        id="postalCode"
                        type="text"
                        value={location.postalCode}
                        onChange={(e) => setLocation({ ...location, postalCode: e.target.value })}
                        required={role === 'Resident'}
                    />
                    </td>
                </tr>
                <tr hidden={role !== 'Resident'}>
                    <td className="label">
                    <Form.Label htmlFor="interests">Interests <br/>(Comma separated):</Form.Label>
                    </td>
                    <td>
                    <Form.Control
                        className='input'
                        id="interests"
                        type="text"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value.split(',').map(interest => interest.trim()))}
                        required={role === 'Resident'} 
                    />
                    </td>
                </tr>
                </tbody>
            </table>
            
            <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary signupBtn">Sign Up</button>
            </div>
            </Form>
        </div>    
    </Container>
  )
}

export default SignUp
