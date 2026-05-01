# Device Tracker - Complete Setup Guide

## Quick Start (3 Steps)

### 1. Start the Bridge Server
```bash
cd /Users/guest777/Desktop/devicetracker
node arduino-bridge.js
```

This will start a server on port 3001 that forwards data to Supabase.
```

### 2. Upload Code to Arduino
- Open `tracker_device_updated.ino` in Arduino IDE
- Update `DEVICE_ID` if needed (line 4)
- Upload to your ESP32/SIM7000G

### 3. Test the System
```bash
# Test the bridge server
curl http://localhost:3001/health

# Send test tracking data
curl -X POST http://localhost:3001/track \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"2AJYU-SIM7000G","latitude":14.7167,"longitude":-17.4677,"battery":85}'
```

## How It Works

```
Arduino (SIM7000G)
   ↓ HTTP POST
Bridge Server (Node.js:3001)
   ↓ HTTPS
Supabase
   ↓
Your Map (React App)
```

## Configuration

### Arduino Configuration
```cpp
// Line 4: Unique device ID
#define DEVICE_ID "2AJYU-SIM7000G"

// Line 26-28: APN settings (already set for Free Mobile)
const char* APN = "free";
const char* GPRS_USER = "free";
const char* GPRS_PASS = "free";

// Line 26-28: APN settings (already set for Orange Senegal)
const char* SUPABASE_URL = "http://YOUR_COMPUTER_IP";  // For bridge
const char* SUPABASE_ENDPOINT = ":3001/track";
```

## Files
- `arduino-bridge.js` - Bridge server
- `tracker_device_updated.ino` - Arduino code
- `SETUP.md` - This file

## Support
Check the serial monitor for debugging output.