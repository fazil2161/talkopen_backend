# 🧪 Open Talk - Complete Testing Guide

This guide will help you verify that your entire app is working correctly before deployment.

---

## 🎯 Quick Test (5 Minutes)

### Step 1: Start Backend

```powershell
# Open PowerShell/Terminal in project folder
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected
📱 Open Talk Backend is ready!
```

✅ **Success:** If you see this, backend is working!
❌ **Failed:** See troubleshooting section below.

---

### Step 2: Test Backend API

**Open browser and visit:**
```
http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Open Talk Server is running"
}
```

✅ **Success:** Backend API is responding!

---

### Step 3: Start Mobile App

**Open a NEW PowerShell window:**

```powershell
cd mobile
npm start
```

**Expected Output:**
```
Starting Metro Bundler...
› Metro waiting on exp://...
› Scan the QR code above with Expo Go...
```

✅ **Success:** Mobile development server running!

---

### Step 4: Run on Device/Emulator

**Option A: Android Emulator**
```powershell
# Make sure emulator is running first
npm run android
```

**Option B: Physical Device**
- Install "Expo Go" from Play Store
- Scan QR code from Terminal
- App should open!

✅ **Success:** App opens without crashing!

---

## 🔍 Complete Feature Testing Checklist

### ✅ Phase 1: Authentication (5 mins)

**Test User Registration:**

1. Open the app
2. Click "Sign Up" button
3. Fill in details:
   - Username: `testuser1`
   - Email: `test1@test.com`
   - Password: `test123`
   - Gender: Male
   - Age: 25
4. Click "Register"

**Expected:**
- ✅ Registration succeeds
- ✅ Automatically logged in
- ✅ Redirected to Home screen
- ✅ Token saved (stays logged in on restart)

**Test User Login:**

1. Click "Logout" in Profile → Settings
2. Click "Login"
3. Enter:
   - Email: `test1@test.com`
   - Password: `test123`
4. Click "Login"

**Expected:**
- ✅ Login succeeds
- ✅ Redirected to Home screen
- ✅ User data loads correctly

---

### ✅ Phase 2: Home Screen (5 mins)

**Test Home Screen Display:**

1. Go to "Home" tab
2. Check elements are visible:
   - ✅ Welcome message with username
   - ✅ Weekly streak calendar (7 days)
   - ✅ Current streak count (should be 0)
   - ✅ Filter buttons (Free/Male/Female)
   - ✅ "Start Connecting" button
   - ✅ Connection status indicator

**Test Streak Display:**

- ✅ Shows current week dates
- ✅ Today's date is highlighted
- ✅ Days show empty initially (no green dots)
- ✅ Current streak: 0 days
- ✅ Longest streak: 0 days

---

### ✅ Phase 3: Profile Screen (5 mins)

**Test Profile Display:**

1. Go to "Profile" tab
2. Check elements:
   - ✅ Username displayed
   - ✅ Email displayed
   - ✅ Followers count: 0
   - ✅ Following count: 0
   - ✅ Current streak: 0
   - ✅ Longest streak: 0
   - ✅ "Edit Profile" button
   - ✅ "Settings" button
   - ✅ "Following" section (empty)

**Test Edit Profile:**

1. Click "Edit Profile"
2. Change username to `testuser1_updated`
3. Change age to 26
4. Click "Save Changes"

**Expected:**
- ✅ Success message shown
- ✅ Profile updates immediately
- ✅ New data persists after app restart

---

### ✅ Phase 4: Settings (3 mins)

**Test Settings Screen:**

1. Go to Profile → Settings
2. Check available options:
   - ✅ Block list
   - ✅ Privacy settings toggles
   - ✅ Notification preferences
   - ✅ "Logout" button

**Test Logout:**

1. Click "Logout"
2. Confirm logout

**Expected:**
- ✅ Redirected to Login screen
- ✅ Can login again with same credentials

---

### ✅ Phase 5: Chat Screen (2 mins)

**Test Chat Screen (Empty State):**

1. Go to "Chat" tab
2. Check display:
   - ✅ Shows empty state message
   - ✅ "You have no conversations yet"
   - ✅ Helpful text about following users

**Expected:**
- ✅ No crashes
- ✅ Clean empty state UI

---

### ✅ Phase 6: Feed Screen (2 mins)

**Test Activity Feed:**

1. Go to "Feed" tab
2. Check display:
   - ✅ Shows empty state or
   - ✅ Shows your registration activity

**Expected:**
- ✅ Loads without error
- ✅ Pull-to-refresh works

---

### ✅ Phase 7: Premium Screen (3 mins)

**Test Premium Screen:**

1. Go to "Premium" tab
2. Check content:
   - ✅ Premium features list displayed
   - ✅ Price shown (₹299)
   - ✅ "Subscribe Now" button
   - ✅ Current status: "Not Subscribed"

**Test Payment (With Razorpay):**

