# 🚀 Quick Build Guide - Copy & Paste Commands

## ✅ **Step-by-Step: Build Your App in 30 Minutes**

---

## 📋 **Prerequisites Check:**

Run these to verify:

```powershell
# Check Node.js
node --version
# Should show: v16.x.x or higher

# Check npm
npm --version
# Should show: 8.x.x or higher
```

✅ All good? Continue!

---

## 🎯 **Step 1: Install EAS CLI**

```powershell
npm install -g eas-cli
```

Wait for installation...

**Verify:**
```powershell
eas --version
```

Should show: `eas-cli/5.x.x` or similar

---

## 🔐 **Step 2: Create Expo Account**

### **Option A: Via Website (Recommended)**

1. **Open:** https://expo.dev/signup
2. **Fill in:**
   - Email: `your-email@example.com`
   - Username: `your-username`
   - Password: `YourPassword123`
3. **Click "Sign Up"**
4. **Check email** - Verify your account
5. **Done!** ✅

### **Option B: During Login**

```powershell
eas login
```

If it offers "Create account", follow prompts!

---

## 🔑 **Step 3: Login**

```powershell
eas login
```

**Enter:**
- Email: `your-email@example.com`
- Password: `YourPassword123`

**Success message:**
```
✔ Logged in as your-username
```

---

## 📁 **Step 4: Go to Mobile Folder**

```powershell
cd mobile
```

**Verify you're in the right place:**
```powershell
dir
```

Should see: `package.json`, `App.js`, `app.json`

---

## ⚙️ **Step 5: Configure EAS (First Time Only)**

```powershell
eas build:configure
```

**Questions you'll see:**

```
? Select a platform › Android
? Generate a new Android Keystore? › Yes
```

**Just press Enter** for defaults!

**Creates:** `eas.json` file

---

## 🏗️ **Step 6: Build Development APK**

```powershell
eas build --profile development --platform android
```

**What happens:**

```
✔ Checking project configuration
✔ Uploading project files
✔ Building project
⠴ Waiting for build to complete...
```

**⏱️ Takes 15-30 minutes!**

---

## ⏳ **Step 7: Wait for Build**

**While waiting, you'll see:**

```
Build started...
Build ID: abc123xyz
Build URL: https://expo.dev/accounts/your-username/builds/abc123xyz

⠴ Building... (this may take a while)
```

**You can:**
- ☕ Get coffee
- 📱 Check other things
- 💻 Leave terminal open

**Or check status:**
```powershell
eas build:list
```

---

## 📥 **Step 8: Download APK**

**When build completes:**

```
✔ Build finished!

Install and run it directly on your Android device:
https://expo.dev/artifacts/eas/abc123xyz.apk

APK size: ~50MB
```

**To download:**

### **Method A: Direct Link**
- Click the link in terminal
- Downloads to your PC
- Size: ~50MB

### **Method B: From Expo Dashboard**
1. Visit: https://expo.dev/accounts/your-username/projects/talkopen/builds
2. Click latest build
3. Click "Download"

---

## 📲 **Step 9: Install on Phone**

### **Transfer APK to Phone:**

**Option 1: USB Cable**
1. Connect phone to PC
2. Copy APK to phone's Downloads folder
3. Disconnect phone

**Option 2: Email/Drive**
1. Email APK to yourself
2. Open email on phone
3. Download APK

**Option 3: Direct Download**
1. Open link on phone browser
2. Downloads automatically

### **Install APK:**

1. **Open file manager** on phone
2. **Go to Downloads**
3. **Tap APK file**
4. **Allow "Install from unknown sources"** if asked:
   - Settings → Security → Unknown sources → Enable
   - OR Settings → Apps → Chrome → Install unknown apps → Enable
5. **Tap "Install"**
6. **Wait 10 seconds**
7. **Tap "Open"**

---

## 🎉 **Step 10: Test Audio Calling!**

### **You need 2 phones for this!**

**Phone 1 & Phone 2:**

1. **Open the custom app** (NOT Expo Go!)
2. **Create accounts:**
   - Phone 1: Register as User A
   - Phone 2: Register as User B
3. **Both click "Start Connecting"**
4. **Wait for match...**
5. **Call connects!**
6. **Permission popup:**
   ```
   Allow Open Talk to record audio?
   [Deny] [Allow]
   ```
   **Tap "Allow"** on BOTH phones!
7. **Say "Hello!"** on Phone 1
8. **Hear it on Phone 2!** 🎙️
9. **Reply from Phone 2**
10. **Hear it on Phone 1!**

**✅ Audio calling works!** 🎊

---

## 🎛️ **Test All Features:**

- [ ] **Audio Connected badge** shows (green)
- [ ] **Say something** - other person hears
- [ ] **Click mute** - icon turns red
- [ ] **Say something** - other person doesn't hear
- [ ] **Unmute** - works again!
- [ ] **End call** - goes back to home
- [ ] **Follow button** appears after 30 seconds

**All working? Perfect!** ✅

---

## 🐛 **Troubleshooting:**

### **❌ "eas: command not found"**
```powershell
npm install -g eas-cli
```

### **❌ "Not logged in"**
```powershell
eas login
```

### **❌ "Build failed"**

Check error in terminal. Common fix:
```powershell
cd mobile
npm install
eas build --profile development --platform android
```

### **❌ "Can't install APK"**

On phone:
- Settings → Security → Allow unknown sources
- Try different browser to download

### **❌ "No audio during call"**

1. Check microphone permission:
   - Settings → Apps → Open Talk → Permissions → Microphone → Allow
2. Increase volume!
3. Test with headphones
4. Make sure both phones have custom build (not Expo Go)

### **❌ "Permission denied"**

Reinstall and click "Allow" when asked!

---

## 📊 **Build Status Guide:**

| Status | What it means |
|--------|---------------|
| `queued` | Waiting to start |
| `in-progress` | Currently building |
| `finished` | ✅ Ready to download! |
| `errored` | ❌ Something went wrong |

**Check status:**
```powershell
eas build:list
```

---

## 💰 **Cost:**

**FREE Tier:**
- ✅ 30 builds per month
- ✅ Development builds
- ✅ Production builds
- ✅ All features

**No credit card needed!** 🎉

---

## 🔄 **Rebuild (If Needed):**

If you make code changes:

```powershell
cd mobile
eas build --profile development --platform android
```

Builds new version!

---

## 🎯 **Summary - Copy All These:**

```powershell
# 1. Install EAS
npm install -g eas-cli

# 2. Login (create account at https://expo.dev/signup first)
eas login

# 3. Go to mobile folder
cd mobile

# 4. Configure (first time only)
eas build:configure

# 5. Build APK
eas build --profile development --platform android

# 6. Wait 20-30 minutes

# 7. Download APK from link

# 8. Install on phone

# 9. Test audio calling with 2 phones!
```

---

## 📚 **Helpful Commands:**

```powershell
# Check build status
eas build:list

# Check who's logged in
eas whoami

# View project info
eas project:info

# Cancel a build (if needed)
eas build:cancel

# Update EAS CLI
npm install -g eas-cli@latest
```

---

## 🎊 **You're Done!**

**In 30 minutes, you'll have:**
✅ Custom Android app
✅ Working audio calling
✅ All features functional
✅ Ready to test!

**Next step:** Build for Play Store with production profile!

---

**START NOW:** 🚀

```powershell
npm install -g eas-cli
eas login
cd mobile
eas build --profile development --platform android
```

**Good luck!** 🎙️✨

