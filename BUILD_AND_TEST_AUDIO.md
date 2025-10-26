# 🎙️ Build & Test Audio Calling - Complete Guide

## ✅ **Audio Calling is NOW Implemented!**

I've re-added the full WebRTC audio calling feature. Now you need to build a **custom app** to test it.

---

## 🚀 **How to Build & Test (3 Methods)**

### **Method 1: EAS Build (Recommended - Easiest)** ⭐

This builds the app on Expo's servers - no Android Studio needed!

#### **Step 1: Install EAS CLI**

```powershell
npm install -g eas-cli
```

#### **Step 2: Login to Expo**

```powershell
eas login
```

**Don't have an account?** Create one:
```powershell
eas register
```

It's FREE! No credit card needed for basic tier.

#### **Step 3: Configure EAS**

```powershell
cd mobile
eas build:configure
```

This creates `eas.json` file.

#### **Step 4: Build Development APK**

```powershell
eas build --profile development --platform android
```

**What happens:**
- Code uploads to Expo servers
- Builds custom APK with WebRTC
- Takes 15-30 minutes
- You get download link!

#### **Step 5: Install on Phone**

1. **Check build status:**
   ```powershell
   eas build:list
   ```

2. **Download APK** from link provided

3. **Transfer to phone** (via USB, email, or direct download)

4. **Install APK:**
   - Tap APK file on phone
   - Allow "Install from unknown sources"
   - Install!

5. **Open app & test audio!** 🎉

---

### **Method 2: Local Build with Expo** 💻

Build on your computer (requires Android SDK).

#### **Prerequisites:**
- Android Studio installed
- Android SDK configured
- Java JDK installed

#### **Steps:**

```powershell
cd mobile

# Create custom development client
npx expo run:android

# This builds and installs automatically!
```

**Pros:** Faster for repeated testing
**Cons:** Requires Android Studio setup

---

### **Method 3: Production APK (For Play Store)** 📦

Build final production app.

```powershell
cd mobile

# Build production APK
eas build --profile production --platform android

# Download and install
```

This is what you'll submit to Play Store!

---

## 📱 **Recommended Testing Flow**

### **Option A: EAS Build (No Android Studio)**

```powershell
# 1. Install EAS
npm install -g eas-cli

# 2. Login
eas login

# 3. Go to mobile folder
cd mobile

# 4. Configure (first time only)
eas build:configure

# 5. Build APK
eas build --profile development --platform android

# 6. Wait 15-30 minutes
# 7. Download APK from link
# 8. Install on phone
# 9. Test audio! 🎉
```

---

### **Option B: Expo Development Build (With Android Studio)**

```powershell
# 1. Install Android Studio
# 2. Setup Android SDK
# 3. Connect phone via USB

# 4. Build and install
cd mobile
npx expo run:android

# App installs automatically!
```

---

## 🎯 **What You'll Get**

### **After Building:**

✅ **Custom app** (not Expo Go)
✅ **WebRTC compiled in**
✅ **Microphone access works**
✅ **Full audio calling!**

### **Features That Will Work:**

🎙️ **Real-time audio streaming**
🔇 **Mute/unmute**
✅ **"Audio Connected" indicator**
📞 **Peer-to-peer calls**
🌐 **Works on any network**

---

## 💰 **Cost & Limits**

### **EAS Build - FREE Tier:**

✅ **FREE:**
- 30 builds/month
- Development & production builds
- Basic support
- All features

💎 **Paid (Optional):**
- $29/month - More builds
- Priority builds
- Faster queue

**For testing: FREE tier is perfect!**

---

## ⏱️ **Time Comparison**

| Method | Setup Time | Build Time | Difficulty |
|--------|------------|------------|------------|
| **EAS Build** | 5 min | 15-30 min | ⭐ Easy |
| **Local Build** | 1-2 hours | 5-10 min | ⭐⭐⭐ Hard |
| **Expo Go** | Instant | 0 | ⭐ Easy (No audio!) |

---

## 🔧 **Troubleshooting EAS Build**

### **❌ "eas: command not found"**

```powershell
npm install -g eas-cli
```

### **❌ "Not logged in"**

```powershell
eas login
```

### **❌ "Build failed"**

