# 📱 OpenTalk - Expo Go Testing Guide

**Complete Step-by-Step Guide to Test Your App**

---

## 🎯 What You'll Test in Expo Go

✅ **Working Features:**
- User Registration & Login
- Home Screen & Navigation
- Weekly Streak Display
- Random Matching System
- Chat Messaging (Real-time)
- Following/Followers System
- Profile Management
- Activity Feed
- Premium Screen (UI only)
- Settings

❌ **Not Working in Expo Go:**
- Audio Calling (needs APK build with WebRTC)

---

## 📋 Prerequisites Checklist

### Required Software
- [ ] **Node.js** installed (v14+)
- [ ] **MongoDB** installed and running
- [ ] **Expo Go** app on your Android phone
- [ ] **WiFi** - Phone and PC on same network

### Required Files
- [ ] Backend `.env` file created
- [ ] Mobile `config.js` updated with your IP

---

## 🚀 Step-by-Step Setup & Testing

### **Step 1: Prepare Backend Environment**

#### 1.1 Create `.env` File
```bash
# Navigate to backend folder
cd C:\Users\fazil\Downloads\Delta_materials\talkopen\backend

# Create .env file (use notepad or code editor)
```

Add this content to `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/opentalk
JWT_SECRET=my_super_secret_jwt_key_12345
JWT_EXPIRE=30d

# Razorpay Keys (use test keys for now)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY
RAZORPAY_KEY_SECRET=YOUR_SECRET

PREMIUM_PRICE=299
NODE_ENV=development
```

#### 1.2 Start MongoDB
```bash
# Open new terminal/PowerShell window
mongod

# Keep this window open
```

**✅ Verify:** MongoDB should show "Waiting for connections on port 27017"

---

### **Step 2: Start Backend Server**

```bash
# Open new terminal/PowerShell window
cd C:\Users\fazil\Downloads\Delta_materials\talkopen\backend

# Install dependencies (first time only)
npm install

# Start the server
npm run dev
```

**✅ Verify:** You should see:
```
🚀 Server running on port 5000
📱 Open Talk Backend is ready!
```

**✅ Test Health Check:**
```bash
# In another terminal or browser
curl http://localhost:5000/health

# OR visit in browser:
# http://localhost:5000/health
```

Should return: `{"status":"OK","message":"Open Talk Server is running"}`

**Keep this terminal open!**

---

### **Step 3: Configure Mobile App**

#### 3.1 Find Your IP Address
```bash
# In new terminal/PowerShell
ipconfig
```

Look for **"IPv4 Address"** under your WiFi adapter:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . : 192.168.1.XXX  ← This one!
```

#### 3.2 Update Mobile Config
```bash
# Open file: mobile/src/config/config.js
```

Update the IP:
```javascript
const SERVER_IP = '192.168.1.XXX'; // ← Your IP from Step 3.1
```

---

### **Step 4: Start Mobile App (Expo)**

```bash
# Open new terminal/PowerShell
cd C:\Users\fazil\Downloads\Delta_materials\talkopen\mobile

# Install dependencies (first time only)
npm install

# Start Expo with tunnel mode
npx expo start --tunnel --clear
```

**Wait for loading...** (may take 1-2 minutes)

**✅ Verify:** You should see:
```
Metro waiting on exp://192.168.1.XXX:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

---

### **Step 5: Connect Your Phone**

#### 5.1 Ensure Same WiFi
- Your PC and phone must be on the **same WiFi network**
- Turn off mobile data on phone
- Check WiFi name on both devices

#### 5.2 Open Expo Go App
1. Open **Expo Go** app on your Android phone
2. If prompted for permissions, **allow all**

#### 5.3 Scan QR Code
- In Expo Go, tap **"Scan QR code"**
- Scan the QR code from your terminal
- **Wait 30-60 seconds** for the app to load

**✅ Verify:** You should see the OpenTalk login screen!

---

## 🧪 Testing Checklist

### **Test 1: User Registration**

1. **On Login Screen:**
   - Tap **"Create Account"**
   
2. **Fill Registration Form:**
   - Username: `testuser1`
   - Email: `test1@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Age: `25`
   - Gender: Select **Male** or **Female**

3. **Submit:**
   - Tap **"Sign Up"**
   - Should see "Please wait..." then automatically login

**✅ Expected:** You're now on the Home Screen!

**❌ If "Registration Failed":**
- Check backend terminal for errors
- Verify MongoDB is running
- Check `config.js` has correct IP
- Try: `http://YOUR_IP:5000/health` in phone browser

---

### **Test 2: Home Screen & Navigation**

