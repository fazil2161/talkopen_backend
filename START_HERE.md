# 🎯 START HERE - Open Talk Setup

**Welcome to Open Talk!** This guide will get you running in 15 minutes.

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Install Prerequisites

**You need:**
- ✅ [Node.js](https://nodejs.org) (Download and install)
- ✅ [MongoDB](https://www.mongodb.com/try/download/community) (Download and install)
- ✅ Expo CLI (Install after Node.js)

**Install Expo CLI:**
```powershell
npm install -g expo-cli eas-cli
```

---

### Step 2: Run Automated Setup

**Open PowerShell in the project root folder and run:**

```powershell
.\setup-local.ps1
```

This script will:
- ✅ Check your Node.js installation
- ✅ Start MongoDB if needed
- ✅ Install all backend dependencies
- ✅ Install all mobile dependencies  
- ✅ Create .env configuration file
- ✅ Show your computer's IP address

**Takes 5-10 minutes depending on your internet speed.**

---

### Step 3: Update Configuration

**Edit `mobile/src/config/config.js`:**

Find this line:
```javascript
const SERVER_IP = '10.0.2.2'; // Change this to your IP address
```

**Change to:**
- `'10.0.2.2'` - If using Android Emulator
- `'192.168.X.X'` - If using physical device (use IP from Step 2)

---

## ▶️ Running the App

### Terminal 1: Backend Server

```powershell
cd backend
npm run dev
```

**You should see:**
```
🚀 Server running on port 5000
✅ MongoDB Connected
📱 Open Talk Backend is ready!
```

Keep this terminal open!

---

### Terminal 2: Mobile App

**Open a NEW PowerShell window:**

```powershell
cd mobile
npm start
```

**Then:**
- **Android Emulator:** Press `a` or run `npm run android`
- **Physical Device:** Scan QR code with Expo Go app

---

## 📱 Testing the App

1. **Register Account:**
   - Open app → Sign Up
   - Username: testuser1
   - Email: test1@test.com
   - Password: test123
   - Choose gender and age

2. **Explore Features:**
   - View Profile tab
   - Check Home screen with streak
   - Try Chat tab
   - See Premium features
   - Check Settings

3. **Test Matching (Need 2 devices):**
   - Create 2 accounts on different devices
   - Both click "Start Connecting"
   - They should match!

---

## 🐛 Troubleshooting

### "Cannot connect to server"
- ✅ Check backend is running (`npm run dev`)
- ✅ Verify IP in `config.js` matches your computer
- ✅ Phone and computer on same Wi-Fi
- ✅ Use `10.0.2.2` for Android Emulator

### "MongoDB connection failed"
- ✅ Run `mongod` in a new terminal
- ✅ Or start MongoDB service: `Start-Service MongoDB`

### "Module not found"
- ✅ Delete `node_modules` folder
- ✅ Run `npm install` again

---

## 📚 Next Steps

### ✅ Working Locally?

**Ready for Play Store?**

👉 Read **PLAY_STORE_GUIDE.md** for:
- Creating app icons and screenshots
- Building APK/AAB files
- Publishing to Google Play Store
- Marketing your app

### 💳 Want to Enable Payments?

1. Sign up at [Razorpay.com](https://razorpay.com)
2. Get test API keys
3. Update `backend/.env` and `mobile/src/config/config.js`
4. Restart both servers

### 🎨 Need App Assets?

Read **mobile/ASSETS_README.md** for:
- Creating app icon (1024x1024)
- Making splash screen
- Taking screenshots
- Design resources

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **START_HERE.md** | 👈 You are here - Quick start |
| **QUICK_START.md** | Detailed setup instructions |
| **PLAY_STORE_GUIDE.md** | Complete Play Store publishing guide |
| **README.md** | Project overview and features |
| **SETUP_GUIDE.md** | Step-by-step setup (original) |
| **PROJECT_STRUCTURE.md** | Code structure documentation |
| **mobile/ASSETS_README.md** | How to create app icons |
| **backend/.env.example** | Environment variables template |

---

## 🎯 File Structure

```
talkopen/
│
├── backend/                 # Node.js server
│   ├── .env                # Config (created by setup script)
│   ├── server.js           # Main server file
│   └── npm run dev         # Start command
│
├── mobile/                  # React Native app
│   ├── src/config/config.js  # Update SERVER_IP here!
│   ├── assets/             # Icons and images (create these)
│   └── npm start           # Start command
│
├── setup-local.ps1         # 🚀 Automated setup script
├── START_HERE.md           # 👈 This file
├── QUICK_START.md          # Detailed instructions
└── PLAY_STORE_GUIDE.md    # Publishing guide
```

---

## ✅ Pre-Flight Checklist

Before running the app:

- [ ] Node.js installed
- [ ] MongoDB installed and running
- [ ] Expo CLI installed
- [ ] Ran `.\setup-local.ps1`
- [ ] Updated `mobile/src/config/config.js` with correct IP
- [ ] Backend running in Terminal 1
- [ ] Mobile app running in Terminal 2
- [ ] Android device/emulator ready

---

## 🆘 Still Stuck?

1. **Read error messages carefully** - they usually tell you what's wrong
2. **Check QUICK_START.md** - More detailed troubleshooting
3. **Restart everything:**
   - Close all terminals
   - Stop MongoDB
   - Start fresh from Step 2

---

## 💡 Pro Tips

- **Keep terminals open:** You need both backend and mobile running
- **Same Wi-Fi:** Phone and computer must be on same network
- **Check firewall:** Windows Firewall might block connections
- **Use emulator first:** Easier than physical device for testing
- **Check logs:** Terminal shows error messages

---

## 🎉 Success!

**If you see:**
- ✅ Backend: "Server running on port 5000"
- ✅ Mobile: App opens on device/emulator
- ✅ Can register and login

**You're ready to go! 🚀**

Next step: Test all features, then read PLAY_STORE_GUIDE.md to publish!

---

## 📞 Project Info

- **Type:** React Native + Node.js Social App
- **Purpose:** Connect strangers for video/audio calls
- **Features:** Calls, Chat, Streaks, Premium, Feed
- **Target:** Android (Google Play Store)
- **Tech:** Express, MongoDB, Socket.io, Expo, Razorpay

---

**Need help? Check the other README files for detailed information!**

Good luck! 🎯



