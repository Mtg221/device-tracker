import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Add a simple test to see if the app is loading
console.log("App is loading...");

// Check if we're in development or production
console.log("NODE_ENV:", import.meta.env.NODE_ENV);

const rootElement = document.getElementById('root');
console.log("Root element:", rootElement);

if (rootElement) {
  console.log("Creating root...");
  ReactDOM.createRoot(rootElement).render(
    <App />
  );
} else {
  console.error("Root element not found!");
}
