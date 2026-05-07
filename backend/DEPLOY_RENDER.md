# Backend Deployment to Render - Step by Step

## Quick Deploy

1. **Go to Render.com**
   - Visit: https://render.com
   - Sign up or log in

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository OR upload files manually

3. **Configure Service**
   - **Name**: `driveelite-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `backend` (if repo root is different)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

4. **Add Environment Variables**
   Click "Environment" and add:
   ```
   MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/car_rental
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   PORT=3001
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://driveelite-backend.onrender.com`)

## MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create free cluster or use existing
3. Database Access → Add User
4. Network Access → Add IP: `0.0.0.0/0` (allow all)
5. Connect → Copy connection string
6. Replace in MONGO_URI

## CORS Configuration

After deployment, update CORS in `backend/server.js`:
```javascript
app.use(cors({ 
  origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
  credentials: true 
}));
```

## Test Backend

Visit: `https://your-backend.onrender.com`
Expected: `🚗 DriveElite API is running`

## Troubleshooting

**Logs**: Render Dashboard → Logs tab
**Restart**: Manual restart in dashboard
**Scale**: Free tier sleeps after 15 min inactivity
