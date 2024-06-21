import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserTestRecords = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [tests, setTests] = useState([]);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionDetails, setSessionDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeClassroomId, setActiveClassroomId] = useState(null);
  const [activeTestId, setActiveTestId] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showClassrooms, setShowClassrooms] = useState(false);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const classroomResponse = await axios.get('/api/classrooms/my-classroom/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log('Fetched classrooms response:', classroomResponse);
      console.log('Fetched classrooms data:', classroomResponse.data);
      setClassrooms(classroomResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classrooms:', error.response ? error.response.data : error.message);
      setError('Failed to fetch classrooms.');
      setLoading(false);
    }
  };


  const fetchTests = async (classroomId) => {
    try {
      setLoading(true);
      setError(null);
      const testsResponse = await axios.get(`/api/name-id-tests/by-classroom/${classroomId}`);
      console.log('Fetched tests:', testsResponse.data);
      setTests(testsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setError('Failed to fetch tests.');
      setLoading(false);
    }
  };

  const fetchUsers = async (classroomId, userId) => {
    try {
      setLoading(true);
      setError(null);
      const usersResponse = await axios.get(`/api/users/by-classroom/${classroomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log('Fetched users:', usersResponse.data);
      setUsers(usersResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users.');
      setLoading(false);
    }
  };


  const fetchSessions = async (testId, userId) => {
    try {
      setLoading(true);
      setError(null);
      const sessionsResponse = await axios.get(`/api/only-sessions/by-test-and-user/${testId}/${userId}/`);
      console.log('Fetched sessions:', sessionsResponse.data);
      setSessions(sessionsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to fetch sessions.');
      setLoading(false);
    }
  };

  const fetchSessionDetails = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/sessions/${sessionId}/`);
      console.log('Fetched session details:', response.data);
      setSessionDetails(prevDetails => ({
        ...prevDetails,
        [sessionId]: response.data,
      }));
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching session details for ID ${sessionId}:`, error);
      setError(`Failed to fetch session details for ID ${sessionId}.`);
      setLoading(false);
    }
  };

  const toggleClassroomDetails = async (classroomId) => {
    if (activeClassroomId === classroomId) {
      setActiveClassroomId(null);
      setTests([]);
      setUsers([]);
    } else {
      setActiveClassroomId(classroomId);
      await fetchTests(classroomId);
      await fetchUsers(classroomId);
    }
  };

  const toggleTestDetails = (testId) => {
    if (activeTestId === testId) {
      setActiveTestId(null);
      setSessions([]);
      setActiveUserId(null);
    } else {
      setActiveTestId(testId);
      setSessions([]);
      setActiveUserId(null);
    }
  };

  const toggleUserDetails = async (userId) => {
    if (activeUserId === userId) {
      setActiveUserId(null);
      setSessions([]);
    } else {
      setActiveUserId(userId);
      if (activeTestId) {
        await fetchSessions(activeTestId, userId);
      }
    }
  };


  const toggleSessionDetails = async (sessionId) => {
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    } else {
      setActiveSessionId(sessionId);
      await fetchSessionDetails(sessionId);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const renderAudio = (question) => {
    if (question.question_sound) {
      return <audio controls src={question.question_sound} />;
    }
    return null;
  };

  useEffect(() => {
    fetchClassrooms(); // Fetch classrooms initially
  }, []);

  return (
    <div>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowClassrooms(!showClassrooms)}
      >
        {showClassrooms ? 'Hide Classroom Records' : 'Show Classroom Records'}
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {showClassrooms && (
        <>
          <h2>Classroom Records</h2>
          <ul>
            {classrooms.map(classroom => (
              <div key={classroom.id}>
                <button
                  className={`btn btn-dark mb-3 toggle-classroom-btn${activeClassroomId === classroom.id ? ' active' : ''}`}
                  onClick={() => toggleClassroomDetails(classroom.id)}
                >
                  {classroom.name}
                </button>
                {activeClassroomId === classroom.id && (
                  <div className="classroom-details">
                    {tests.map(test => (
                      <div key={test.id}>
                        <button
                          className={`btn btn-warning mb-3 toggle-test-btn${activeTestId === test.id ? ' active' : ''}`}
                          onClick={() => toggleTestDetails(test.id)}
                        >
                          {test.name}
                        </button>
                        {activeTestId === test.id && (
                          <div className="test-details">
                            {users.map(user => (
                              <div key={user.id}>
                                <button
                                  className={`btn btn-success mb-3 toggle-user-btn${activeUserId === user.id ? ' active' : ''}`}
                                  onClick={() => toggleUserDetails(user.id)}
                                >
                                  {user.username}
                                </button>
                                {activeUserId === user.id && (
                                  <div className="user-details">
                                    {sessions.map(session => (
                                      <div key={session.id}>
                                        <button
                                          className={`btn btn-info mb-3 toggle-session-btn${activeSessionId === session.id ? ' active' : ''}`}
                                          onClick={() => toggleSessionDetails(session.id)}
                                        >
                                          {session.timestamp ? formatTimestamp(session.timestamp) : `Session ${session.id}`}
                                        </button>
                                        {activeSessionId === session.id && sessionDetails[session.id] && (
                                          <div className="record-details">
                                            {sessionDetails[session.id].test_records.map(record => (
                                              <div key={record.id} style={{ border: '3px solid black', padding: '10px', marginBottom: '10px' }}>
                                                {record.question_name && (
                                                  <h4>Question: {record.question_name}</h4>
                                                )}
                                                {record.question && (
                                                  <>
                                                    {renderAudio(record.question)}
                                                    {record.question.options.map(option => (
                                                      option.is_correct && (
                                                        <p key={option.id}>Correct option: {option.name}</p>
                                                      )
                                                    ))}
                                                  </>
                                                )}
                                                {record.selected_option_name && (
                                                  <p>Selected Option: {record.selected_option_name}</p>
                                                )}
                                                {record.total_recorded_score === 0 ? (
                                                  <p>Recorded Score: {record.recorded_score}</p>
                                                ) : (
                                                  <h2>Total Score: {record.total_recorded_score}</h2>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default UserTestRecords;
