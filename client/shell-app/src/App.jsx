import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './components/home/Home';

// Import remote components using Module Federation
const BusinessDashboard = lazy(() => import('businessApp/BusinessDashboard'));
const LogIn = lazy (() => import('authApp/LogIn'));
const SignUp = lazy (() => import('authApp/SignUp'));

function App() {
  return (
    <Router>
      <div className='App'>
        <Suspense fallback={<div>Loading Business Component...</div>}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/businessdashboard' element={<BusinessDashboard />} />
            <Route path='/login' element={<LogIn />} />
            <Route path='/signup' element={<SignUp />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
    
  );
}

export default App;