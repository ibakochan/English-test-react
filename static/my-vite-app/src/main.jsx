import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import SchoolApp from './SchoolApp.jsx'
import ClassroomApp from './ClassroomApp.jsx';
import TestApp from './TestApp.jsx';
import QuestionApp from './QuestionApp.jsx';
import OptionApp from './OptionApp.jsx';
import TestRecordApp from './TestRecordApp.jsx';
import SessionApp from './SessionApp.jsx';
import UserTestRecordsApp from './UserTestRecordsApp.jsx';
import './index.css'



ReactDOM.createRoot(document.getElementById('user-test-records')).render(
  <React.StrictMode>
    <UserTestRecordsApp />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('tests')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('schools')).render(
  <React.StrictMode>
    <SchoolApp />
  </React.StrictMode>
);


ReactDOM.createRoot(document.getElementById('classrooms')).render(
  <React.StrictMode>
    <ClassroomApp />
  </React.StrictMode>
);


ReactDOM.createRoot(document.getElementById('questions')).render(
  <React.StrictMode>
    <QuestionApp />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('options')).render(
  <React.StrictMode>
    <OptionApp />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('test-records')).render(
  <React.StrictMode>
    <TestRecordApp />
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('sessions')).render(
  <React.StrictMode>
    <SessionApp />
  </React.StrictMode>
);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);