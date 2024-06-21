import React, { useState } from 'react';
import axios from 'axios';

const DataDisplay = () => {
  const [schools, setSchools] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [testRecords, setTestRecords] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (endpoint, setState) => {
    try {
      setLoading(true);
      const response = await axios.get(endpoint);
      setState(response.data);
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
      <button className="btn btn-primary" onClick={() => fetchData('/api/schools/', setSchools)}>Load Schools</button>
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

      <h2>Classrooms</h2>
      <button className="btn btn-primary" onClick={() => fetchData('/api/classrooms/', setClassrooms)}>Load Classrooms</button>
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

      <h2>Tests</h2>
      <button className="btn btn-primary" onClick={() => fetchData('/api/tests/', setTests)}>Load Tests</button>
      <ul>
        {tests.map(test => (
          <div key={test.id}>
            {test.test_picture && (
              <img 
                style={{ width: '100px', height: '100px', marginTop: '8px', border: '3px solid black' }} 
                src={test.test_picture} 
                alt={test.name} 
              />
            )}
            <li>{test.name}</li>
          </div>
        ))}
      </ul>

      <h2>Questions</h2>
      <button className="btn btn-primary" onClick={() => fetchData('/api/questions/', setQuestions)}>Load Questions</button>
      <ul>
        {questions.map(question => (
          <div key={question.id}>
            {question.question_picture && (
              <img 
                style={{ width: '100px', height: '100px', marginTop: '8px', border: '3px solid black' }} 
                src={question.question_picture} 
                alt={question.name} 
              />
            )}
            {question.question_sound && (
              <audio controls style={{ marginTop: '8px' }}>
                <source src={question.question_sound} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            <li>{question.name}</li>
          </div>
        ))}
      </ul>

      <h2>Options</h2>
      <button className="btn btn-primary" onClick={() => fetchData('/api/options/', setOptions)}>Load Options</button>
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

      <h2>Test Records</h2>
      <button className="btn btn-primary" onClick={() => fetchData('/api/test-records/', setTestRecords)}>Load Test Records</button>
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

      <h2>Sessions</h2>
      <button className="btn btn-primary" onClick={() => fetchData('/api/sessions/', setSessions)}>Load Sessions</button>
      <ul>
        {sessions.map(session => (
          <li key={session.id}>{session.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DataDisplay;
