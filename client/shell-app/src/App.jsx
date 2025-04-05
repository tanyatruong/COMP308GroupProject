import React, { lazy, Suspense } from 'react';
import './App.css';

// Import remote components using Module Federation
const BusinessDashboard = lazy(() => import('../../business-app/src/components/BusinessDashboard'));

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Shell Application</h1>
        <Suspense fallback={<div>Loading Business Component...</div>}>
          <BusinessDashboard />
        </Suspense>
      </header>
    </div>
  );
}

export default App;