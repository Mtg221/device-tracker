// Simple HTTPS server to receive tracking data from Arduino and send to Convex
const https = require('https');
const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

// Convex configuration
const CONVEX_URL = process.env.VITE_CONVEX_URL || 'https://dashing-crane-367.convex.cloud';
const CONVEX_ENDPOINT = '/tracker/update';

console.log('Tracker Server starting...');
console.log(`Convex URL: ${CONVEX_URL}`);
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
        
        // Forward to Convex
        forwardToConvex(data)
          .then(result => {
            if (result.success) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Data sent to Convex' }));
            } else {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to send to Convex', details: result.error }));
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

async function forwardToConvex(data) {
  try {
    const url = new URL(CONVEX_URL);
    
    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: url.hostname,
        path: CONVEX_ENDPOINT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': JSON.stringify(data).length
        }
      }, (res) => {
        let responseData = '';
        res.on('data', chunk => { responseData += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve({ success: true, data: responseData });
          } else {
            resolve({ success: false, error: `Convex returned ${res.statusCode}: ${responseData}` });
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
