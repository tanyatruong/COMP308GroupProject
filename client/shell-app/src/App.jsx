import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Home from './components/home/Home';

// Import remote components using Module Federation
const BusinessDashboard = lazy(() => import('businessApp/BusinessDashboard'));
const BusinessProfile = lazy(() => import('businessApp/BusinessProfile'));
const CreateOffer = lazy(() => import('businessApp/CreateOffer'));
const OffersList = lazy(() => import('businessApp/OffersList'));
const ReviewsList = lazy(() => import('businessApp/ReviewsList'));

const LogIn = lazy (() => import('authApp/LogIn'));
const SignUp = lazy (() => import('authApp/SignUp'));

const ResidentDashboard = lazy(() => import('businessApp/ResidentDashboard'));
const BulletinBoard = lazy(() => import('businessApp/BulletinBoard'));
const IndividualDiscussion = lazy(() => import('businessApp/IndividualDiscussion'));
const NeighborhoodHelpRequests = lazy(() => import('businessApp/NeighborhoodHelpRequests'));
const Marketplace = lazy(() => import('businessApp/Marketplace'));
const BusinessDetails = lazy(() => import('businessApp/BusinessDetails'));
function App() {
  return (
    <Router>
      <div className='App'>
        <Suspense fallback={<div>Loading Component...</div>}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/businessdashboard' element={<BusinessDashboard />} />
            <Route path='/business/profile' element={<BusinessProfile />} />
            <Route path='/business/create-offer' element={<CreateOffer />} />
            <Route path='/business/offers' element={<OffersList />} />
            <Route path='/business/reviews' element={<ReviewsList />} />
            <Route path='/login' element={<LogIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/residentdashboard' element={<ResidentDashboard />} />
            <Route path='/resident/bulletinboard' element={<BulletinBoard />} />
            <Route path='/resident/bulletinboard/:postId' element={<IndividualDiscussion />} />
            <Route path='/resident/neighborhoodhelprequests' element={<NeighborhoodHelpRequests />} />
            <Route path='/resident/marketplace' element={<Marketplace />} />
            <Route path='/resident/marketplace/businessdetails/:businessId' element={<BusinessDetails />} />

          </Routes>
        </Suspense>
      </div>
    </Router>
    
  );
}

export default App;