**✅ Check Home Screen Elements:**
- [ ] "Open Talk" header
- [ ] Weekly streak calendar (7 days)
- [ ] Connection status
- [ ] Filter buttons (Free, Male, Female)
- [ ] "Start Connecting" button (green)
- [ ] Bottom navigation (Home, Chat, Premium, Feed, Profile)

**✅ Test Bottom Navigation:**
- Tap each tab and verify screens load:
  - [ ] Home (with streak)
  - [ ] Chat (empty list for now)
  - [ ] Premium (subscription info)
  - [ ] Feed (empty for now)
  - [ ] Profile (your stats)

**Expected:** All screens load without errors

---

### **Test 3: Profile Screen**

1. **Go to Profile Tab**
2. **Check Display:**
   - [ ] Username displayed
   - [ ] Stats: 0 followers, 0 following
   - [ ] Current streak: 0 days
   - [ ] "Edit Profile" button
   - [ ] "Settings" button
   - [ ] "Logout" button

3. **Test Edit Profile:**
   - Tap **"Edit Profile"**
   - Add bio: `Hello, I'm testing OpenTalk!`
   - Tap **"Save Changes"**
   - Should return to profile with success message

**✅ Expected:** Profile updated successfully

---

### **Test 4: Two-User Chat Testing**

#### 4.1 Create Second User
**Option A: Use Second Phone**
- Install Expo Go on second phone
- Scan same QR code
- Register as `testuser2` with `test2@example.com`

**Option B: Use Browser (Advanced)**
- Not recommended for Expo Go testing

#### 4.2 Test Matching (Chat Only - No Audio)
1. **On User 1's Phone:**
   - Go to Home tab
   - Tap **"Start Connecting"**
   - Should see "Searching for someone..."

2. **On User 2's Phone:**
   - Go to Home tab
   - Tap **"Start Connecting"**

3. **Match Found:**
   - Both phones should show **"Match Found!"**
   - Navigate to Call Screen
   - **Note:** Audio won't work (WebRTC disabled for Expo Go)
   - Timer should start counting
   - Mute/video buttons should be visible

4. **Wait 2 Minutes:**
   - After 2 minutes, **"Follow"** button appears
   - Tap **"Follow"** on both phones

5. **End Call:**
   - Tap red **"End Call"** button
   - Should return to Home Screen

**✅ Expected:** Call screen works, timer runs, follow button appears

---

### **Test 5: Chat Messaging**

#### Prerequisites: Must have followed each other (Test 4)

1. **On User 1's Phone:**
   - Go to **Chat** tab
   - Should see User 2 in conversation list
   - Tap on User 2's chat

2. **Send Messages:**
   - Type: `Hello! Testing chat`
   - Tap Send
   - Message appears in chat

3. **On User 2's Phone:**
   - Go to **Chat** tab
   - Should see unread badge (1)
   - Open chat with User 1
   - See message: `Hello! Testing chat`
   - Reply: `Hi! Chat works!`

4. **On User 1's Phone:**
   - Should see reply appear in real-time

**✅ Expected:** Real-time chat works both ways!

---

### **Test 6: Following/Followers List**

1. **Go to Profile Tab**
2. **Tap "Following" or "Followers"**
3. **Should See:**
   - User you followed
   - Online status indicator (green dot)
   - **"Chat"** button
   - **"Call"** button (disabled in Expo Go)

4. **Test Chat from Profile:**
   - Tap **"Chat"** button
   - Should navigate to chat with that user

**✅ Expected:** Following list shows correctly with chat access

---

### **Test 7: Streak System**

1. **After First Call (Test 4):**
   - Go to Home tab
   - Check streak calendar
   - Today should show progress (if call was 5+ min)

2. **Check Profile:**
   - Go to Profile tab
   - Should show:
     - Current Streak: 1 day (if call was 5+ min)
     - Longest Streak: 1 day

**✅ Expected:** Streak updates after 5+ minute call

---

### **Test 8: Activity Feed**

1. **Go to Feed Tab**
2. **Should See Activities:**
   - "User X joined Open Talk" (registration)
   - "User X followed User Y" (if followed)
   - "User X completed a call" (after call)

3. **Test Pull to Refresh:**
   - Pull down on feed
   - Should refresh with loading indicator

**✅ Expected:** Feed shows activities from followed users

---

### **Test 9: Premium Screen (UI Only)**

1. **Go to Premium Tab**
2. **Check Elements:**
   - [ ] Premium features list
   - [ ] Pricing (₹299)
   - [ ] "Subscribe Now" button
   - [ ] Feature icons and descriptions

3. **Tap Subscribe:**
   - May show Razorpay (if key configured)
   - Or show error (expected if using test keys)

**Note:** Payment testing requires real Razorpay account

