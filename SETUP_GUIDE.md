# Open Talk - Quick Setup Guide

Follow these steps to get Open Talk running on your system.

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js v14+ installed ([Download](https://nodejs.org))
- [ ] MongoDB installed and running ([Download](https://www.mongodb.com/try/download/community))
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Android Studio OR an Android device with Expo Go app
- [ ] Razorpay account for payment integration ([Sign up](https://razorpay.com))

## 🚀 Step-by-Step Setup

### Step 1: Backend Setup (10 minutes)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   
   Create a file named `.env` in the `backend` directory with this content:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/opentalk
   JWT_SECRET=my_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=30d

   # Get these from https://dashboard.razorpay.com/app/keys
   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
   RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET

   PREMIUM_PRICE=299
   NODE_ENV=development
   ```

4. **Start MongoDB:**
   ```bash
   # Windows (run in a separate terminal)
   mongod
   
   # Mac/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   ✅ You should see:
   ```
   🚀 Server running on port 5000
   ✅ MongoDB Connected
   📱 Open Talk Backend is ready!
   ```

### Step 2: Get Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your Wi-Fi adapter (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr
```
Look for your local network IP (e.g., 192.168.1.100)

**Write it down:** _________________________

### Step 3: Mobile App Setup (10 minutes)

1. **Open a new terminal and navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the app:**
   
   Open `mobile/src/config/config.js` and update:
   ```javascript
   // Replace 192.168.1.100 with YOUR IP from Step 2
   export const API_URL = 'http://192.168.1.100:5000/api';
   export const SOCKET_URL = 'http://192.168.1.100:5000';
   
   // Replace with your Razorpay key
   export const RAZORPAY_KEY = 'rzp_test_YOUR_KEY_ID';
   ```

4. **Start the Expo development server:**
   ```bash
   npm start
   ```

5. **Run on Android:**
   
   **Option A: Physical Device (Recommended)**
   - Install "Expo Go" from Google Play Store
   - Scan the QR code shown in terminal
   - Make sure your phone is on the same Wi-Fi as your computer
   
   **Option B: Android Emulator**
   ```bash
   npm run android
   ```

### Step 4: Razorpay Setup (5 minutes)

1. **Sign up for Razorpay:**
   - Go to https://razorpay.com
   - Click "Sign Up" and create an account
   - Complete verification

2. **Get API Keys:**
   - Go to Dashboard → Settings → API Keys
   - Click "Generate Test Key"
   - Copy both "Key Id" and "Key Secret"

3. **Update configuration:**
   - Add to `backend/.env`:
     ```
     RAZORPAY_KEY_ID=rzp_test_xxxxx
     RAZORPAY_KEY_SECRET=xxxxx
     ```
   - Add to `mobile/src/config/config.js`:
     ```javascript
     export const RAZORPAY_KEY = 'rzp_test_xxxxx';
     ```

4. **Restart both servers** after updating

## ✅ Testing the App

### Test 1: Authentication
1. Open the app
2. Click "Sign Up"
3. Fill in details and create account
4. You should be logged in

### Test 2: Profile & Streak
1. Go to Profile tab
2. Check your streak (should be 0)
3. Click "Edit Profile" and update

### Test 3: Matching
1. Go to Home tab
2. Click "Start Connecting"
3. App should start searching
4. Open second device/account to test matching

### Test 4: Premium (Optional)
1. Go to Premium tab
2. Click "Subscribe Now"
3. Use test card: 4111 1111 1111 1111
4. CVV: any 3 digits, Expiry: any future date

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solution:**
- Check if backend is running (`npm run dev` in backend folder)
- Verify IP address in config.js matches your computer's IP
- Make sure phone and computer are on same Wi-Fi
- Check firewall isn't blocking port 5000

### Issue: "MongoDB connection error"
**Solution:**
- Make sure MongoDB is running
- Try: `mongod` in a new terminal
- Check MongoDB service is started

### Issue: "Socket not connecting"
**Solution:**
- Verify SOCKET_URL in config.js
- Check backend logs for errors
- Restart both backend and mobile app

### Issue: "Razorpay not opening"
**Solution:**
- Use physical device (doesn't work well on emulator)
- Verify RAZORPAY_KEY is correct
- Check internet connection

### Issue: "Expo Go won't connect"
**Solution:**
- Make sure using the same Wi-Fi network
- Try closing and reopening Expo Go
- Clear Expo cache: `expo start -c`

## 📱 Testing with Two Devices

To test matching and calls, you need two instances:

**Option 1: Two physical devices**
- Install Expo Go on both
- Scan QR code on both
- Create different accounts

**Option 2: Device + Emulator**
- Run on physical device via Expo Go
- Run on Android emulator via `npm run android`
- Create different accounts

**Option 3: Two emulators**
- Start two Android emulators
- Run app on both
- Create different accounts

## 🎯 Quick Feature Test Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Profile displays correctly
- [ ] Streak shows 0 initially
- [ ] Can search for match
- [ ] Can cancel search
- [ ] Can view Premium features
- [ ] Can navigate all tabs
- [ ] Chat screen shows empty state
- [ ] Feed screen shows empty state
- [ ] Settings can be updated
- [ ] Can logout

## 📚 Next Steps

1. **Customize the app:**
   - Update app name in `mobile/app.json`
   - Change colors in screen styles
   - Add your own logo/assets

2. **Add features:**
   - Implement actual WebRTC for video calls
   - Add push notifications
   - Add image upload for profiles

3. **Deploy:**
   - Deploy backend to Heroku/AWS/DigitalOcean
   - Build APK: `expo build:android`
   - Publish to Play Store

## 💡 Tips

- Keep both terminals open (backend and mobile)
- Check terminal logs for errors
- Use `console.log()` for debugging
- Restart servers after config changes
- Use Razorpay test mode for development
- Clear app data if facing cache issues

## 🆘 Need Help?

1. Check the main README.md for detailed documentation
2. Check backend/README.md for API documentation
3. Check mobile/README.md for mobile-specific docs
4. Review error messages in terminal
5. Check MongoDB is running: `mongo` command should connect

## 🎉 Success!

If you can:
- ✅ Register and login
- ✅ See your profile with streak
- ✅ Start searching for matches
- ✅ Navigate all screens

**Congratulations! Open Talk is running successfully! 🚀**

---

**Estimated Total Setup Time:** 25-30 minutes

**Required Disk Space:** ~500MB (including dependencies)

**Default Credentials for Testing:**
- Email: test@test.com
- Password: test123
- (Create these via app registration)

