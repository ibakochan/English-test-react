import React from 'react';
import SchoolDataDisplay from './components/SchoolDataDisplay'; // Changed import to SchoolDataDisplay
import './App.css';

function SchoolApp() {
  return (
    <>
      {/* New content for School Data Display */}
      <div>
        <h1>School Data Display</h1>
        <SchoolDataDisplay />
      </div>
    </>
  );
}

export default SchoolApp;
