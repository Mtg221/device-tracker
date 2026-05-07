# Deployment Guide - DriveElite Car Rental

## Overview
This guide covers deploying the DriveElite multi-admin car rental platform to various hosting platforms.

## Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (for production database)
- Git repository (optional but recommended)

## Option 1: Deploy to Render.com (Recommended - Free Tier Available)

### Backend Deployment (Render.com)

1. **Prepare Backend:**
```bash
cd backend
npm init -y  # if not already done
```

2. **Create `render.yaml` in backend folder:**
```yaml
services:
  - type: web
    name: driveelite-backend
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: PORT
        value: 3001
```

3. **Deploy:**
   - Go to https://render.com
   - Create new Web Service
   - Connect your Git repo or upload files
   - Set build command: `npm install`
   - Set start command: `node server.js`
   - Add environment variables:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Random secure string
     - `PORT`: 3001

### Frontend Deployment (Render.com or Vercel)

**Option A: Render.com**
1. Create new Static Site
2. Build command: `cd frontend && npm install && npm run build`
3. Publish directory: `frontend/dist`

**Option B: Vercel (Recommended for Frontend)**
1. Go to https://vercel.com
2. Import your frontend folder
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:
   - `VITE_API_URL`: Your backend URL (e.g., `https://driveelite-backend.onrender.com/api`)

---

## Option 2: Deploy to Railway.app

### Backend (Railway)

1. **Create `Procfile` in backend folder:**
```
web: node server.js
```

2. **Deploy:**
   - Go to https://railway.app
   - New Project → Deploy from GitHub
   - Select backend folder
   - Add environment variables:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `PORT`

### Frontend (Railway or Vercel)

Same as Render.com process.

---

## Option 3: Deploy to Heroku

### Backend (Heroku)

1. **Create `Procfile`:**
```
web: node server.js
```

2. **Create `.env` file:**
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=3001
```

3. **Deploy:**
```bash
cd backend
heroku create driveelite-backend
heroku config:set MONGO_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_secret"
git push heroku main
```

---

## Option 4: Deploy to DigitalOcean App Platform

1. Create App
2. Add backend component (Node.js)
3. Add frontend component (Static Site)
4. Set environment variables
5. Deploy

---

## Option 5: Self-Hosted (VPS/Server)

### Requirements:
- Ubuntu 20.04+ server
- Node.js 16+
- PM2 process manager
- Nginx reverse proxy
- MongoDB (local or Atlas)

### Installation Steps:

**1. Install Dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install MongoDB (if self-hosting)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**2. Deploy Backend:**
```bash
cd /var/www/driveelite/backend
npm install --production
pm2 start server.js --name driveelite-backend
pm2 save
pm2 startup
```

**3. Deploy Frontend:**
```bash
cd /var/www/driveelite/frontend
npm install
npm run build
sudo mkdir -p /var/www/driveelite/dist
sudo cp -r dist/* /var/www/driveelite/dist/
```

**4. Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/driveelite
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/driveelite/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/driveelite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**5. SSL Certificate (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/car_rental
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=3001
NODE_ENV=production
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
4. Add IP whitelist (0.0.0.0/0 for all IPs or specific IPs)
5. Create database user
6. Copy connection string to `.env`

Example:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/car_rental?retryWrites=true&w=majority
```

---

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is built and serving files
- [ ] Database connection is working
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly
- [ ] SSL certificate is installed
- [ ] Default admin account works
- [ ] Can create new admins
- [ ] Can add cars to fleet
- [ ] Regional filtering works
- [ ] Bookings can be created

---

## Troubleshooting

### Backend won't start
```bash
# Check logs
pm2 logs driveelite-backend

# Restart
pm2 restart driveelite-backend

# Check environment variables
pm2 show driveelite-backend
```

### Frontend shows blank page
- Check browser console for errors
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend

### Database connection errors
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions

### CORS errors
Update backend `server.js`:
```javascript
app.use(cors({ 
  origin: "https://your-frontend-domain.com",
  credentials: true 
}));
```

---

## Performance Optimization

### Backend:
- Enable compression: `npm install compression`
- Use cluster mode in PM2: `pm2 start server.js -i max`
- Add caching with Redis

### Frontend:
- Enable gzip compression in Nginx
- Use CDN for static assets
- Lazy load components

---

## Security Recommendations

1. **Change default credentials immediately**
2. **Use strong JWT_SECRET**
3. **Enable HTTPS everywhere**
4. **Set up regular backups**
5. **Keep dependencies updated**
6. **Use environment variables for secrets**
7. **Implement rate limiting**
8. **Add input validation**

---

## Monitoring

### Recommended Tools:
- **Uptime**: UptimeRobot (free)
- **Logs**: LogRocket or Sentry
- **Analytics**: Google Analytics
- **Errors**: Sentry (free tier)

---

## Scaling

When ready to scale:
1. Upgrade database plan
2. Add load balancer
3. Use CDN for static assets
4. Implement caching (Redis)
5. Add database indexes
6. Optimize queries

---

## Support

For issues:
1. Check logs first
2. Verify environment variables
3. Test database connection
4. Review CORS settings
5. Check network/firewall rules

---

## Cost Estimates

**Free Tier:**
- Render: Free backend (with limitations)
- Vercel: Free frontend
- MongoDB Atlas: Free 512MB
- **Total: $0/month**

**Production:**
- Render/Vercel Pro: $20/month
- MongoDB Atlas: $25/month (2GB)
- Domain: $12/year
- **Total: ~$45/month**

**Self-Hosted:**
- VPS (DigitalOcean): $6/month
- Domain: $12/year
- **Total: ~$7/month**

---

Good luck with your deployment! 🚀
