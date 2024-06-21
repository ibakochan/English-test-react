import React, { useState } from 'react';
import DataDisplay from './components/DataDisplay';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* New content for Data Display */}
      <div>
        <h1>Data Display</h1>
        <DataDisplay />
      </div>
    </>
  );
}

export default App;