Check terminal for specific error. Common fixes:
```powershell
# Update Expo
cd mobile
npm install expo@latest

# Clear cache
npm install

# Try again
eas build --profile development --platform android
```

### **❌ "Can't install APK"**

On your phone:
- Settings → Security → Allow unknown sources
- Or Settings → Apps → Special access → Install unknown apps → Enable for browser/file manager

---

## 📝 **Complete Build Commands**

### **For Development (Testing):**

```powershell
# First time setup
npm install -g eas-cli
eas login
cd mobile
eas build:configure

# Build development APK
eas build --profile development --platform android

# Check build status
eas build:list

# Download & install on phone
```

### **For Production (Play Store):**

```powershell
# Build production AAB
eas build --profile production --platform android

# Submit to Play Store
eas submit -p android
```

---

## 🎊 **After Installing Custom Build**

### **Test Audio Calling:**

1. **Open app on BOTH devices** (custom build, not Expo Go)

2. **Device 1 & 2:**
   - Go to Home
   - Click "Start Connecting"
   - Match happens!

3. **Permission popup:**
   ```
   "Allow Open Talk to record audio?"
   [Deny] [Allow]
   ```
   **Tap "Allow"** on both!

4. **Start talking!** 🎙️
   - Say "Hello!" on Device 1
   - Device 2 HEARS you!
   - Reply from Device 2
   - Device 1 HEARS Device 2!

5. **Check "Audio Connected" badge** - Green = Working!

6. **Test mute button** - Red = Muted

---

## 💡 **Pro Tips**

✅ **Use Wi-Fi for first test** - More reliable
✅ **Test with 2 phones** - Or ask a friend
✅ **Keep terminals open** - Watch for logs
✅ **Check permissions** - Settings → Apps → Open Talk → Permissions
✅ **Volume up!** - Make sure volume is high

---

## 🚀 **Quick Start (Copy-Paste)**

**Full setup in 5 commands:**

```powershell
npm install -g eas-cli
eas login
cd mobile
eas build:configure
eas build --profile development --platform android
```

**Then:**
1. Wait for build (15-30 min)
2. Download APK from link
3. Install on phone
4. Test audio! 🎉

---

## 📊 **What to Expect**

### **Build Process:**

```
1. Upload code (1 min)
2. Install dependencies (5 min)
3. Compile native code (10 min)
4. Create APK (5 min)
5. Upload APK (3 min)
─────────────────────────
Total: ~25 minutes
```

### **Build Output:**

```
✅ Build finished!

Install and run it directly on your Android device:
https://expo.dev/artifacts/[your-build-id]

APK size: ~50MB
```

---

## 🎯 **Testing Checklist**

After installing custom build:

- [ ] App opens successfully
- [ ] Can login/register
- [ ] Start matching works
- [ ] Call screen opens
- [ ] **Permission popup appears**
- [ ] **Tap "Allow" for microphone**
- [ ] **"Audio Connected" badge shows**
- [ ] **Can hear other person**
- [ ] **They can hear you**
- [ ] **Mute button works**
- [ ] Follow system works
- [ ] Chat works
- [ ] All tabs accessible

**All checked? Audio calling works! 🎉**

---

## 📚 **Resources**

- [EAS Build Docs](https://docs.expo.dev/build/setup/)
- [EAS Build Pricing](https://expo.dev/pricing)
- [WebRTC Guide](https://docs.expo.dev/guides/using-webrtc/)
- [Troubleshooting](https://docs.expo.dev/build-reference/troubleshooting/)

---

## 🆘 **Need Help?**

**Common Questions:**

**Q: Do I need to pay?**
A: No! Free tier gives 30 builds/month.

**Q: How long does it take?**
A: 15-30 minutes for first build.

**Q: Can I test on emulator?**
A: Yes, but audio works better on real phone.

**Q: Do I need Android Studio?**
A: No for EAS Build! Yes for local build.

**Q: Will it work on iOS?**
A: Yes! Use `--platform ios` (need Mac for testing)

---

## 🎉 **You're Ready!**

**Run these commands NOW:**

```powershell
npm install -g eas-cli
eas login
cd mobile
eas build --profile development --platform android
```

**In 30 minutes, you'll have working audio calls! 🎙️🚀**

---

**START BUILDING!** ⚡

