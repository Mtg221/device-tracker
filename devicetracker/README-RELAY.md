# Device Tracker - Using Relay Server

## ✅ What's Done

1. **Arduino code updated** to use the same relay server as `bus-tracking-iot-main`
2. **Relay server confirmed working** at `http://24.144.96.134:8345/gps`
3. **Convex functions deployed** to `dashing-crane-367`
4. **APN configured** for Free Mobile (`free`)

## 📡 How It Works

```
Arduino (SIM7000G)
   ↓ HTTP GET (plain)
Relay Server (24.144.96.134:8345)
   ↓ HTTPS POST
Convex Cloud (dashing-crane-367)
   ↓
React App (localhost:5173)
```

## 🚀 Next Steps

### 1. Upload Code to Arduino

Open `tracker_device_updated.ino` in Arduino IDE and upload to your board.

**Key settings:**
- Device ID: `2AJYU-SIM7000G`
- APN: `free` (Free Mobile)
- Relay: `http://24.144.96.134:8345/gps`

### 2. Start Your React App

```bash
cd /Users/guest777/Desktop/devicetracker
npm run dev
```

Then open: http://localhost:5173

### 3. Test the System

Send a test GPS point:

```bash
curl "http://24.144.96.134:8345/gps?latitude=14.7167&longitude=-17.4677&speed=0.0&altitude=0.0&device_id=2AJYU-SIM7000G&battery=85"
```

Expected response: `{"ok":true}`

Then check your map at http://localhost:5173 - you should see the device!

## 📍 GPS Data Format

The relay expects these parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `latitude` | GPS latitude | 14.7167 |
| `longitude` | GPS longitude | -17.4677 |
| `speed` | Speed in km/h | 0.0 |
| `altitude` | Altitude in meters | 0.0 |
| `device_id` | Device identifier | 2AJYU-SIM7000G |
| `battery` | Battery percentage | 85 |

## 🔧 Troubleshooting

### Device not showing on map?

1. **Check relay response**: Should be `{"ok":true}`
2. **Check Convex data**: 
   ```bash
   cd /Users/guest777/Desktop/devicetracker
   npx convex run devices:getAll
   ```
3. **Check device ID matches**: Arduino code and test must use same ID

### GPS not working?

- Ensure GPS antenna is connected
- Wait 2-5 minutes for GPS fix (outdoors)
- Check serial monitor for GPS status

### Network issues?

- Verify SIM card is inserted correctly
- Check APN is set to `free`
- Verify antenna is connected

## 📊 Test Commands

```bash
# Test relay server (should return {"ok":true})
curl "http://24.144.96.134:8345/gps?latitude=14.7167&longitude=-17.4677&device_id=test&battery=85"

# Check Convex database
cd /Users/guest777/Desktop/devicetracker
npx convex run devices:getAll

# Start React app
npm run dev
```

## 📝 Code Changes Made

- Changed from HTTPS POST to plain HTTP GET (relay pattern)
- Updated to use `24.144.96.134:8345` relay server
- Set APN to `free` for Free Mobile carrier
- Simplified HTTP handling (no SSL/TLS needed)
- Matched `bus-tracking-iot-main` architecture

## 🎯 Success Criteria

✅ Relay returns `{"ok":true}`  
✅ Device appears in Convex database  
✅ Device shows on map at localhost:5173  
✅ GPS coordinates update every 30 seconds  

## 📞 Support

If issues persist:
1. Check serial monitor for Arduino errors
2. Verify relay server is reachable
3. Check Convex dashboard for function errors
4. Ensure React app is running on correct port
