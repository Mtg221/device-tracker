# Device Tracker - Complete Setup Guide

## Quick Start (3 Steps)

### 1. Start the Bridge Server
```bash
cd /Users/guest777/Desktop/devicetracker
node arduino-bridge.js
```

This will start a server on port 3001 that forwards data to Convex.

### 2. Upload Code to Arduino
- Open `tracker_device_updated.ino` in Arduino IDE
- Update `DEVICE_ID` if needed (line 4)
- APN is already set to "free" for Free Mobile
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

```\nArduino (SIM7000G)\n   ↓ HTTP POST\nBridge Server (Node.js:3001)\n   ↓ HTTPS\nConvex Cloud\n   ↓\nYour Map (React App)\n```

## Configuration

### Arduino Configuration
```cpp
// Line 4: Unique device ID
#define DEVICE_ID "2AJYU-SIM7000G"

// Line 26-28: APN settings (already set for Free Mobile)
const char* APN = "free";
const char* GPRS_USER = "free";
const char* GPRS_PASS = "free";

// Line 22-23: Convex URL (use bridge for now)
const char* CONVEX_URL = "http://YOUR_COMPUTER_IP";  // For bridge
const char* CONVEX_ENDPOINT = ":3001/track";
```

### Free Mobile APN Settings
- **APN**: `free`
- **Username**: `free`
- **Password**: `free`

## Testing

### Test 1: Bridge Server Health
```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","message":"Bridge is running"}
```

### Test 2: Send Mock Data
```bash
curl -X POST http://localhost:3001/track \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test-1","latitude":48.8566,"longitude":2.3522,"battery":90}'
```

### Test 3: Check Map
Open your React app (usually http://localhost:5173) and check if the device appears.

## Troubleshooting

### Arduino can't connect to network
- Check SIM card is inserted correctly
- Verify APN settings (should be "free" for Free Mobile)
- Check antenna is connected
- Try: `AT+CPIN?` to check SIM status

### Data not appearing on map
1. Check bridge server is running: `curl http://localhost:3001/health`
2. Check Convex deployment: https://dashboard.convex.dev
3. Check browser console for errors
4. Verify device ID matches

### GPS not working
- Ensure GPS antenna is connected
- Wait 2-5 minutes for GPS fix (outdoors)
- Check `gpsValid` flag in serial monitor
- Verify SIM7000G GPS is enabled

## Direct Convex Integration (Advanced)

To skip the bridge server, enable HTTP actions on Convex:

1. Go to https://dashboard.convex.dev
2. Select your project
3. Enable HTTP actions
4. Update Arduino code:
```cpp
const char* CONVEX_URL = "https://dashing-crane-367.convex.cloud";
const char* CONVEX_ENDPOINT = "/tracker/update";
```

## Files
- `arduino-bridge.js` - Bridge server
- `tracker_device_updated.ino` - Arduino code
- `test-manual.html` - Manual test page
- `SETUP.md` - This file

## Support
Check the serial monitor for debugging output.
