# 🚀 Deployment Guide - DriveElite

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (Vercel)      │◄───────►│    (Render)     │
│   React + Vite  │  API    │  Node.js + Express
│                 │         │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  MongoDB     │
                              │  Atlas       │
                              └──────────────┘
```

## Quick Deploy (5 minutes)

### 1. Deploy Backend to Render

```bash
cd backend
```

**Steps:**
1. Go to https://render.com
2. New Web Service
3. Connect your repo
4. Settings:
   - Build: `npm install`
   - Start: `node server.js`
5. Add env variables:
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Random 32+ chars
   - `PORT`: `3001`
6. Deploy

**Copy your backend URL**: `https://driveelite-backend.onrender.com`

### 2. Deploy Frontend to Vercel

```bash
cd frontend
```

**Steps:**
1. Go to https://vercel.com
2. Add New Project
3. Import your repo
4. Update `.env.production`:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. Deploy

**Your app is live!** 🎉

---

## Detailed Instructions

### Backend (Render.com)

1. **Create Account**: https://render.com
2. **New Web Service** → Connect GitHub
3. **Configure**:
   - Name: `driveelite-backend`
   - Region: Closest to users
   - Build: `npm install`
   - Start: `node server.js`
4. **Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/car_rental
   JWT_SECRET=super_secret_key_min_32_characters_long
   PORT=3001
   NODE_ENV=production
   ```
5. **Deploy**

### Frontend (Vercel)

1. **Create Account**: https://vercel.com
2. **Add Project** → Import Git repo
3. **Configure**:
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. **Deploy**

---

## MongoDB Setup

1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Database Access → Add user
4. Network Access → `0.0.0.0/0`
5. Connect → Copy connection string
6. Use in `MONGO_URI`

---

## Update CORS (Important!)

After deployment, update `backend/server.js`:

```javascript
app.use(cors({ 
  origin: [
    "http://localhost:5173",
    "https://your-app.vercel.app"
  ],
  credentials: true 
}));
```

Then redeploy backend.

---

## Test Deployment

1. ✅ Backend responds: `https://your-backend.onrender.com`
2. ✅ Frontend loads: `https://your-app.vercel.app`
3. ✅ Login works
4. ✅ Cars display
5. ✅ Bookings create

---

## Environment Variables Summary

### Backend (.env)
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=3001
NODE_ENV=production
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Update backend CORS origins |
| Blank page | Check VITE_API_URL |
| DB connection | Check MongoDB IP whitelist |
| 404 errors | Verify API URL format |

---

## Costs

- **Vercel**: Free (unlimited projects)
- **Render**: Free (with sleep) / $7/mo (pro)
- **MongoDB Atlas**: Free (512MB)
- **Total**: $0/month (free tier)

---

## Post-Deploy

1. Change default admin password
2. Set up monitoring
3. Enable auto-deploy from Git
4. Add custom domain (optional)
5. Set up SSL (automatic on Vercel/Render)

---

## Support

- Render logs: Dashboard → Logs
- Vercel logs: Dashboard → Deployments
- MongoDB: Atlas → Logs

Good luck! 🚗
