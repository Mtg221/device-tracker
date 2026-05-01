# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Create a new project (or use existing)
4. Copy your project URL and anon key

## 2. Create Database Table

Go to SQL Editor and run:

```sql
-- Create devices table
CREATE TABLE devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  name TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5, 2) DEFAULT 0,
  battery INTEGER DEFAULT 0,
  status TEXT DEFAULT 'offline',
  last_update TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for device_id
CREATE INDEX idx_devices_device_id ON devices(device_id);

-- Enable Row Level Security
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read (for demo)
CREATE POLICY "Allow public read access" ON devices
  FOR SELECT USING (true);

-- Create policy to allow public insert (for Arduino)
CREATE POLICY "Allow public insert" ON devices
  FOR INSERT WITH CHECK (true);

-- Create policy to allow public update
CREATE POLICY "Allow public update" ON devices
  FOR UPDATE USING (true);
```

## 3. Get Your Credentials

From Supabase Dashboard:
- Settings → API
- Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
- Copy **anon/public key**

## 4. Update Environment Variables

Create `.env.local` in project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Update Arduino Code

In `tracker_device_updated.ino`, update:

```cpp
// Supabase REST endpoint
#define SUPABASE_URL "https://your-project.supabase.co"
#define SUPABASE_KEY "your-anon-key"
#define DEVICE_ID "2AJYU-SIM7000G"
```

## 6. Test

```bash
# Start React app
npm run dev

# Test data insertion
curl -X POST https://your-project.supabase.co/rest/v1/devices \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{"device_id":"test-1","name":"Test Device","latitude":14.7167,"longitude":-17.4677,"battery":85}'
```
