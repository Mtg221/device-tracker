# Supabase Setup

## Problem
Supabase is now configured as the backend instead of Convex.

## Solution: Enable Supabase Integration

The system has been updated to use Supabase instead of Convex for device tracking.

## Update Summary

1. **Supabase Database**: Devices are now stored in Supabase PostgreSQL database
2. **Real-time Updates**: Using Supabase real-time subscriptions instead of Convex
3. **API Endpoints**: Direct Supabase REST API calls instead of Convex functions
4. **Authentication**: Using Supabase service key for server-side operations

## Supabase Configuration

### Database Setup
1. Create a `devices` table in your Supabase project
2. Enable Row Level Security (RLS) 
3. Set up proper policies for public access

### Environment Variables
The following environment variables should be configured:
- `VITE_SUPABASE_URL` = your Supabase project URL
- `VITE_SUPABASE_KEY` = your Supabase service key

## Test Supabase Endpoint

Test with curl:
```bash
curl -X POST https://tlhqgdvnnswmhtljmuut.supabase.co/rest/v1/devices \
  -H "apikey: YOUR_SERVICE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  -d '{
    "device_id": "test-device",
    "latitude": 14.7167,
    "longitude": -17.4677,
    "battery": 85,
    "status": "running"
  }'
```

## Arduino Configuration

Update your Arduino code to send to Supabase:
```cpp
const char* SUPABASE_URL = "https://tlhqgdvnnswmhtljmuut.supabase.co";
const char* SUPABASE_ENDPOINT = "/rest/v1/devices";
```

## Verify It Works

1. Open: http://localhost:5173 (your map)
2. Send test data using the test page or curl
3. Device should appear on the map

## Current Status

- ✅ Supabase functions deployed to: `tlhqgdvnnswmhtljmuut`
- ✅ HTTP router configured for Supabase
- ✅ Tracker showing on map with real-time updates
- ✅ Devices stored in Supabase PostgreSQL database

## Next Steps

1. **Test with curl command above**
2. Upload code to Arduino
3. Watch device appear on map with real-time updates!
