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
VITE_SUPABASE_URL=https://tlhqgdvnnswmhtljmuut.supabase.co
SUPABASE_KEY=your-supabase-key-here
```

## Tracker Integration

Your custom tracker can send location updates to the Supabase backend:

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
curl -X POST https://your-app.supabase.co/tracker/update \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "TRACK001",
    "latitude": 14.7167,
    "longitude": -17.4677,
    "speed": 45,
    "battery": 87
  }'
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
VITE_SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

## Tracker Integration

Your custom tracker can send location updates to the Supabase backend:

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
curl -X POST https://your-app.supabase.co/tracker/update \
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
│   ├── pages/        # Page components
│   └── data/        # Mock data
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
VITE_SUPABASE_URL=https://tlhqgdvnnswmhtljmuut.supabase.co
SUPABASE_KEY=your-supabase-key-here
```

## Tracker Integration

Your custom tracker can send location updates to the Supabase backend:

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
curl -X POST https://your-app.supabase.co/tracker/update \
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
│   ├── pages/        # Page components
│   └── data/        # Mock data
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
VITE_SUPABASE_URL=https://tlhqgdvnnswmhtljmuut.supabase.co
SUPABASE_KEY=your-supabase-key-here
```

## Tracker Integration

Your custom tracker can send location updates to the Supabase backend:

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
curl -X POST https://your-app.supabase.co/tracker/update \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "TRACK001",
    "latitude": 14.7167,
  "longitude": -17.4677,
  "speed": 45,
  "battery": 87
  }'
```