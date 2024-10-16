import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure the import path is correct
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('popup-root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Could not find root element for popup');
}