*Note: Only if you've set up Razorpay keys*

1. Click "Subscribe Now"
2. Razorpay checkout should open
3. Use test card: 4111 1111 1111 1111

**Expected:**
- ✅ Payment modal opens
- ✅ Can complete test payment
- ✅ Premium status updates

---

### ✅ Phase 8: Matching System (10 mins)

**Requirements:** 2 devices or accounts

**Setup:**

1. Create second account:
   - Username: `testuser2`
   - Email: `test2@test.com`
   - Password: `test123`

**Test Matching:**

1. On **Device 1** (testuser1):
   - Go to Home
   - Click "Start Connecting"
   - Should show "Searching for someone..."

2. On **Device 2** (testuser2):
   - Go to Home
   - Click "Start Connecting"
   - Should show "Searching for someone..."

**Expected:**
- ✅ Both users match within 1-2 seconds
- ✅ "Match Found!" notification
- ✅ Redirect to Call Screen
- ✅ Call timer starts (0:00)
- ✅ Both users see each other's info

**Test Call Controls:**

- ✅ Mute button visible
- ✅ Video toggle visible
- ✅ End call button works
- ✅ Timer increments

**Test Follow Button:**

1. Wait for 2+ minutes (timer shows 2:00)
2. "Follow" button should appear
3. Click "Follow"

**Expected:**
- ✅ Follow button appears after 2 min
- ✅ Follow success message
- ✅ Can follow user

**Test End Call:**

1. Click "End Call"
2. Call ends for both users

**Expected:**
- ✅ Call ends gracefully
- ✅ Returns to Home screen
- ✅ Streak updates if 5+ min call
- ✅ Call duration saved

---

### ✅ Phase 9: Messaging (5 mins)

**Requirements:** 2 users who follow each other

**Test Sending Message:**

1. Go to Chat tab on **Device 1**
2. Should see testuser2 in conversations
3. Click on testuser2
4. Type message: "Hello from testuser1!"
5. Click Send

**Expected on Device 1:**
- ✅ Message appears in chat
- ✅ Sent timestamp shown
- ✅ Message in your own bubble

**Expected on Device 2:**
- ✅ New message notification (if implemented)
- ✅ Conversation appears in Chat tab
- ✅ Can open and see message
- ✅ Message in received bubble

**Test Real-time Messaging:**

1. Keep chat open on both devices
2. Send messages from both sides
3. Type without sending

**Expected:**
- ✅ Messages appear instantly
- ✅ Typing indicator works (if implemented)
- ✅ Scroll to bottom on new message
- ✅ No duplicates

---

### ✅ Phase 10: Following System (3 mins)

**Test Following List:**

1. Go to Profile tab
2. Check "Following" section
3. Should see testuser2

**Test User Profile:**

1. Click on testuser2
2. View their profile

**Expected:**
- ✅ Shows username, gender, age
- ✅ Shows follower/following counts
- ✅ Shows streak info
- ✅ "Unfollow" button visible
- ✅ "Send Message" button visible

**Test Unfollow:**

1. Click "Unfollow"
2. Confirm unfollow

**Expected:**
- ✅ Removed from following list
- ✅ Can no longer send messages (unless premium)
- ✅ Conversation remains in chat

---

### ✅ Phase 11: Streak System (3 mins)

**Test Streak Update:**

*Requires a 5+ minute call*

1. Make a call lasting 5+ minutes
2. End the call
3. Go to Home screen

**Expected:**
- ✅ Today's date has green dot in calendar
- ✅ Current streak: 1 day
- ✅ Longest streak: 1 day
- ✅ Progress shown

**Test Multiple Days:**

*Can manually test by updating database date*

- ✅ Consecutive days increase streak
- ✅ Missing a day resets streak
- ✅ Calendar shows completed days

---

### ✅ Phase 12: Socket Connection (2 mins)

**Test Real-time Features:**

1. Open app on 2 devices with same user logged in
2. Check online status

**Expected:**
- ✅ Socket connects on app open
- ✅ "Connected" status in console
- ✅ Online users list updates
- ✅ Match notifications work
- ✅ Message delivery is instant

---

## 🎯 Full Integration Test (Complete Flow)

**Simulate Real User Journey:**

1. ✅ **New User Registration**
   - Register account
   - Verify email in database

2. ✅ **Profile Setup**
   - Edit profile information
   - Check data persistence

3. ✅ **First Call**
   - Start matching
   - Connect with another user
   - Have 5+ minute call
   - Follow the user

4. ✅ **Messaging**
   - Send messages
   - Receive replies
   - Check conversation list

5. ✅ **Streak Achievement**
   - Verify daily streak updated
   - Check calendar display
   - View in profile

6. ✅ **Premium Upgrade** (Optional)
   - Subscribe to premium
   - Test premium features
   - Verify badge shows

7. ✅ **Activity Feed**
   - Check feed shows activities
   - Verify all activity types

