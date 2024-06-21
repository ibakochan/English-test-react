import React, { useState } from 'react';
import axios from 'axios';

const SessionsDisplay = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sessions/');
      setSessions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      <h2>Sessions</h2>
      <button className="btn btn-primary" onClick={fetchData}>Load Sessions</button>
      <ul>
        {sessions.map(session => (
          <li key={session.id}>{session.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default SessionsDisplay;
