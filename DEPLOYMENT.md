# 🚀 Production Deployment Checklist

## E-Commerce Chat Assistant - Vercel + Render Deployment

---

## 📋 Pre-Deployment Checklist

### 1. MongoDB Atlas Setup

- [ ] Create MongoDB Atlas account at https://cloud.mongodb.com
- [ ] Create a new cluster (M0 Free tier is fine for starting)
- [ ] Create a database user with read/write access
- [ ] Get connection string (replace `<password>` with actual password)
- [ ] Whitelist `0.0.0.0/0` in Network Access (allows connections from anywhere)

**Connection String Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecommerce-chat-assistant?retryWrites=true&w=majority
```

### 2. Gemini API Key

- [ ] Get API key from https://aistudio.google.com/app/apikey
- [ ] Test it works locally first
- [ ] Keep it secret (never commit to Git)

### 3. Generate JWT Secret

Run this command to generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🖥️ Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub for easy deployment

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the repository: `E-Commerce-Chat-Assistant`

### Step 3: Configure Service
| Setting | Value |
|---------|-------|
| **Name** | `ecommerce-chat-api` (or your choice) |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free (for testing) or Starter ($7/mo) |

### Step 4: Set Environment Variables

Click "Environment" and add these variables:

| Key | Value | Required |
|-----|-------|----------|
| `NODE_ENV` | `production` | ✅ |
| `PORT` | `10000` | ✅ |
| `MONGO_URI` | `mongodb+srv://...` | ✅ |
| `JWT_SECRET` | (generated secret) | ✅ |
| `JWT_EXPIRE` | `30d` | ✅ |
| `GEMINI_API_KEY` | (your API key) | ✅ |
| `FRONTEND_URL` | `https://your-app.vercel.app` | ✅ |
| `JUMIA_BASE_URL` | `https://www.jumia.com.gh` | ⚙️ |
| `SCRAPER_THROTTLE_MS` | `2000` | ⚙️ |

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for build to complete (3-5 minutes)
3. Note your API URL: `https://your-app.onrender.com`

### Step 6: Verify Deployment
```bash
# Test root endpoint
curl https://your-app.onrender.com

# Test health endpoint
curl https://your-app.onrender.com/health
```

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import from GitHub
3. Select the repository

### Step 3: Configure Project
| Setting | Value |
|---------|-------|
| **Project Name** | `shopsmart` (or your choice) |
| **Framework Preset** | Vite |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 4: Set Environment Variables

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-app.onrender.com/api` |

⚠️ **Important:** Include `/api` at the end of the URL!

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build (1-2 minutes)
3. Note your URL: `https://your-app.vercel.app`

### Step 6: Update Backend CORS

After getting your Vercel URL, go back to Render and add/update:
```
FRONTEND_URL=https://your-app.vercel.app
```

Then manually redeploy the backend.

---

## ✅ Post-Deployment Verification

### 1. Test API Endpoints

```bash
# Health check
curl https://your-backend.onrender.com/health

# Test auth (should return error - no credentials)
curl https://your-backend.onrender.com/api/auth/login

# Check CORS headers
curl -I -X OPTIONS https://your-backend.onrender.com/api/auth/login \
  -H "Origin: https://your-frontend.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

### 2. Test Frontend
1. Open your Vercel URL
2. Try to register a new account
3. Try the chat feature
4. Verify products load correctly

### 3. Monitor First Requests
- First request after idle may take 30-50 seconds (cold start on free tier)
- Subsequent requests should be fast (< 500ms)

---

## 🐛 Common Issues & Fixes

### Issue 1: CORS Errors

**Symptom:** Browser console shows "blocked by CORS policy"

**Fix:**
1. Verify `FRONTEND_URL` is set correctly in Render
2. Make sure it matches EXACTLY (including `https://`)
3. Redeploy backend after changing

### Issue 2: 502 Bad Gateway

**Symptom:** API returns 502 errors