**✅ Expected:** Premium screen displays correctly

---

### **Test 10: Settings**

1. **Go to Profile → Settings**
2. **Check Options:**
   - [ ] Privacy settings
   - [ ] Notification settings
   - [ ] Account settings
   - [ ] About

3. **Test Toggle:**
   - Toggle a setting
   - Should save and show success

**✅ Expected:** Settings screen works

---

### **Test 11: Logout & Login**

1. **Logout:**
   - Go to Profile tab
   - Tap **"Logout"**
   - Should return to login screen

2. **Login Again:**
   - Email: `test1@example.com`
   - Password: `password123`
   - Tap **"Login"**
   - Should navigate to Home screen

**✅ Expected:** Session persists, login works

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "Cannot connect to Metro"
**Solution:**
```bash
# Kill Expo and restart
Ctrl+C (in mobile terminal)
npx expo start --tunnel --clear
```

### Issue 2: "Registration Failed"
**Checks:**
1. Is MongoDB running? (`mongod`)
2. Is backend running? (`npm run dev`)
3. Is IP correct in `config.js`?
4. Test health endpoint: `http://YOUR_IP:5000/health`

**Debug:**
- Check backend terminal for errors
- Look for MongoDB connection errors
- Verify `.env` file exists

### Issue 3: "Something went wrong" on Phone
**Solution:**
1. Clear Expo cache:
   ```bash
   npx expo start --tunnel --clear
   ```
2. Restart Expo Go app
3. Rescan QR code

### Issue 4: "Socket not connected"
**Checks:**
1. Backend running?
2. `SOCKET_URL` in `config.js` correct?
3. Firewall blocking port 5000?

**Solution:**
- Restart both backend and Expo
- Check Windows Firewall settings
- Try tunnel mode: `npx expo start --tunnel`

### Issue 5: QR Code Scan Not Opening App
**Solutions:**
1. **Press 's' in terminal** to switch to Expo Go mode
2. Uninstall any OpenTalk APK on phone
3. Reinstall Expo Go app
4. Make sure Expo Go is updated

### Issue 6: "Failed to download remote update"
**Solutions:**
1. Press **'s'** in Expo terminal (switches to Expo Go mode)
2. Clear cache: `npx expo start --clear`
3. Check WiFi connection
4. Try tunnel mode: `npx expo start --tunnel`

### Issue 7: Chat Messages Not Appearing
**Checks:**
1. Socket.io connected? (check green indicator)
2. Both users followed each other?
3. Backend terminal showing errors?

**Solution:**
- Check backend logs
- Restart both phones' apps
- Check mutual follow status

### Issue 8: App Freezes/Crashes
**Solution:**
1. Shake phone → "Reload"
2. Or tap 'r' in terminal to reload
3. Check terminal for JavaScript errors

---

## 📊 Testing Report Template

Use this to track your testing:

```
=== OPENTALK TESTING REPORT ===
Date: ___________
Tester: __________

SETUP:
[ ] MongoDB running
[ ] Backend running
[ ] Expo running
[ ] Phone connected

FEATURES TESTED:
[ ] Registration: ___________
[ ] Login: ___________
[ ] Home Screen: ___________
[ ] Profile: ___________
[ ] Matching: ___________
[ ] Chat: ___________
[ ] Following: ___________
[ ] Feed: ___________
[ ] Streak: ___________
[ ] Premium UI: ___________
[ ] Settings: ___________
[ ] Logout: ___________

BUGS FOUND:
1. ________________________
2. ________________________
3. ________________________

NOTES:
_________________________
_________________________
```

---

## 🎯 Success Criteria

### ✅ Testing is Successful if:
- [x] User can register and login
- [x] Navigation between tabs works
- [x] Two users can match
- [x] Chat messages work in real-time
- [x] Follow system works after 2 min
- [x] Streak displays correctly
- [x] Feed shows activities
- [x] Profile displays correctly
- [x] Settings can be changed
- [x] Logout and re-login works

### ⚠️ Known Limitations (Expected):
- Audio calling doesn't work (needs APK)
- Video calling not implemented
- Razorpay payment may not work (needs real keys)

---

## 📱 Next Phase: APK Build

Once all Expo Go tests pass, you're ready for:
1. Re-enable WebRTC in code
2. Build APK with EAS Build
3. Test audio calling on real devices

**Command to build APK:**
```bash
cd mobile
eas build --profile preview --platform android
```

---

## 🎉 Testing Complete!

If all tests above pass, your app is working perfectly! 

**Ready for audio calling?** Ask me to:
1. Re-enable WebRTC
2. Build production APK
3. Test full audio calling

---

*Good luck with testing! 🚀*



