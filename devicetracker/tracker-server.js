// Simple HTTPS server to receive tracking data from Arduino and send to Supabase
const https = require('https');
const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tlhqgdvnnswmhtljmuut.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaHFnZHZubnN3bWh0bGptdXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU3ODc2NSwiZXhwIjoyMDkzMTU0NzY1fQ.qRAyDyXclLYQibJtjPwkJRv3iUR7bwXBF7fX0Df0qrM';
console.log('Supabase URL:', supabaseUrl);
console.log(`Using HTTPS: ${USE_HTTPS}`);

// Create HTTP server (simpler for Arduino)
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type: application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Tracker server is running' }));
    return;
  }
  
  // Receive tracking data
  if (req.method === 'POST' && req.url === '/api/track') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Received tracking data:', data);
        
        // Forward to Supabase
        forwardToSupabase(data)
          .then(result => {
            if (result.success) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Data sent to Supabase' }));
            } else {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to send to Supabase', details: result.error }));
            }
          })
          .catch(error => {
            console.error('Error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }
  
  // 404 for other routes
  res.writeHead(404);
  res.end('Not found');
});

async function forwardToSupabase(data) {
  try {
    // Transform data to match Supabase schema
    const supabaseData = {
      device_id: data.deviceId,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed || 0,
      battery: data.battery || 0,
      status: 'running'
    };

    const url = `${supabaseUrl}/rest/v1/tracking`.replace('https://', 'https://').replace('http://', 'https://');
    
    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: supabaseUrl.replace('https://', '').replace('http://', '').split('/')[0],
        path: `/rest/v1/tracking?device_id=eq.${data.deviceId}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'resolution=merge-duplicates'
        }
      }, (res) => {
        let responseData = '';
        res.on('data', chunk => { responseData += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res
      }, (res) => {
        let responseData = '';
        res.on('data', chunk => { responseData += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, data: responseData });
          } else {
            resolve({ success: false, error: `Supabase returned ${res.statusCode}: ${responseData}` });
          }
        });
      });
      
      req.on('error', reject);
      req.write(JSON.stringify(supabaseData));
      req.end();
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
}

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Arduino should POST to: http://localhost:${PORT}/api/track`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
  
  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Tracker server is running' }));
    return;
  }
  
  // Receive tracking data
  if (req.method === 'POST' && req.url === '/api/track') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Received tracking data:', data);
        
        // Forward to Supabase
        forwardToSupabase(data)
          .then(result => {
            if (result.success) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Data sent to Supabase' }));
            } else {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to send to Supabase', details: result.error }));
            }
          })
          .catch(error => {
            console.error('Error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          });
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }
  
// 404 for other routes
  res.writeHead(404);
  res.end('Not found');
});
async function forwardToSupabase(data) {
  try {
    // Transform data to match Supabase schema
    const supabaseData = {
      device_id: data.deviceId,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed || 0,
      battery: data.battery || 0,
      status: 'running'
    };

    const url = `${supabaseUrl}/rest/v1/devices`.replace('https://', 'https://').replace('http://', 'https://');
    
    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: supabaseUrl.replace('https://', '').replace('http://', '').split('/')[0],
        path: `/rest/v1/devices?device_id=eq.${data.deviceId}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'resolution=merge-duplicates'
        }
      }, (res) => {
        let responseData = '';
        res.on('data', chunk => { responseData += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, data: responseData });
          } else {
            resolve({ success: false, error: `Supabase returned ${res.statusCode}: ${responseData}` });
          }
        }
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
}
        });
      });
      
      req.on('error', reject);
      req.write(JSON.stringify(data));
      req.end();
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
}

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Arduino should POST to: http://localhost:${PORT}/api/track`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
