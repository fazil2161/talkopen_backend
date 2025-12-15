# 🚀 Deploy Backend to Render - Step by Step

## **Prerequisites:**
- GitHub account
- Render account (free: https://render.com)
- MongoDB Atlas (free: https://mongodb.com/cloud/atlas)

---

## **Step 1: Push Backend to GitHub**

```powershell
cd C:\Users\fazil\Downloads\Delta_materials\talkopen

# Make sure backend/.env is in .gitignore (it should be)
git status

# If backend/.env shows up, add it to .gitignore:
echo backend/.env >> .gitignore

# Commit everything EXCEPT .env
git add -A
git commit -m "Prepare backend for Render deployment"
git push origin main
```

---

## **Step 2: Deploy on Render**

### **2.1: Go to Render Dashboard**
- Visit: https://dashboard.render.com
- Click "New +" → "Web Service"

### **2.2: Connect GitHub Repository**
- Select your `talkopen` repository
- Click "Connect"

### **2.3: Configure Service**

**Basic Settings:**
- **Name**: `opentalk-backend` (or any name you want)
- **Region**: Choose closest to you (e.g., Singapore, Oregon)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start` or `node server.js`
- **Plan**: `Free`

### **2.4: Add Environment Variables**

Click "Advanced" → "Add Environment Variable" and add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/opentalk?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your_random_secret_key_here` |
| `JWT_EXPIRE` | `30d` |
| `RAZORPAY_KEY_ID` | `rzp_test_YOUR_KEY` |
| `RAZORPAY_KEY_SECRET` | `your_razorpay_secret` |
| `PREMIUM_PRICE` | `299` |

### **2.5: Create Web Service**
- Click "Create Web Service"
- Wait 2-5 minutes for deployment
- Check logs for "Server running on port..."

---

## **Step 3: Get Your Render URL**

After deployment completes:
- Your URL will be shown at the top: `https://opentalk-backend-XXXX.onrender.com`
- **Copy this exact URL!**

---

## **Step 4: Update Mobile Config**

Replace the URL in `mobile/src/config/config.js`:

```javascript
const BACKEND_URL = 'https://opentalk-backend-XXXX.onrender.com'; // ← YOUR ACTUAL URL
```

---

## **Step 5: Test Backend**

Open in browser:
```
https://opentalk-backend-XXXX.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Open Talk Server is running"
}
```

---

## **Step 6: Rebuild APK**

```powershell
cd C:\Users\fazil\Downloads\Delta_materials\talkopen
git add mobile/src/config/config.js
git commit -m "Update backend URL to Render"
git push origin main

cd mobile
eas build --profile preview --platform android --clear-cache
```

---

## **🔥 Common Issues:**

### **Issue 1: Build Failed on Render**
- Check "Logs" tab in Render dashboard
- Common cause: Missing dependencies
- Fix: Ensure `backend/package.json` has all dependencies

### **Issue 2: MongoDB Connection Error**
- Check logs: "MongoServerError"
- Fix: Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0)

### **Issue 3: Service Crashes After Start**
- Check logs for error messages
- Common cause: Missing environment variables
- Fix: Add all required env vars in Render dashboard

---

## **✅ Success Checklist:**

- [ ] Render service shows "Live" (green)
- [ ] `/health` endpoint returns OK
- [ ] Logs show "MongoDB connected successfully"
- [ ] Logs show "Server running on port XXXX"
- [ ] Mobile config updated with Render URL
- [ ] APK rebuilt with new URL

---

**After completing these steps, your backend will be accessible worldwide!** 🌍

