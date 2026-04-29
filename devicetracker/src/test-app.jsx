import React from 'react';
import ReactDOM from 'react-dom/client';

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>DeviceTracker Test</h1>
      <p>If you can see this, React is working!</p>
      <p>Current time: {new Date().toString()}</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TestApp />);

// Log to console to verify execution
console.log("Test app loaded at:", new Date().toString());