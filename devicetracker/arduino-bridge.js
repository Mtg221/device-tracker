#!/usr/bin/env node
/**
 * Arduino Bridge Server
 * Receives tracking data from Arduino via HTTP and forwards to Convex
 */

import http from 'http';
import https from 'https';

const PORT = process.env.PORT || 3001;
const CONVEX_URL = process.env.VITE_CONVEX_URL || 'https://dashing-crane-367.convex.cloud';

console.log('🚀 Arduino Bridge Server');
console.log('========================');
console.log(`Port: ${PORT}`);
console.log(`Convex URL: ${CONVEX_URL}`);
console.log('');
console.log('Endpoints:');
console.log(`  POST http://localhost:${PORT}/track`);
console.log(`  GET  http://localhost:${PORT}/health`);
console.log('');
console.log('Arduino should POST JSON:');
console.log('  {"deviceId":"...","latitude":14.7,"longitude":-17.4,"battery":85}');
console.log('========================');

const server = http.createServer((req, res) => {
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    return;
  }

  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      message: 'Bridge is running',
      convexUrl: CONVEX_URL 
    }));
    return;
  }

  // Receive tracking data from Arduino
  if (req.method === 'POST' && req.url === '/track') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        console.log(`📍 Received: ${data.deviceId} at ${data.latitude},${data.longitude}`);

        // Validate required fields
        if (!data.deviceId || data.latitude === undefined || data.longitude === undefined) {
          res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields: deviceId, latitude, longitude' }));
          return;
        }

        // Forward to Convex
        const result = await sendToConvex(data);
        
        if (result.success) {
          console.log(`✅ Sent to Convex`);
          res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Data sent to Convex' }));
        } else {
          console.error(`❌ Convex error: ${result.error}`);
          res.writeHead(500, { ...headers, 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to send to Convex', details: result.error }));
        }
      } catch (error) {
        console.error(`❌ Parse error: ${error.message}`);
        res.writeHead(400, { ...headers, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON', message: error.message }));
      }
    });
    return;
  }

  // 404 for other routes
  res.writeHead(404, headers);
  res.end('Not found - Use /track or /health');
});

/**
 * Forward tracking data to Convex HTTP endpoint
 */
async function sendToConvex(data) {
  return new Promise((resolve) => {
    try {
      const url = new URL(CONVEX_URL);
      
      const req = https.request({
        hostname: url.hostname,
        port: 443,
        path: '/tracker/update',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(data)),
          'Accept': 'application/json'
        }
      }, (res) => {
        let responseData = '';
        res.on('data', chunk => { responseData += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve({ success: true, data: responseData });
          } else {
            resolve({ 
              success: false, 
              error: `Convex returned ${res.statusCode}: ${responseData || 'No response body'}` 
            });
          }
        });
      });

      req.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({ success: false, error: 'Request timeout' });
      });

      req.write(JSON.stringify(data));
      req.end();
    } catch (error) {
      resolve({ success: false, error: error.message });
    }
  });
}

// Start server
server.listen(PORT, () => {
  console.log('');
  console.log('✅ Server is ready!');
  console.log('');
  console.log('Test with:');
  console.log(`  curl http://localhost:${PORT}/health`);
  console.log(`  curl -X POST http://localhost:${PORT}/track -H "Content-Type: application/json" -d '{"deviceId":"test","latitude":14.7,"longitude":-17.4,"battery":85}'`);
  console.log('');
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
