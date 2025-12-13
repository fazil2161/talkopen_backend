# Backend .env File Setup

## 📝 Create .env File

The backend needs a `.env` file to work. Follow these steps:

### Step 1: Navigate to Backend Folder
```bash
cd C:\Users\fazil\Downloads\Delta_materials\talkopen\backend
```

### Step 2: Create .env File
Create a new file named `.env` (exactly this name, no .txt extension)

**Using Command Line:**
```bash
# PowerShell
New-Item -Path ".env" -ItemType File
```

**Or using Notepad:**
1. Right-click in backend folder
2. New → Text Document
3. Rename to `.env` (remove .txt)

### Step 3: Add This Content to .env

Copy and paste this into the `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Database
MONGODB_URI=mongodb://localhost:27017/opentalk

# JWT Authentication (change this secret key!)
JWT_SECRET=opentalk_secret_key_12345_change_in_production
JWT_EXPIRE=30d

# Razorpay Payment Gateway (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY

# App Settings
PREMIUM_PRICE=299
```

### Step 4: Save the File

Make sure:
- File name is exactly `.env` (with the dot)
- No .txt extension
- Located in: `backend/` folder

---

## 🔑 Optional: Configure Razorpay (for Payments)

If you want to test payments:

1. **Sign up at Razorpay:**
   - Visit: https://razorpay.com
   - Create free account

2. **Get Test Keys:**
   - Go to Dashboard → Settings → API Keys
   - Click "Generate Test Keys"
   - Copy Key ID (starts with `rzp_test_`)
   - Copy Key Secret

3. **Update .env:**
   ```env
   RAZORPAY_KEY_ID=rzp_test_1234567890abcd
   RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwx
   ```

4. **Update mobile config:**
   - File: `mobile/src/config/config.js`
   - Update: `RAZORPAY_KEY = 'rzp_test_1234567890abcd'`

---

## ✅ Verify Setup

1. **Check .env exists:**
   ```bash
   dir .env
   # Should show the file
   ```

2. **Start backend:**
   ```bash
   npm run dev
   ```

3. **Should see:**
   ```
   🚀 Server running on port 5000
   📱 Open Talk Backend is ready!
   MongoDB connected successfully
   ```

---

## 🐛 Troubleshooting

### "Cannot find module 'dotenv'"
```bash
cd backend
npm install
```

### "MongoDB connection failed"
- Make sure MongoDB is installed
- Start MongoDB: `mongod`
- Check MONGODB_URI in .env

### ".env file not found"
- Make sure file is named `.env` (with dot)
- No .txt extension
- Located in `backend/` folder
- Not in `mobile/` or root folder

---

## 📋 Quick Setup Commands

```bash
# 1. Navigate to backend
cd C:\Users\fazil\Downloads\Delta_materials\talkopen\backend

# 2. Create .env (PowerShell)
@"
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/opentalk
JWT_SECRET=opentalk_secret_key_12345
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
PREMIUM_PRICE=299
"@ | Out-File -FilePath .env -Encoding utf8

# 3. Install dependencies
npm install

# 4. Start server
npm run dev
```

---

Now your backend is configured! 🎉


