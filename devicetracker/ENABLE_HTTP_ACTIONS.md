# Enable HTTP Actions on Convex

## Problem
The tracker isn't showing on the map because Convex HTTP actions need to be explicitly enabled on your deployment.

## Solution: Enable HTTP Actions

### Option 1: Enable via Convex Dashboard (Recommended)

1. Go to your Convex dashboard: https://convex.dev/dashboard
2. Select your project: `asstallfils/device-tracker`
3. Go to **Settings** → **HTTP Actions**
4. Enable HTTP actions for your deployment
5. Copy the deployment URL

### Option 2: Use the Convex CLI

```bash
cd /Users/guest777/Desktop/devicetracker

# Deploy to production
CONVEX_DEPLOYMENT=dashing-crane-367 npx convex deploy

# Then enable HTTP via dashboard
```

### Option 3: Use a Middleware Server (Temporary Solution)

If you can't enable HTTP actions right now, use the middleware server:

```bash
cd /Users/guest777/Desktop/devicetracker

# Install dependencies
npm install express cors

# Run the middleware server
node tracker-server.js

# The server will run on http://localhost:3001
# Arduino should POST to: http://YOUR_COMPUTER_IP:3001/api/track
```

## Test HTTP Endpoint

Once enabled, test with:

```bash
curl -X POST https://dashing-crane-367.convex.cloud/tracker/update \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test","latitude":14.7167,"longitude":-17.4677,"battery":85}'
```

Expected response:
```json
{"success":true,"message":"Location updated"}
```

## Arduino Configuration

After enabling HTTP actions, update your Arduino code:

```cpp
const char* CONVEX_URL = "https://dashing-crane-367.convex.cloud";
const char* CONVEX_ENDPOINT = "/tracker/update";
```

## Verify It Works

1. Open: http://localhost:5173 (your map)
2. Send test data using the test page or curl
3. Device should appear on the map

## Current Status

- ✅ Convex functions deployed to: `dashing-crane-367`
- ✅ HTTP router configured in `convex/http.ts`
- ❌ HTTP actions NOT enabled on deployment
- ❌ Tracker not showing on map

## Next Steps

1. **Enable HTTP actions** in Convex dashboard
2. Test with curl command above
3. Upload code to Arduino
4. Watch device appear on map!
