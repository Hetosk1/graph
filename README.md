# Graph Hierarchy API

SIT Full Stack Engineering Challenge — Round 1

## ⚡ Quick Start (Local)

```bash
npm install
npm start
# Open http://localhost:3000
```

## 🚀 Deploy to Render (Recommended — Free)

1. Push this repo to GitHub (make it **public**)
2. Go to https://render.com → Sign up / Log in
3. Click **New → Web Service**
4. Connect your GitHub repo
5. Fill in:
   - **Name**: `graph-api` (or anything)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
6. Click **Create Web Service**
7. Wait ~2 min → your URL will be `https://your-app.onrender.com`
8. API endpoint: `https://your-app.onrender.com/api/graph`

## 🚀 Deploy to Railway

1. Go to https://railway.app → Login with GitHub
2. Click **New Project → Deploy from GitHub Repo**
3. Select this repo
4. Railway auto-detects Node.js and runs `npm start`
5. Click **Generate Domain** under Settings
6. Done!

## 🚀 Deploy to Vercel (Alternative)

> Note: Vercel works best with serverless. You'll need to restructure slightly.
> Render or Railway is simpler for Express apps.

## 📋 Before Deploying — Fill In Your Details

Open `api/graph.js` and replace the top 3 lines:

```js
const USER_ID = "yourname_ddmmyyyy";      // e.g. "johndoe_17091999"
const EMAIL_ID = "your.email@uni.edu";    // your university email
const ENROLLMENT_NUMBER = "21XXXXX";      // your enrollment number
```

## 📡 API Usage

```bash
curl -X POST https://your-app.onrender.com/api/graph \
  -H "Content-Type: application/json" \
  -d '{"edges": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X"]}'
```
