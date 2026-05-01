# DeviceTracker

Real-time GPS device tracking application with custom tracker integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Project Structure

```
devicetracker/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/         # Page components
│   └── data/        # Mock data
└── package.json
```

2. Start the development server:
```bash
npm run dev
```

## Project Structure

```
devicetracker/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   └── data/            # Mock data
└── package.json
```

## Deployment

### Vercel Deployment

1. Create a `vercel.json` file in the project root (already created):
\```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

2. Install Vercel CLI (if you have permission):
```bash
npm install -g vercel
```

3. Deploy to Vercel:
```bash
vercel
```

If you encounter permission issues with npm, you can alternatively deploy via the Vercel dashboard:
1. Push your code to a GitHub repository
2. Connect your GitHub account to Vercel
3. Import the repository as a new project in Vercel dashboard
4. Vercel will automatically detect the Vite project and configure the build settings

### Environment Variables

For deployment, you'll need to set the following environment variables in your Vercel project settings:

```
VITE_SUPABASE_URL=https://tlhqgdvnnswmhtljmuut.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsaHFnZHZubnN3bWh0bGptdXV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzU3ODc2NSwiZXhwIjoyMDkzMTU0NzY1fQ.qRAyDyXclLYQibJtjPwkJRv3iUR7bwXBF7fX0Df0qrM
```

2. Start the development server:
```bash
npm run dev
```

## Tracker Integration

Your custom tracker can send location updates to the Convex backend:

### API Endpoint

```
POST /tracker/update
```

### Request Body

```json
{
  "deviceId": "TRACK001",
  "latitude": 14.7167,
  "longitude": -17.4677,
  "speed": 45,
  "battery": 87
}
```

### Example

```bash
curl -X POST https://your-app.convex.cloud/tracker/update \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "TRACK001",
    "latitude": 14.7167,
    "longitude": -17.4677,
    "speed": 45,
    "battery": 87
  }'
```

2. Install Vercel CLI (if you have permission):
```bash
npm install -g vercel
```

3. Deploy to Vercel:
```bash
vercel
```

If you encounter permission issues with npm, you can alternatively deploy via the Vercel dashboard:
1. Push your code to a GitHub repository
2. Connect your GitHub account to Vercel
3. Import the repository as a new project in Vercel dashboard
4. Vercel will automatically detect the Vite project and configure the build settings

### Environment Variables

For deployment, you'll need to set the following environment variables in your Vercel project settings:

```
VITE_CONVEX_URL=https://fantastic-chipmunk-934.eu-west-1.convex.cloud
VITE_CONVEX_SITE_URL=https://fantastic-chipmunk-934.eu-west-1.convex.site
```

## Tracker Integration

Your custom tracker can send location updates to the Convex backend:

### API Endpoint

```
POST /tracker/update
```

### Request Body

```json
{
  "deviceId": "TRACK001",
  "latitude": 14.7167,
  "longitude": -17.4677,
  "speed": 45,
  "battery": 87
}
```

### Example

```bash
curl -X POST https://your-app.convex.cloud/tracker/update \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "TRACK001",
    "latitude": 14.7167,
    "longitude": -17.4677,
    "speed": 45,
    "battery": 87
  }'
```

## Project Structure

```
devicetracker/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   └── data/            # Mock data
├── convex/
│   ├── schema.ts        # Database schema
│   ├── devices.ts       # Device queries & mutations
│   ├── tracker.ts       # Tracker action
│   └── http.ts          # HTTP endpoints for tracker
└── package.json
```

## Deployment

### Vercel Deployment

1. Create a `vercel.json` file in the project root (already created):
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

2. Install Vercel CLI (if you have permission):
```bash
npm install -g vercel
```

3. Deploy to Vercel:
```bash
vercel
```

If you encounter permission issues with npm, you can alternatively deploy via the Vercel dashboard:
1. Push your code to a GitHub repository
2. Connect your GitHub account to Vercel
3. Import the repository as a new project in Vercel dashboard
4. Vercel will automatically detect the Vite project and configure the build settings

### Environment Variables

For deployment, you'll need to set the following environment variables in your Vercel project settings:

```
VITE_CONVEX_URL=https://fantastic-chipmunk-934.eu-west-1.convex.cloud
VITE_CONVEX_SITE_URL=https://fantastic-chipmunk-934.eu-west-1.convex.site
```
