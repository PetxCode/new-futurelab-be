# Vercel Deployment Checklist

## Pre-Deployment

- [ ] All code is committed and pushed to GitHub/GitLab/Bitbucket
- [ ] Backend code is in the `/backend` folder
- [ ] `.vercelignore` file exists in backend folder
- [ ] `vercel.json` is configured with correct paths
- [ ] All dependencies are in `package.json`
- [ ] No local environment variables in code (use .env)
- [ ] `src/index.js` is the entry point

## Environment Variables Setup (in Vercel Dashboard)

- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong random key (32+ characters)
- [ ] `CLOUDINARY_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_SECRET` - Cloudinary API secret
- [ ] `FRONTEND_URL` - Your frontend domain (https://...)
- [ ] `NODE_ENV` - Set to `production`

## Vercel Configuration

- [ ] Vercel account created
- [ ] Git repository connected to Vercel
- [ ] Root directory set to `backend` folder
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] All environment variables added

## Post-Deployment Verification

- [ ] Visit Vercel dashboard - deployment shows "Ready"
- [ ] Health check endpoint responds: `https://your-app.vercel.app/api/health`
- [ ] MongoDB connection successful (check logs)
- [ ] CORS errors resolved (check console logs)
- [ ] Frontend can reach backend API
- [ ] Auth endpoints working (register/login)
- [ ] Subject creation working
- [ ] Video upload working (Cloudinary)

## MongoDB Atlas Setup (if not already done)

- [ ] MongoDB Atlas account created (https://www.mongodb.com/cloud/atlas)
- [ ] Cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist includes: `0.0.0.0/0` (or specific Vercel IPs)
- [ ] Connection string copied (URI format)

## Frontend Integration

- [ ] Update `src/services/api.ts` with production backend URL
- [ ] Add `REACT_APP_API_URL` to frontend `.env`
- [ ] Test API calls from frontend
- [ ] CORS errors should be resolved

## Monitoring & Troubleshooting

- [ ] Set up Vercel alerts (optional)
- [ ] Bookmark Vercel dashboard
- [ ] Keep VERCEL_DEPLOYMENT.md accessible
- [ ] Test all critical API endpoints
- [ ] Monitor logs for errors

## Rollback Plan

- [ ] Previous deployments visible in Vercel dashboard
- [ ] Know how to "Promote" older deployment if needed
- [ ] Have development backend URL as fallback

## Production Checklist

- [ ] No sensitive data in environment variables (except in Vercel)
- [ ] Error messages don't expose internal details
- [ ] Logs are properly formatted
- [ ] Rate limiting considered (if needed)
- [ ] Database backups configured (MongoDB Atlas)
- [ ] Admin user created for production
- [ ] SSL/TLS enabled (automatic on Vercel)
- [ ] Custom domain configured (optional)

## Notes

- Vercel auto-deploys on git push (can be disabled)
- Free tier has usage limits - monitor carefully
- Cold starts may add 1-2 seconds on first request
- MongoDB Atlas free tier has connection limits
- Cloudinary free tier has storage/bandwidth limits

---

**Deployment Date:** ******\_\_\_******
**Backend URL:** https://******\_\_\_******
**Frontend URL:** https://******\_\_\_******
**Status:** [ ] In Progress [ ] Completed [ ] Issues
**Notes:** **********************************\_**********************************
