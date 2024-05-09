// index.js

import React from 'react';
import { createRoot } from 'react-dom/client'; // react-dom/client에서 가져옵니다.
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// ReactDOM.render 대신 createRoot를 사용합니다.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
