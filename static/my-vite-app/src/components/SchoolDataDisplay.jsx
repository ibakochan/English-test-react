import React, { useState } from 'react';
import axios from 'axios';

export const SchoolDataDisplay = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/schools/');
      setSchools(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      <h2>Schools</h2>
      <button className="btn btn-primary" onClick={fetchData}>Load Schools</button>
      <ul>
        {schools.map(school => (
          <div key={school.id}>
            {school.school_picture && (
              <img
                style={{ width: '100px', height: '100px', marginTop: '8px', border: '3px solid black' }}
                src={school.school_picture}
                alt={school.name}
              />
            )}
            <li>{school.name}</li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default SchoolDataDisplay;
