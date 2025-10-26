# 📱 Open Talk - Google Play Store Publishing Guide

Complete guide to publish your Open Talk app on Google Play Store.

---

## 📋 Prerequisites

Before publishing to Play Store:

- ✅ App works perfectly on local testing
- ✅ All features tested thoroughly
- ✅ No critical bugs or crashes
- ✅ Google Play Developer Account ($25 one-time fee)
- ✅ App assets ready (icon, screenshots, descriptions)
- ✅ Backend deployed to production server (optional for initial testing)

---

## 🎨 Part 1: Create App Assets

### 1.1 App Icon (Required)

**Requirements:**
- Size: 1024x1024 pixels
- Format: PNG (no transparency for launcher icon)
- Square shape

**Create using:**
- [Canva](https://canva.com) (Free, easy)
- [Figma](https://figma.com) (Free)
- Photoshop/GIMP (Advanced)

**Icon Guidelines:**
- Simple, recognizable design
- Represents communication/talking
- Use brand colors (we use #6366f1 - indigo)
- Test at small sizes

**Save as:**
- `mobile/assets/icon.png` (1024x1024)
- `mobile/assets/adaptive-icon.png` (1024x1024, foreground only)

### 1.2 Splash Screen

**Requirements:**
- Size: 1284x2778 pixels (or larger)
- Format: PNG
- Centered logo/icon

**Save as:**
- `mobile/assets/splash.png`

### 1.3 Feature Graphic (Required for Play Store)

**Requirements:**
- Size: 1024x500 pixels
- Format: PNG or JPG
- No text about pricing or "free"
- Showcases app's main feature

**Use it for:**
- Play Store listing header image
- Attracts users to download

### 1.4 Screenshots (Minimum 2 required)

**Requirements:**
- Minimum 2 screenshots
- Recommended: 4-8 screenshots
- Format: PNG or JPG
- Dimensions: Minimum 320px, Maximum 3840px

**What to capture:**
- Home screen with streak
- Call screen (simulated)
- Chat screen with conversations
- Profile screen
- Premium features screen
- Feed screen

**Tips:**
- Use Android device/emulator screenshots
- Show actual app functionality
- Add text overlays explaining features (optional)
- Keep it clean and professional

---

## 🏗️ Part 2: Setup EAS Build

Expo Application Services (EAS) is the easiest way to build APK/AAB for Play Store.

### 2.1 Install EAS CLI

```powershell
npm install -g eas-cli
```

### 2.2 Login to Expo

```powershell
cd mobile
eas login
```

If you don't have an Expo account:
```powershell
eas register
```

### 2.3 Configure EAS Build

```powershell
eas build:configure
```

This creates `eas.json`. Update it if needed:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "distribution": "store",
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

### 2.4 Update app.json for Production

Make sure these are set correctly:

```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "package": "com.opentalk.app",
      "versionCode": 1
    }
  }
}
```

**Important:**
- `version`: User-facing version (1.0.0, 1.0.1, etc.)
- `versionCode`: Internal number (1, 2, 3...) - must increase with each update
- `package`: Unique identifier (change "opentalk" to your desired name)

---

## 🔨 Part 3: Build APK/AAB

### 3.1 Build APK (For Testing)

APK is good for testing on devices:

```powershell
eas build --platform android --profile preview
```

This will:
- Upload your code to Expo servers
- Build the APK in the cloud
- Provide download link (usually takes 10-20 minutes)

Download the APK and install on your Android device for testing.

### 3.2 Build AAB (For Play Store)

Android App Bundle (AAB) is required for Play Store:

```powershell
eas build --platform android --profile production
```

This creates an AAB file optimized for Play Store distribution.

**Download the AAB** file once build completes - you'll upload this to Play Console.

---

## 🔐 Part 4: App Signing

EAS handles signing automatically, but you need to manage credentials.

### 4.1 Let EAS Manage Signing (Recommended)

```powershell
eas build --platform android
```

Choose "Generate new keystore" when prompted. EAS will:
- Generate keystore automatically
- Store it securely
- Use it for all future builds

### 4.2 Manual Signing (Advanced)

If you want to manage your own keystore:

1. Generate keystore:
```powershell
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Configure in `eas.json`:
```json
{
  "build": {
    "production": {
      "android": {
        "credentialsSource": "local"
      }
    }
  }
}
```

---

## 🏪 Part 5: Create Play Store Listing

### 5.1 Create Developer Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Complete developer profile
4. Accept developer agreements

### 5.2 Create New App

1. Click "Create App"
2. Fill in:
   - **App name:** Open Talk
   - **Default language:** English (US)
   - **App or game:** App
   - **Free or paid:** Free
   - **Declarations:** Complete all required declarations

### 5.3 Complete Store Listing

**Main store listing:**

- **App name:** Open Talk
- **Short description (80 characters):**
  ```
  Connect with strangers worldwide. Make friends, practice languages, chat now!
  ```

- **Full description (4000 characters):**
  ```
  Open Talk - Connect with Strangers Worldwide
  
  Make new friends, practice languages, and have interesting conversations with people from around the world! Open Talk is your gateway to meaningful connections.
  
  🌟 FEATURES
  
  ✨ Random Video & Audio Calls
  Connect instantly with strangers worldwide. Start conversations with a single tap!
  
  👥 Follow System
  Had a great conversation? Follow users after 2+ minutes of talking and stay connected.
  
  💬 Direct Messaging
  Chat with people you've followed. Share thoughts, practice languages, or just say hi!
  
  🔥 Weekly Streaks
  Track your daily call activity. Maintain streaks by talking 5+ minutes per day!
  
  📰 Activity Feed
  See what your connections are up to. Stay updated with their activities and achievements.
  
  ⭐ Premium Features
  • Gender-based filtering
  • Unlimited messaging
  • Direct calls to followed users
  • Premium badge
  • Priority matching
  • Ad-free experience
  
  🎯 PERFECT FOR
  • Meeting new people
  • Practicing foreign languages
  • Making international friends
  • Overcoming social anxiety
  • Having interesting conversations
  • Building social connections
  
  🔒 SAFE & SECURE
  • User blocking system
  • Report functionality
  • Secure authentication
  • Privacy-focused design
  
  💳 PREMIUM SUBSCRIPTION
  Unlock all features with Premium subscription. One-time payment via Razorpay.
  
  📱 START CONNECTING TODAY
  Download Open Talk and start your journey to meaningful connections!
  
  ---
  
  Support: [Your email]
  Privacy Policy: [Your privacy policy URL]
  Terms of Service: [Your terms URL]
  ```

- **App icon:** Upload your 512x512 icon
- **Feature graphic:** Upload 1024x500 image
- **Screenshots:** Upload 2-8 screenshots

**Category:**
- App category: Social
- Tags: Communication, Social, Chat, Video Call, Friends

**Contact details:**
- Email: your@email.com
- Phone: (optional)
- Website: (optional)

**Privacy Policy:**
You'll need to create a privacy policy. You can use:
- [App Privacy Policy Generator](https://app-privacy-policy-generator.firebaseapp.com/)
- [PrivacyPolicies.com](https://www.privacypolicies.com/)

### 5.4 Content Rating

1. Go to "Content rating" section
2. Answer questionnaire honestly
3. Get rating (usually PEGI 3 or ESRB Everyone)

### 5.5 Target Audience

- **Target age:** 13+ (or 16+ for safety)
- **App appeal:** General audience

### 5.6 Data Safety

Declare what data you collect:
- Personal information: Email, username
- User content: Messages, call history
- Usage data: App interactions
- Device info: Camera, microphone access

Be transparent about data usage!

---

## 📦 Part 6: Upload and Release

### 6.1 Upload AAB

1. Go to "Production" → "Create new release"
2. Upload your AAB file from EAS build
3. Add release notes:
   ```
   Initial release of Open Talk
   - Random video/audio calls
   - Follow system
   - Direct messaging
   - Weekly streaks
   - Activity feed
   - Premium features
   ```

### 6.2 Review and Publish

1. Complete all required sections
2. Review "Publishing overview"
3. Fix any issues (red flags)
4. Click "Send for review"

**Review time:** Usually 1-7 days

---

## 🚀 Part 7: Production Backend

For a production-ready app, you'll need to deploy your backend:

### Option 1: Heroku (Easiest)
1. Create Heroku account
2. Install Heroku CLI
3. Deploy backend:
```powershell
cd backend
heroku create opentalk-backend
heroku addons:create mongolab
git push heroku main
```

### Option 2: DigitalOcean/AWS/Azure
- Rent a server
- Install Node.js and MongoDB
- Deploy backend
- Setup SSL certificate
- Configure domain

### Update Mobile App Config

Once backend is deployed, update `config.js`:

```javascript
const SERVER_IP = 'your-server-domain.com'; // or IP address
export const API_URL = `https://${SERVER_IP}/api`; // Use HTTPS!
export const SOCKET_URL = `https://${SERVER_IP}`;
```

Rebuild and update your app!

---

## 📊 Part 8: Post-Launch

### Monitor Your App

- Check Google Play Console for:
  - Downloads
  - Ratings & reviews
  - Crashes & ANRs (App Not Responding)
  - User feedback

### Updates

To update your app:

1. Fix bugs or add features
2. Update version in `app.json`:
   ```json
   "version": "1.0.1",
   "android": {
     "versionCode": 2
   }
   ```
3. Build new AAB: `eas build --platform android --profile production`
4. Upload to Play Store
5. Submit for review

### Marketing

- Share on social media
- Ask friends to download and review
- Create promotional content
- Engage with users

---

## ✅ Pre-Launch Checklist

Before submitting to Play Store:

- [ ] All features working properly
- [ ] No critical bugs
- [ ] Backend deployed (for production)
- [ ] App assets created (icon, screenshots)
- [ ] Privacy policy published
- [ ] Terms of service created (optional)
- [ ] Content rating completed
- [ ] Store listing filled completely
- [ ] APK tested on multiple devices
- [ ] AAB built successfully
- [ ] Razorpay setup for payments (if enabled)

---

## 💡 Tips for Success

1. **Test Thoroughly:** Test on multiple devices before submitting
2. **Good Screenshots:** First impression matters!
3. **Clear Description:** Explain what your app does
4. **Privacy Compliance:** Be transparent about data collection
5. **Respond to Reviews:** Engage with your users
6. **Regular Updates:** Keep improving your app
7. **ASO (App Store Optimization):** Use relevant keywords in description

---

## 🛑 Common Rejection Reasons

- Incomplete store listing
- Missing privacy policy
- Incorrect content rating
- App crashes on startup
- Missing required permissions explanation
- Copyright violations
- Misleading screenshots/description

Make sure to avoid these!

---

## 📱 Publishing Timeline

| Step | Time Required |
|------|---------------|
| Create assets | 2-4 hours |
| Setup EAS Build | 30 minutes |
| Build AAB | 15-30 minutes |
| Create Play Console listing | 1-2 hours |
| Google Review | 1-7 days |
| **Total** | **2-3 days to 1 week** |

---

## 🆘 Need Help?

- [Expo EAS Documentation](https://docs.expo.dev/build/setup/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Play Store Policies](https://play.google.com/about/developer-content-policy/)

---

## 🎉 Congratulations!

Once your app is published:
- Share it with friends and family
- Monitor user feedback
- Plan new features
- Keep improving!

Your app link will be:
`https://play.google.com/store/apps/details?id=com.opentalk.app`

Good luck with your launch! 🚀

---

**Remember:** Building a successful app takes time. Focus on user experience, listen to feedback, and keep iterating!



