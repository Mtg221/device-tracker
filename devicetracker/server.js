// Simple Express server to receive data from Arduino and send to Convex
const express = require('express');
const { ConvexClient } = require('convex/node');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Convex client setup
const convexUrl = process.env.VITE_CONVEX_URL || 'https://dashing-crane-367.convex.cloud';
console.log('Convex URL:', convexUrl);

// Endpoint for Arduino to POST tracking data
app.post('/api/track', (req, res) => {
  const { deviceId, latitude, longitude, speed, battery } = req.body;
  
  console.log('Received tracking data:', { deviceId, latitude, longitude, speed, battery });
  
  // Send to Convex using fetch (simpler than ConvexClient for server)
  fetch(`${convexUrl}/tracker/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId, latitude, longitude, speed, battery })
  })
  .then(response => {
    if (response.ok) {
      console.log('✓ Sent to Convex successfully');
      res.json({ success: true });
    } else {
      console.error('✗ Failed to send to Convex:', response.status);
      res.status(500).json({ error: 'Failed to send to Convex' });
    }
  })
  .catch(error => {
    console.error('✗ Error:', error);
    res.status(500).json({ error: error.message });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Arduino should POST to: http://localhost:3001/api/track');
});
