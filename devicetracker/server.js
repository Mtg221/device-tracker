// Simple Express server to receive data from Arduino and send to Supabase
const express = require('express');
const { ConvexClient } = require('convex/node');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tlhqgdvnnswmhtljmuut.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaHFnZHZubnN3bWh0bGptdXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU3ODc2NSwiZXhwIjoyMDkzMTU0NzY1fQ.qRAyDyXclLYQibJtjPwkJRv3iUR7bwXBF7fX0Df0qrM';
console.log('Supabase URL:', supabaseUrl);

// Endpoint for Arduino to POST tracking data
app.post('/api/track', (req, res) => {
  const { deviceId, latitude, longitude, speed, battery } = req.body;
  
  console.log('Received tracking data:', { deviceId, latitude, longitude, speed, battery });
  
  // Prepare data for Supabase
  const supabaseData = {
    device_id: deviceId,
    latitude: latitude,
    longitude: longitude,
    speed: speed || 0,
    battery: battery || 0,
    status: 'running'
  };

  // Send to Supabase using fetch
  fetch(`${supabaseUrl}/rest/v1/devices?device_id=eq.${deviceId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(supabaseData)
  })
  .then(response => {
    if (response.ok) {
      console.log('✓ Sent to Supabase successfully');
      res.json({ success: true });
    } else {
      console.error('✗ Failed to send to Supabase:', response.status);
      res.status(500).json({ error: 'Failed to send to Supabase' });
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
