import React from 'react'
import { Container, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import './home.css';
const Home = () => {
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate('/signup');
  };
  const handleLogIn = () => {
    navigate('/login');
  };
  return (
    <Container>
      <Card className='mainCard'>
        <Card.Body>
          <h2 className='welcome'>Welcome to the Community Portal</h2>
          <div className='buttonContainer'>
            <Button className='btn' onClick={handleSignUp}>Sign Up</Button>
            <Button className='btn' onClick={handleLogIn}>Log In</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Home
