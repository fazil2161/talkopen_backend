# 🚀 Open Talk - Quick Start Guide

This guide will help you run Open Talk locally and prepare it for Google Play Store publication.

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ **Node.js v14+** ([Download](https://nodejs.org))
- ✅ **MongoDB** ([Download](https://www.mongodb.com/try/download/community))
- ✅ **Git** (for version control)
- ✅ **Android Studio** OR **Physical Android Device** with USB debugging enabled
- ✅ **Expo CLI** (we'll install this)

---

## 🎯 Part 1: Local Setup (15 minutes)

### Step 1: Install Expo CLI

```powershell
npm install -g expo-cli eas-cli
```

### Step 2: Setup Backend

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy .env.example to .env
Copy-Item .env.example .env

# Edit .env file and update if needed (default values work for local testing)
# You can skip Razorpay keys for now - they're only needed for premium features
```

### Step 3: Start MongoDB

**Option A: MongoDB Windows Service**
```powershell
# If installed as service, check if running:
Get-Service MongoDB
# Start if not running:
Start-Service MongoDB
```

**Option B: MongoDB Standalone**
```powershell
# Open a new PowerShell/CMD window and run:
mongod
# Keep this window open
```

### Step 4: Start Backend Server

```powershell
# Make sure you're in the backend folder
npm run dev
```

✅ You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected
📱 Open Talk Backend is ready!
```

Keep this terminal open!

### Step 5: Get Your Computer's IP Address

**Open a NEW PowerShell window:**

```powershell
ipconfig
```

Look for **IPv4 Address** under your Wi-Fi or Ethernet adapter.
Example: `192.168.1.100` or `192.168.0.105`

**Write it down:** _______________________

### Step 6: Configure Mobile App

```powershell
# In a new terminal, navigate to mobile folder
cd mobile

# Install dependencies
npm install

# Edit src/config/config.js
# Update the SERVER_IP line with your IP address from Step 5
```

Open `mobile/src/config/config.js` and change:
```javascript
const SERVER_IP = '10.0.2.2'; // Change this to YOUR IP
```

To:
```javascript
const SERVER_IP = '192.168.1.100'; // Use your actual IP from Step 5
```

### Step 7: Start Mobile App

**For Android Emulator:**
```powershell
# Make sure Android emulator is running first
npm run android
```

**For Physical Android Device:**
```powershell
# Install Expo Go from Play Store first
npm start

# Scan the QR code with Expo Go app
# Make sure your phone is on the same Wi-Fi as your computer
```

---

## 🧪 Testing the App

### Test 1: Create Account
1. Open the app
2. Click "Sign Up"
3. Fill in details:
   - Username: testuser1
   - Email: test1@test.com
   - Password: test123
   - Gender: Male/Female
   - Age: 25
4. Click Register

### Test 2: Check Profile
1. Go to "Profile" tab at bottom
2. You should see your username and streak info
3. Try editing profile

### Test 3: Test Matching (Need 2 devices/accounts)
1. Create second account on another device/emulator
2. On both devices, go to "Home" tab
3. Click "Start Connecting" on both
4. They should match!

### Test 4: Check Other Features
- ✅ Chat tab (empty initially)
- ✅ Feed tab (shows activities)
- ✅ Premium tab (payment - requires Razorpay setup)
- ✅ Settings in Profile

---

## 💳 Optional: Setup Razorpay (for Premium Features)

If you want to test payment features:

1. **Sign up at [Razorpay](https://razorpay.com)**
2. **Go to Settings → API Keys → Generate Test Key**
3. **Update backend/.env:**
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```
4. **Update mobile/src/config/config.js:**
   ```javascript
   export const RAZORPAY_KEY = 'rzp_test_xxxxx';
   ```
5. **Restart both servers**

---

## 🐛 Common Issues

### ❌ "Cannot connect to server"
**Solutions:**
- Check backend is running (`npm run dev`)
- Verify IP address in `config.js` matches your computer's IP
- Make sure phone and computer are on same Wi-Fi
- Try disabling firewall temporarily
- On Android Emulator, use `10.0.2.2` as SERVER_IP

### ❌ "MongoDB connection failed"
**Solutions:**
- Check if MongoDB is running
- Try: `mongod` in a new terminal
- Check if MongoDB service is started: `Get-Service MongoDB`

### ❌ "Socket not connecting"
**Solutions:**
- Verify SOCKET_URL in config.js
- Restart both backend and mobile app
- Check backend logs for errors

### ❌ "Module not found"
**Solutions:**
- Delete node_modules: `Remove-Item -Recurse node_modules`
- Reinstall: `npm install`
- Clear cache: `npm cache clean --force`

---

## 🎯 Part 2: Preparing for Play Store

Once your app works locally, follow the **PLAY_STORE_GUIDE.md** for:
- Creating app icons and splash screen
- Building production APK/AAB
- Signing your app
- Creating Play Store listing
- Publishing your app

---

## 📱 Device Setup Options

### Option 1: Physical Android Device (Recommended)
1. Install Expo Go from Play Store
2. Enable Developer Options on phone
3. Connect to same Wi-Fi as computer
4. Scan QR code from `npm start`

### Option 2: Android Emulator
1. Install Android Studio
2. Create AVD (Android Virtual Device)
3. Start emulator
4. Run `npm run android`

### Option 3: Two Devices for Testing
- Use two physical devices OR
- Use one physical + one emulator OR
- Use two emulators (requires powerful PC)

---

## 📊 Project Structure

```
talkopen/
├── backend/              # Node.js server
│   ├── .env             # Environment variables (create from .env.example)
│   └── npm run dev      # Start backend
│
└── mobile/              # React Native app
    ├── src/config/config.js  # Update SERVER_IP here
    └── npm start        # Start mobile app
```

---

## ✅ Success Checklist

Before moving to Play Store deployment:

- [ ] Backend starts without errors
- [ ] MongoDB is connected
- [ ] Mobile app launches successfully
- [ ] Can register and login
- [ ] Profile displays correctly
- [ ] Can navigate all 5 tabs
- [ ] Two users can match (if tested with 2 devices)
- [ ] Socket connection works
- [ ] No critical errors in console

---

## 🆘 Need Help?

1. Check terminal logs for error messages
2. Review SETUP_GUIDE.md for detailed instructions
3. Check backend/README.md for API documentation
4. Make sure all prerequisites are installed
5. Try restarting both backend and mobile app

---

## 🎉 Next Steps

Once everything works locally:

1. **Create app assets** (icons, splash screen)
2. **Setup EAS Build** for Play Store
3. **Build production APK/AAB**
4. **Create Play Store listing**
5. **Submit for review**

See **PLAY_STORE_GUIDE.md** for detailed instructions!

---

**Estimated Setup Time:** 15-20 minutes (first time)

**Default Test Credentials:**
- Create via app registration
- Example: test@test.com / test123

**Support:** Check the README.md files for more details.

Good luck! 🚀



