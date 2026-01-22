# Vercel Deployment Guide

## Backend Deployment to Vercel

### Prerequisites

- Vercel account (https://vercel.com)
- Git repository with backend code pushed to GitHub, GitLab, or Bitbucket
- Environment variables ready

### Step 1: Prepare Environment Variables

Add these environment variables in Vercel dashboard:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/themake
JWT_SECRET = your-secret-key-here
CLOUDINARY_NAME = your-cloudinary-name
CLOUDINARY_KEY = your-cloudinary-api-key
CLOUDINARY_SECRET = your-cloudinary-secret-key
FRONTEND_URL = https://your-frontend-domain.com
NODE_ENV = production
```

### Step 2: Deploy Backend

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your Git repository
4. **Important:** Select the `backend` folder as root directory
5. Framework Preset: "Other" (since it's a custom Express app)
6. Add all environment variables from Step 1
7. Click "Deploy"

### Step 3: Configure Root Directory

If Vercel doesn't auto-detect the backend folder:

1. In project settings → General
2. Set "Root Directory" to `backend`
3. Set "Build Command" to `npm install`
4. Set "Start Command" to `npm start`

### Step 4: Update Frontend Configuration

Update the frontend API calls to use the Vercel URL:

In `src/services/api.ts`:

```typescript
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://your-backend.vercel.app/api";
```

In frontend `.env`:

```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

### Step 5: Update CORS

The backend is now configured to accept:

- `http://localhost:3000`
- `http://localhost:5173`
- `FRONTEND_URL` environment variable

Set `FRONTEND_URL` in Vercel to your actual frontend URL.

### Monitoring

1. View logs: Vercel Dashboard → Your Project → "Deployments" tab
2. Check real-time logs: Click on deployment → "Logs"
3. Health check: `https://your-backend.vercel.app/api/health`

### Troubleshooting

**Issue: "Cannot find module"**

- Solution: Ensure all dependencies are in `package.json` (not just `node_modules`)

**Issue: "MongoDB connection failed"**

- Solution: Check MONGODB_URI environment variable is set correctly
- Make sure MongoDB cluster allows Vercel IP addresses

**Issue: "CORS error"**

- Solution: Update `FRONTEND_URL` environment variable in Vercel
- Restart deployment after updating env vars

**Issue: "Build failed"**

- Check build logs in Vercel dashboard
- Verify `src/index.js` exists and is properly formatted

### Files Modified for Vercel

- ✅ `vercel.json` - Updated with correct path and environment variables
- ✅ `package.json` - Added build script
- ✅ `src/index.js` - Updated CORS configuration with multiple origins
- ✅ `.vercelignore` - Created to exclude unnecessary files

### Deployment Status Checks

After deployment, verify:

1. **Health endpoint**: GET `https://your-backend.vercel.app/api/health`
2. **Auth endpoint**: POST to `/api/auth/register` with test data
3. **Database**: Check if MongoDB connection succeeds in logs
4. **CORS**: Frontend should be able to call API without CORS errors

### Auto-Deployments

Every push to your main branch will automatically trigger a new deployment.

To disable auto-deploy: Project Settings → Git → "Automatic Deployments" toggle

### Next Steps

1. Deploy backend first
2. Update frontend API URL to production backend
3. Deploy frontend (similar process)
4. Test end-to-end functionality

### Rollback

If deployment fails:

1. Go to Deployments tab
2. Find the last working deployment
3. Click "..." → "Promote to Production"
