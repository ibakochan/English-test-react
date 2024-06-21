import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

const Test = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [tests, setTests] = useState([]);
  const [testQuestions, setTestQuestions] = useState({ questions: [], optionsMap: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTestId, setActiveTestId] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [currentCorrectAudioIndex, setCurrentCorrectAudioIndex] = useState(0);
  const [currentWrongAudioIndex, setCurrentWrongAudioIndex] = useState(0);
  const [recordMessage, setRecordMessage] = useState('');


  const correctAudioUrls = window.correctAudioUrls;
  const wrongAudioUrls = window.wrongAudioUrls;

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const classroomResponse = await axios.get('/api/classrooms/my-classroom/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setClassrooms(classroomResponse.data);

        if (classroomResponse.data.length > 0) {
          const testResponse = await axios.get(`/api/name-id-tests/by-classroom/${classroomResponse.data[0].id}`);
          setTests(testResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTestQuestionsAndOptions = async (testId) => {
    try {
      setLoading(true);
      setError(null);

      const testQuestionsResponse = await axios.get(`/api/test-questions/by-test/${testId}/`);
      const questions = testQuestionsResponse.data;

      const optionsPromises = questions.map(async (question) => {
        const optionsResponse = await axios.get(`/api/options/by-question/${question.id}/`);
        return { questionId: question.id, options: optionsResponse.data };
      });

      const optionsResults = await Promise.all(optionsPromises);

      const optionsMap = optionsResults.reduce((acc, { questionId, options }) => {
        acc[questionId] = options;
        return acc;
      }, {});

      setTestQuestions({ questions, optionsMap });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching test questions and options:', error);
      setError('Failed to fetch test questions and options.');
      setLoading(false);
    }
  };

  const recordTestScore = async (testId) => {
    try {
      const csrfToken = getCookie('csrftoken');
      const response = await axios.post(`/test/${testId}/record/`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'X-CSRFToken': csrfToken
        }
      });
      const message = response.data.message;
      setRecordMessage(message);
      setShowModal(true);
    } catch (error) {
      console.error('Error recording test score:', error);
      setError('Failed to record test score.');
    }
  };

  const deleteSubmissions = async () => {
    try {
      const csrfToken = getCookie('csrftoken');
      await axios.post('/submissions/delete/', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'X-CSRFToken': csrfToken
        }
      });
    } catch (error) {
      console.error('Error deleting submissions:', error);
      setError('Failed to delete submissions.');
    }
  };

  const toggleQuestionDetails = async (testId) => {
    await deleteSubmissions();

    if (activeTestId === testId) {
      setActiveTestId(null);
    } else {
      try {
        setActiveTestId(testId);
        setActiveQuestionIndex(0);
        await fetchTestQuestionsAndOptions(testId);
      } catch (error) {
        console.error('Error fetching test questions and options:', error);
        setError('Failed to fetch test questions and options.');
      }
    }
  };

  const renderForm = (question, optionsMap) => {
    const options = optionsMap[question.id];
    if (!options) return null;

    return (
      <form className="test-form" onSubmit={(e) => handleSubmit(e, question.id)}>
        <div className="container-fluid">
          <div className="row">
            {options.map(option => (
              <div className="col-md-6" key={option.id}>
                <label htmlFor={`selected_option_${question.id}_${option.id}`}>
                  <input
                    type="radio"
                    id={`selected_option_${question.id}_${option.id}`}
                    name={`selected_option_${question.id}`}
                    value={option.id}
                    style={{ marginRight: '5px' }}
                  />
                  {option.name}
                </label>
                {option.option_picture && (
                  <img
                    style={{ width: '100px', height: '100px', marginTop: '8px', border: '3px solid black' }}
                    src={option.option_picture}
                    alt="Option"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <button id="submit-btn" type="submit">Submit answer for {question.name}</button>
      </form>
    );
  };

  const handleSubmit = async (e, questionId) => {
    e.preventDefault();
    const selectedOption = e.target[`selected_option_${questionId}`].value;
    const csrfToken = getCookie('csrftoken');

    try {
      const response = await axios.post(
        `/test/${activeTestId}/question/${questionId}/submit/`,
        { selected_option: selectedOption },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRFToken': csrfToken
          }
        }
      );

      const message = response.data.message;
      setModalMessage(message);
      setShowModal(true);

      let audioUrl, audioElement;
      if (message === 'Correct answer') {
        setIsCorrect(true);
        setCurrentWrongAudioIndex(0);
        audioUrl = correctAudioUrls[currentCorrectAudioIndex];
        audioElement = new Audio(audioUrl);
        setCurrentCorrectAudioIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) < correctAudioUrls.length ? (prevIndex + 1) : prevIndex;
          return newIndex;
        });
      } else {
        setIsCorrect(false);
        setCurrentCorrectAudioIndex(0);
        audioUrl = wrongAudioUrls[currentWrongAudioIndex];
        audioElement = new Audio(audioUrl);
        setCurrentWrongAudioIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) < wrongAudioUrls.length ? (prevIndex + 1) : prevIndex;
          return newIndex;
        });
      }

      audioElement.volume = 1.0;
      audioElement.play();

      setActiveQuestionIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  return (
    <div>
      <div className="quiz-container d-flex justify-content-center align-items-center" id="quiz">
        <div className="quiz-header">
          <div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {classrooms.map(classroom => (
              <div key={classroom.id}>
                <h2>{classroom.name}</h2>
                <div className="test-buttons-container">
                  {tests.map(test => (
                    <div key={test.id}>
                      <button
                        className={`btn btn-warning mb-3 toggle-test-btn${activeTestId === test.id || activeTestId === null ? ' active' : ' d-none'}`}
                        style={{ width: '200px', height: '100px', margin: '10px' }}
                        onClick={() => toggleQuestionDetails(test.id)}
                      >
                        {test.name}
                      </button>
                    </div>
                  ))}
                </div>
                {activeTestId && (
                  <div className="test-details">
                    <button
                    className="btn btn-primary mb-3"
                    style={{ width: '200px', height: '50px', margin: '10px' }}
                    onClick={() => recordTestScore(activeTestId)}
                    >
                    Record Score
                    </button>
                    <h4>Questions</h4>
                    <ul>
                      {testQuestions.questions.map((question, index) => (
                        <li key={question.id} className={index === activeQuestionIndex ? 'active' : 'd-none'}>
                          <h5>{question.name}</h5>
                          {renderForm(question, testQuestions.optionsMap)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header
          style={{
            backgroundImage: `url(${window.staticFileUrl})`,
            backgroundSize: 'contain', // Ensure the whole image fits within the header
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            height: '50vh' // Set the height of the header
          }}
        >
        </Modal.Header>
        <Modal.Body>
            {recordMessage ? (
                <div className="d-flex align-items-center justify-content-center">
                    <h2 className="message">{recordMessage}</h2>
                </div>
            ) : (
                <div className="d-flex align-items-center">
                    {isCorrect === true ? (
                        <span className="text-success" style={{ fontSize: '90px' }}>&#x2713;</span>
                    ) : isCorrect === false ? (
                        <span className="text-danger" style={{ fontSize: '90px' }}>&#x2717;</span>
                    ) : null}
                    <p className="message ml-3">{modalMessage}</p>
                </div>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Test;
