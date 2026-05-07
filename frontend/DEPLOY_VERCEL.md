# Frontend Deployment to Vercel - Step by Step

## Quick Deploy

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up with GitHub (recommended) or GitLab

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your Git repository OR use Vercel CLI

3. **Configure Project**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (or leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build (~1-2 minutes)
   - Copy your frontend URL

## Using Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Update Backend CORS

After deployment, update `backend/server.js`:
```javascript
app.use(cors({ 
  origin: ["http://localhost:5173", "https://your-app.vercel.app"],
  credentials: true 
}));
```

Then redeploy backend to Render.

## Custom Domain (Optional)

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update DNS records as shown

## Test Frontend

1. Visit your Vercel URL
2. Try logging in as admin
3. Check if cars load and bookings work

## Troubleshooting

**Blank page**: Check browser console for API errors
**CORS errors**: Update backend CORS settings
**Not building**: Check `vite.config.js` configuration
