// Simple script to receive data from Arduino via serial and send to Convex
// This acts as a bridge between the Arduino serial output and Convex HTTP API

const { ConvexClient } = require('convex/browser');

const CONVEX_URL = process.env.VITE_CONVEX_URL || 'https://dashing-crane-367.convex.cloud';

console.log('Convex URL:', CONVEX_URL);
console.log('Waiting for data from Arduino via serial...');
console.log('Send data in format: deviceId,latitude,longitude,battery');

// Read from stdin (serial data)
process.stdin.on('data', (data) => {
  const parts = data.toString().trim().split(',');
  
  if (parts.length >= 4) {
    const [deviceId, latitude, longitude, battery] = parts;
    
    console.log(`Received: deviceId=${deviceId}, lat=${latitude}, lon=${longitude}, battery=${battery}`);
    
    // Send to Convex using fetch
    fetch(`${CONVEX_URL}/tracker/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: deviceId.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        battery: parseInt(battery)
      })
    })
    .then(response => {
      if (response.ok) {
        console.log('✓ Data sent to Convex successfully');
      } else {
        console.error('✗ Failed to send to Convex:', response.status);
      }
    })
    .catch(error => {
      console.error('✗ Error:', error);
    });
  } else {
    console.log('Invalid data format. Expected: deviceId,latitude,longitude,battery');
    console.log('Received:', data.toString().trim());
  }
});

console.log('Ready to receive data. Send CSV data to stdin.');
