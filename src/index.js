import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ChatApp from './chatApp'; // App 대신 ChatApp을 import합니다.
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChatApp /> {/* App 대신 ChatApp을 여기서 사용합니다. */}
  </React.StrictMode>
);

reportWebVitals();