8. ✅ **Settings & Logout**
   - Update settings
   - Logout
   - Login again

---

## 🐛 Troubleshooting Test Failures

### Backend Won't Start

**Error: MongoDB connection failed**
```
Solution:
1. Check MongoDB is running: Get-Service MongoDB
2. Start MongoDB: Start-Service MongoDB
3. Or run: mongod
```

**Error: Port 5000 already in use**
```
Solution:
1. Stop other process using port 5000
2. Or change PORT in .env to 5001
```

**Error: Module not found**
```
Solution:
cd backend
Remove-Item -Recurse node_modules
npm install
```

---

### Mobile App Won't Start

**Error: Cannot connect to server**
```
Solution:
1. Check backend is running (npm run dev)
2. Verify SERVER_IP in mobile/src/config/config.js
   - Emulator: Use 10.0.2.2
   - Device: Use your computer's IP (run ipconfig)
3. Ensure phone and PC on same WiFi
```

**Error: Expo command not found**
```
Solution:
npm install -g expo-cli
```

**Error: Unable to resolve module**
```
Solution:
cd mobile
Remove-Item -Recurse node_modules
npm install
expo start -c
```

---

### Matching Not Working

**Users don't match**
```
Checklist:
1. ✅ Both users clicked "Start Connecting"?
2. ✅ Socket connection established? (check console)
3. ✅ Backend running?
4. ✅ Different users on each device?
5. ✅ Check backend logs for errors
```

---

### Messages Not Sending

**Messages don't deliver**
```
Checklist:
1. ✅ Socket connected?
2. ✅ Users follow each other?
3. ✅ Backend logs show message received?
4. ✅ Network connection active?
```

---

## 📊 Testing Checklist Summary

### Core Functionality
- [ ] Backend server starts successfully
- [ ] MongoDB connects
- [ ] API health endpoint responds
- [ ] Mobile app starts without crashes
- [ ] User registration works
- [ ] User login works
- [ ] Session persistence works

### Features
- [ ] Home screen displays correctly
- [ ] Profile screen shows user data
- [ ] Settings accessible
- [ ] Chat screen loads
- [ ] Feed screen loads
- [ ] Premium screen displays

### Real-time Features
- [ ] Socket connection established
- [ ] Users can match
- [ ] Call screen works
- [ ] Messages send/receive
- [ ] Online status updates

### Business Logic
- [ ] Follow after 2+ min call
- [ ] Streak updates after 5+ min call
- [ ] Premium payment flow (optional)
- [ ] Activity feed updates

### Data Persistence
- [ ] User data saves to database
- [ ] Messages persist
- [ ] Streaks save correctly
- [ ] Following list persists
- [ ] Settings save

---

## 🎉 Success Criteria

**Your app is ready for Play Store if:**

✅ **All core features work without crashes**
✅ **No critical bugs in main user flows**
✅ **Real-time features (matching, messaging) work**
✅ **Data persists correctly**
✅ **App works on multiple devices/accounts**
✅ **Performance is acceptable (no major lag)**
✅ **UI looks clean and professional**

---

## 📝 Testing Report Template

After testing, document your results:

```
Open Talk - Testing Report
Date: [Date]
Tester: [Your Name]

BACKEND
✅/❌ Server starts
✅/❌ MongoDB connects
✅/❌ API responds
Issues: [List any issues]

MOBILE APP
✅/❌ App starts
✅/❌ Registration works
✅/❌ Login works
Issues: [List any issues]

FEATURES
✅/❌ Matching system
✅/❌ Messaging
✅/❌ Streaks
✅/❌ Following
✅/❌ Premium
Issues: [List any issues]

OVERALL STATUS: [PASS/FAIL]

BLOCKERS (must fix before launch):
1. [Issue 1]
2. [Issue 2]

NICE TO HAVE (can fix later):
1. [Issue 1]
2. [Issue 2]
```

---

## 🚀 Next Steps After Testing

**If all tests pass:**
1. ✅ Read PLAY_STORE_GUIDE.md
2. ✅ Create app assets (icons, screenshots)
3. ✅ Build production APK/AAB
4. ✅ Submit to Play Store

**If tests fail:**
1. ❌ Document all bugs
2. ❌ Fix critical issues first
3. ❌ Re-test after fixes
4. ❌ Repeat until all pass

---

## 💡 Testing Tips

1. **Test on multiple devices** - Different Android versions behave differently
2. **Test with slow internet** - Simulate poor network conditions
3. **Test app restart** - Data should persist
4. **Test background/foreground** - App should handle state changes
5. **Test with multiple users** - Social features need 2+ accounts
6. **Check logs** - Terminal shows helpful error messages
7. **Take screenshots** - You'll need them for Play Store anyway!

---

**Good luck with testing! 🧪**

If you find any bugs, fix them before proceeding to Play Store deployment.

