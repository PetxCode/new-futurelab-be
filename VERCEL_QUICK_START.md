# Vercel Deployment - Quick Start

## 🚀 5-Minute Setup

### Step 1: Push Code to Git

```bash
cd backend
git add .
git commit -m "Prepare backend for Vercel deployment"
git push origin main
```

### Step 2: Create Vercel Project

1. Visit https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub/GitLab repository
4. Click "Import"

### Step 3: Configure Project

1. **Root Directory:** Set to `backend`
2. **Framework Preset:** Select "Other"
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

| Variable            | Value                                 |
| ------------------- | ------------------------------------- |
| `MONGODB_URI`       | `mongodb+srv://username:password@...` |
| `JWT_SECRET`        | Your secret key                       |
| `CLOUDINARY_NAME`   | Your cloudinary name                  |
| `CLOUDINARY_KEY`    | Your API key                          |
| `CLOUDINARY_SECRET` | Your API secret                       |
| `FRONTEND_URL`      | `https://your-frontend.vercel.app`    |
| `NODE_ENV`          | `production`                          |

### Step 5: Deploy

Click "Deploy" button and wait for completion (2-3 minutes)

## ✅ Verify Deployment

Test your deployment with:

```bash
# Check health
curl https://your-app.vercel.app/api/health

# Should return:
# {"success":true,"message":"Server is running"}
```

## 🔗 Update Frontend

In your frontend `.env`:

```
REACT_APP_API_URL=https://your-app.vercel.app/api
```

Then in `src/services/api.ts`:

```typescript
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";
```

## 📋 What Was Configured

✅ `vercel.json` - Correct paths and environment variable placeholders
✅ `package.json` - Added build script for Vercel
✅ `src/index.js` - Updated CORS for multiple origins
✅ `.vercelignore` - Excludes unnecessary files
✅ `.env.example` - Updated with production examples
✅ `VERCEL_DEPLOYMENT.md` - Full deployment guide
✅ `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist

## ⚠️ Important Notes

- **Cold Starts:** First request may take 1-2 seconds (normal)
- **Free Tier Limits:** Monitor your usage
- **MongoDB Connection:** Make sure to whitelist Vercel IPs (use 0.0.0.0/0)
- **Auto-Deploy:** Every git push deploys automatically
- **Rollback:** Previous deployments are kept for rollback

## 🆘 Troubleshooting

**"Cannot find module"**
→ Make sure dependency is in `package.json`, run `npm install` locally

**"MongoDB connection failed"**
→ Check MONGODB_URI is correct and IPs are whitelisted

**"CORS error"**
→ Ensure FRONTEND_URL env var is set and matches your frontend domain

**"Build failed"**
→ Check Vercel logs: Dashboard → Project → Deployments → Click failed build

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Check logs in Vercel dashboard for debugging
- Review VERCEL_DEPLOYMENT.md for detailed guide

---

**Deployment Status:** Ready to deploy! Follow steps above to get live. 🎉
