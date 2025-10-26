# ⚡ Run Open Talk NOW - Fast Track Guide

**Want to run the app immediately? Follow these commands:**

---

## 🚀 Prerequisites Check

**Do you have these installed?**

Check by running:
```powershell
node --version    # Should show v14+ or higher
mongod --version  # Should show MongoDB info
```

**If NOT installed:**
- [Download Node.js](https://nodejs.org) - Get LTS version
- [Download MongoDB](https://www.mongodb.com/try/download/community)

---

## ⚡ 5-Minute Setup

### 1. Install Global Tools (One Time)

```powershell
npm install -g expo-cli eas-cli
```

---

### 2. Setup Backend (Terminal 1)

```powershell
# Navigate to backend folder
cd backend

# Install dependencies (first time only)
npm install

# Create .env file (first time only)
Copy-Item .env.example .env

# Start backend server
npm run dev
```

**Keep this terminal running!**

✅ **Success if you see:**
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

❌ **If MongoDB error:**
```powershell
# Open NEW terminal and run:
mongod
# Keep both terminals open
```

---

### 3. Setup Mobile (Terminal 2)

**Open a NEW PowerShell window:**

```powershell
# Navigate to mobile folder
cd mobile

# Install dependencies (first time only)
npm install

# Find your IP address
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
# Write it down: _______________

# Edit src/config/config.js
# Change this line:
#   const SERVER_IP = '10.0.2.2';
# To:
#   const SERVER_IP = 'YOUR_IP_HERE';  // Use 10.0.2.2 for emulator

# Start mobile app
npm start
```

**Keep this terminal running too!**

---

### 4. Run on Android

**Choose ONE option:**

**Option A: Android Emulator (Easiest)**
```powershell
# Make sure Android emulator is running first
# Then press 'a' in the metro bundler terminal
# OR run:
npm run android
```

**Option B: Physical Android Device**
```powershell
# 1. Install "Expo Go" from Play Store
# 2. Make sure phone is on same WiFi as computer
# 3. Scan the QR code shown in terminal
```

---

## ✅ Quick Test

### 1. Register Account

- Username: `testuser`
- Email: `test@test.com`
- Password: `test123`
- Gender: Male
- Age: 25

### 2. Check Screens

Navigate through all 5 tabs:
- ✅ Home (with streak calendar)
- ✅ Chat (empty initially)
- ✅ Feed (shows activities)
- ✅ Premium (payment info)
- ✅ Profile (your info)

### 3. Test Features

**Can you:**
- ✅ View your profile?
- ✅ See streak calendar on home?
- ✅ Click "Start Connecting"? (will search for match)
- ✅ Navigate all tabs without crashes?

**If YES to all → App is working! 🎉**

---

## 🐛 Common Issues

### ❌ "Cannot connect to server"

**Fix:**
1. Check backend terminal shows "Server running"
2. Verify IP in `mobile/src/config/config.js`
3. For emulator: Use `10.0.2.2`
4. For device: Use your PC's IP from `ipconfig`

### ❌ "MongoDB connection failed"

**Fix:**
```powershell
# Open new terminal:
mongod

# Or if MongoDB is a service:
Start-Service MongoDB
```

### ❌ "Module not found"

**Fix:**
```powershell
# In backend folder:
Remove-Item -Recurse node_modules
npm install

# In mobile folder:
Remove-Item -Recurse node_modules
npm install
```

### ❌ "Port 5000 already in use"

**Fix:**
```powershell
# Edit backend/.env
# Change: PORT=5000
# To:     PORT=5001

# Then update mobile/src/config/config.js:
# Change: ${SERVER_IP}:5000
# To:     ${SERVER_IP}:5001
```

---

## 📁 What You Need to Edit

**Only these 2 files (maybe):**

1. **backend/.env** (auto-created, usually works as-is)
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/opentalk
   JWT_SECRET=opentalk_super_secret_jwt_key_change_in_production_2024
   # ... rest is fine for testing
   ```

2. **mobile/src/config/config.js** (MUST update)
   ```javascript
   const SERVER_IP = '10.0.2.2'; // Change this!
   // Use: 10.0.2.2 for emulator
   // Use: 192.168.X.X for physical device (your IP from ipconfig)
   ```

---

## 🎯 Visual Confirmation

**Backend Terminal Should Show:**
```
🚀 Server running on port 5000
✅ MongoDB Connected
📱 Open Talk Backend is ready!

Socket.io initialized
All routes loaded successfully
```

**Mobile Terminal Should Show:**
```
Starting Metro Bundler...
Metro waiting on exp://192.168.X.X:8081

› Press a | open Android
› Press ? | show all commands

Logs for your project will appear below...
```

**App Should Show:**
- Login/Signup screen on first open
- After login: Home screen with streak calendar
- Bottom navigation with 5 tabs

---

## ⏱️ Time Estimates

| Task | First Time | Next Time |
|------|-----------|-----------|
| Install Node.js + MongoDB | 15 min | - |
| Install dependencies | 5-10 min | - |
| Configure files | 2 min | - |
| Start backend | 30 sec | 30 sec |
| Start mobile | 1 min | 1 min |
| **TOTAL** | **20-30 min** | **2 min** |

---

## 🎮 Testing With 2 Devices

**To test matching and chat:**

1. **Device 1:**
   - Create account: test1@test.com / test123
   - Click "Start Connecting"

2. **Device 2:**
   - Create account: test2@test.com / test123
   - Click "Start Connecting"

3. **Both should match!**
   - Call screen opens
   - Timer starts
   - After 2 min: can follow each other
   - After following: can chat

---

## 📚 Full Testing

**Want comprehensive testing?**

Read **TESTING_GUIDE.md** for:
- ✅ Complete feature checklist
- ✅ Integration testing
- ✅ Bug reporting template
- ✅ Performance testing

---

## 🚀 Ready for Play Store?

**App working perfectly?**

Read **PLAY_STORE_GUIDE.md** to:
1. Create app icons and screenshots
2. Build production APK/AAB
3. Setup Google Play Console
4. Submit for review

---

## 💡 Pro Tips

✅ **Keep both terminals open** - Backend + Mobile both need to run
✅ **Same WiFi** - Phone and computer must be on same network
✅ **Check logs** - Errors appear in terminal, read them!
✅ **Restart helps** - When in doubt, restart both servers
✅ **Test early** - Run app before making changes

---

## 🆘 Still Not Working?

1. **Read error messages** in terminal
2. **Check QUICK_START.md** for detailed setup
3. **Run automated setup:** `.\setup-local.ps1`
4. **Start fresh:**
   ```powershell
   # Close all terminals
   # Delete node_modules in both backend and mobile
   # Run npm install again
   ```

---

## ✅ Success Checklist

**Before moving forward:**

- [ ] Backend starts without errors
- [ ] Mobile app opens on device/emulator
- [ ] Can register a new account
- [ ] Can login with that account
- [ ] All 5 tabs are accessible
- [ ] No crashes when navigating

**All checked? You're ready! 🎉**

---

## 📞 Quick Reference

**Start Backend:**
```powershell
cd backend
npm run dev
```

**Start Mobile:**
```powershell
cd mobile
npm start
```

**Start MongoDB:**
```powershell
mongod
# OR
Start-Service MongoDB
```

**Get Your IP:**
```powershell
ipconfig
# Look for IPv4 Address
```

---

**That's it! Now go test your app! 🚀**

For detailed testing → Read **TESTING_GUIDE.md**
For Play Store → Read **PLAY_STORE_GUIDE.md**

