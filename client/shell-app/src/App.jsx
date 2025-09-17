import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Home from './components/home/Home';
import LogIn from './components/auth/LogIn';
import SignUp from './components/auth/SignUp';
function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
