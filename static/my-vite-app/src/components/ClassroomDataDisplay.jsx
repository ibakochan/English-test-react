import React, { useState } from 'react';
import axios from 'axios';

const ClassroomsDisplay = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/classrooms/');
      setClassrooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      <h2>Classrooms</h2>
      <button className="btn btn-primary" onClick={fetchData}>Load Classrooms</button>
      <ul>
        {classrooms.map(classroom => (
          <div key={classroom.id}>
            {classroom.classroom_picture && (
              <img
                style={{ width: '100px', height: '100px', marginTop: '8px', border: '3px solid black' }}
                src={classroom.classroom_picture}
                alt={classroom.name}
              />
            )}
            <li>{classroom.name}</li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default ClassroomsDisplay;