**Fix:**
1. Check Render logs for errors
2. Verify `MONGO_URI` is correct
3. Ensure MongoDB Atlas allows connections from `0.0.0.0/0`

### Issue 3: Cold Start Delays

**Symptom:** First request takes 30+ seconds

**Cause:** Free tier instances spin down after 15 minutes of inactivity

**Fix:**
1. Upgrade to Starter plan ($7/mo) for always-on
2. Or use a cron service to ping your API every 10 minutes:
   - https://cron-job.org (free)
   - Set to ping `https://your-backend.onrender.com/health`

### Issue 4: AI Request Timeouts

**Symptom:** Chat requests timeout or fail

**Fix:**
1. Increase timeout in frontend `api.js` (already set to 15s)
2. Check Gemini API key is valid
3. Check rate limits haven't been exceeded

### Issue 5: MongoDB Connection Failures

**Symptom:** "MongoDB connection error" in logs

**Fix:**
1. Verify connection string format
2. Check username/password are correct
3. Ensure IP whitelist includes `0.0.0.0/0`
4. Check MongoDB Atlas cluster is active

### Issue 6: Environment Variable Mismatch

**Symptom:** Features work locally but not in production

**Fix:**
1. Compare local `.env` with Render variables
2. Ensure all required variables are set
3. Remember: Vite requires `VITE_` prefix for frontend vars

---

## 🔒 Security Best Practices

### ✅ Already Implemented
- [x] Rate limiting on all endpoints
- [x] JWT token blacklisting
- [x] Input validation with Zod
- [x] CORS restricted to frontend origin
- [x] Helmet security headers
- [x] Environment variable configuration
- [x] API keys stored server-side only

### ⚠️ Recommended for Production
- [ ] Enable MongoDB Atlas audit logs
- [ ] Set up Sentry for error monitoring
- [ ] Configure Render alerts for downtime
- [ ] Enable 2FA on all platform accounts
- [ ] Regular dependency updates (`npm audit fix`)

---

## 🎯 AI Chat Assistant Optimization

### Current Implementation Analysis
- ✅ Gemini 2.0 Flash model (fast inference)
- ✅ System prompt optimized for shopping intent
- ✅ Fallback logic for API failures
- ✅ Rate limiting (30 req/min) protects API costs
- ✅ Conversation history maintained (6 messages)

### Recommended Improvements

#### 1. Reduce Latency
```javascript
// Already implemented: Connection pooling in database.js
// Consider: Adding Redis caching for frequent queries
```

#### 2. Add Response Caching
Consider caching common AI responses:
- "What products do you have?"
- Generic greetings
- Error messages

#### 3. Implement RAG (Future Enhancement)
For connecting AI to product search:
1. Generate embeddings for products using `embedding` field in Product model
2. Use vector similarity search in MongoDB Atlas
3. Include relevant products in AI context

#### 4. API Key Security
- ✅ Gemini key is backend-only (safe)
- ✅ Never exposed to frontend
- Consider: Key rotation schedule

---

## 📊 Monitoring & Maintenance

### Render Dashboard
- View logs: Dashboard → Your Service → Logs
- View metrics: Dashboard → Your Service → Metrics
- Set up alerts for failures

### Vercel Dashboard
- View deployments: Dashboard → Your Project → Deployments
- View analytics: Dashboard → Your Project → Analytics
- Check function logs for any SSR issues

### MongoDB Atlas
- Monitor connections: Cluster → Metrics
- Check slow queries: Cluster → Performance Advisor
- Set up alerts: Project → Alerts

---

## 🎉 Final Checklist

After deployment, verify:

- [ ] Frontend loads at Vercel URL
- [ ] Login/Registration works
- [ ] Chat assistant responds
- [ ] Product search returns results
- [ ] Cart operations work
- [ ] No CORS errors in console
- [ ] Health endpoint returns "healthy"
- [ ] Logs show no errors

**Congratulations! Your app is now live! 🚀**
