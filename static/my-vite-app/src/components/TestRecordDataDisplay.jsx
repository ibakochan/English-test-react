import React, { useState } from 'react';
import axios from 'axios';

const TestRecordsDisplay = () => {
  const [testRecords, setTestRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/test-records/');
      setTestRecords(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching test records:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      <h2>Test Records</h2>
      <button className="btn btn-primary" onClick={fetchData}>Load Test Records</button>
      <ul>
        {testRecords.map(record => (
          <li key={record.id}>
            <strong>Question:</strong> {record.question_name} <br />
            <strong>Selected Option:</strong> {record.selected_option_name} <br />
            <strong>Recorded Score:</strong> {record.recorded_score} <br />
            <strong>Total Recorded Score:</strong> {record.total_recorded_score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestRecordsDisplay;
