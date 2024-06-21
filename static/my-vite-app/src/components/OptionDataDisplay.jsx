import React, { useState } from 'react';
import axios from 'axios';

const OptionsDisplay = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/options/');
      setOptions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching options:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      <h2>Options</h2>
      <button className="btn btn-primary" onClick={fetchData}>Load Options</button>
      <ul>
        {options.map(option => (
          <div key={option.id}>
            {option.option_picture && (
              <img
                style={{ width: '100px', height: '100px', marginTop: '8px', border: '3px solid black' }}
                src={option.option_picture}
                alt={option.name}
              />
            )}
            <li>{option.name}</li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default OptionsDisplay;
