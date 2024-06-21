import React, { useState } from 'react';
import axios from 'axios';

const QuestionsDisplay = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/questions/');
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      <h2>Questions</h2>
      <button className="btn btn-primary" onClick={fetchData}>Load Questions</button>
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
    </div>
  );
};

export default QuestionsDisplay;
