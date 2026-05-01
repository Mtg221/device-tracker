// Simple script to receive data from Arduino via serial and send to Supabase
// This acts as a bridge between the Arduino serial output and Supabase HTTP API

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tlhqgdvnnswmhtljmuut.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaHFnZHZubnN3bWh0bGptdXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU3ODc2NSwiZXhwIjoyMDkzMTU0NzY1fQ.qRAyDyXclLYQibJtjPwkJRv3iUR7bwXBF7fX0Df0qrM';

console.log('Supabase URL:', SUPABASE_URL);
console.log('Waiting for data from Arduino via serial...');
console.log('Send data in format: deviceId,latitude,longitude,battery');

// Read from stdin (serial data)
process.stdin.on('data', (data) => {
  const parts = data.toString().trim().split(',');
  
  if (parts.length >= 4) {
    const [deviceId, latitude, longitude, battery] = parts;
    
    console.log(`Received: deviceId=${deviceId}, lat=${latitude}, lon=${longitude}, battery=${battery}`);
    
    // Send to Supabase using fetch
    const supabaseData = {
      device_id: deviceId.trim(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      speed: 0,
      battery: parseInt(battery),
      status: 'running'
    };

    // Send to Supabase using fetch
    fetch(`${SUPABASE_URL}/rest/v1/devices?device_id=eq.${deviceId.trim()}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(supabaseData)
    })
    .then(response => {
      if (response.ok) {
        console.log('✓ Data sent to Supabase successfully');
      } else {
        console.error('✗ Failed to send to Supabase:', response.status);
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
