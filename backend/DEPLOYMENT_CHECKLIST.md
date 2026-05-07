# Deployment Checklist

## Before Deployment

- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster set up
- [ ] Database user created
- [ ] IP whitelist set to `0.0.0.0/0`
- [ ] Connection string copied
- [ ] Backend `.env` file configured
- [ ] Frontend `.env.production` ready

## Backend (Render)

- [ ] Account created on Render
- [ ] Web Service created
- [ ] Repository connected
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`
- [ ] Environment variables set:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `PORT=3001`
  - [ ] `NODE_ENV=production`
  - [ ] `ALLOWED_ORIGINS` (optional)
- [ ] Deployment successful
- [ ] Backend URL copied

## Frontend (Vercel)

- [ ] Account created on Vercel
- [ ] Project imported
- [ ] Framework: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable set:
  - [ ] `VITE_API_URL` = backend URL + `/api`
- [ ] Deployment successful
- [ ] Frontend URL copied

## Post-Deployment

- [ ] CORS configured in backend
- [ ] Backend redeployed
- [ ] Frontend tested
- [ ] Login works
- [ ] Cars display
- [ ] Bookings work
- [ ] Default admin password changed

## URLs to Save

- Backend: `_______________________________`
- Frontend: `_______________________________`
- MongoDB Atlas: `https://cloud.mongodb.com`
- Render Dashboard: `https://dashboard.render.com`
- Vercel Dashboard: `https://vercel.com/dashboard`

## Troubleshooting

### Backend Issues
- Check Render logs
- Verify MongoDB connection
- Check environment variables

### Frontend Issues
- Check Vercel deployment logs
- Verify VITE_API_URL
- Check browser console for errors

### Database Issues
- Verify MongoDB connection string
- Check IP whitelist
- Verify database user permissions
