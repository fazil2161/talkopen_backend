# Open Talk Mobile App

React Native mobile application for Open Talk - Connect and talk with strangers.

## Tech Stack

- React Native (Expo)
- React Navigation
- Socket.io Client
- Axios (API calls)
- Razorpay (Payment gateway)
- React Native WebRTC (Video/Audio calls)
- AsyncStorage (Local storage)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For Android: Android Studio or physical Android device
- For iOS: Xcode (Mac only) or physical iOS device

### Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure the app:

Edit `src/config/config.js` and update the following:
```javascript
export const API_URL = 'http://YOUR_SERVER_IP:5000/api';
export const SOCKET_URL = 'http://YOUR_SERVER_IP:5000';
export const RAZORPAY_KEY = 'your_razorpay_key_id';
```

Replace `YOUR_SERVER_IP` with:
- Your local IP address (e.g., 192.168.1.100) for testing on physical device
- `localhost` for iOS simulator
- `10.0.2.2` for Android emulator

### Running the App

1. Start the development server:
```bash
npm start
```

2. Run on Android:
```bash
npm run android
```

3. Run on iOS (Mac only):
```bash
npm run ios
```

4. Or scan the QR code with:
   - Expo Go app on Android
   - Camera app on iOS (will open in Expo Go)

## Project Structure

```
mobile/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
└── src/
    ├── config/
    │   └── config.js              # App configuration
    ├── context/
    │   ├── AuthContext.js         # Authentication context
    │   └── SocketContext.js       # Socket.io context
    ├── navigation/
    │   └── MainTabs.js            # Bottom tab navigation
    ├── screens/
    │   ├── AuthScreen.js          # Login/Register
    │   ├── HomeScreen.js          # Home with matching
    │   ├── CallScreen.js          # Video/Audio call
    │   ├── ChatScreen.js          # Conversations list
    │   ├── ChatDetailScreen.js    # Individual chat
    │   ├── PremiumScreen.js       # Premium subscription
    │   ├── ProfileScreen.js       # User profile
    │   ├── FeedScreen.js          # Activity feed
    │   ├── UserProfileScreen.js   # Other user's profile
    │   ├── EditProfileScreen.js   # Edit own profile
    │   └── SettingsScreen.js      # App settings
    └── services/
        └── api.js                 # API service layer
```

## Features

### Authentication
- User registration with email, username, password, gender, and age
- User login with JWT token
- Persistent authentication with AsyncStorage

### Home Screen
- Real-time connection status indicator
- Weekly streak display with 7-day calendar
- Gender filter buttons (Free, Male, Female)
- Premium badge for locked features
- Start connecting button with search animation
- Cancel search functionality

### Video/Audio Calling
- Random matching with strangers
- Gender-based filtering (Premium)
- Real-time call duration timer
- Mute/unmute microphone
- Enable/disable video
- Follow option after 2+ minutes
- Automatic streak update after call ends

### Chat/Messaging
- Direct messaging with followed users
- Real-time message delivery via Socket.io
- Typing indicators
- Unread message count
- Message timestamps
- Chat history

### Premium Subscription
- Razorpay payment integration
- Premium features showcase
- Subscription status display
- Monthly subscription model
- Secure payment verification

### Profile
- User profile with stats
- Streak information
- Following/followers list
- Edit profile (username, bio, interests)
- Settings management
- Logout functionality

### Feed
- Activity feed from followed users
- Different activity types:
  - Call completed
  - New follow
  - Premium activated
  - Streak achieved
- Pull to refresh
- Infinite scroll

### Additional Features
- Block user
- Report user
- Online/offline status
- Premium badges
- Mutual follow detection
- Settings for notifications and privacy

## API Endpoints Used

All endpoints are defined in `src/services/api.js`:

- **Auth**: `/auth/register`, `/auth/login`, `/auth/me`
- **Users**: `/users/:id`, `/users/profile`, `/users/settings`, `/users/online`
- **Payment**: `/payment/create-order`, `/payment/verify`, `/payment/premium-status`
- **Follows**: `/follows/:id`, `/follows/followers`, `/follows/following`, `/follows/can-chat/:id`
- **Messages**: `/messages/:id`, `/messages/conversation/:id`, `/messages/conversations`
- **Streaks**: `/streaks`, `/streaks/update`, `/streaks/leaderboard`, `/streaks/weekly`
- **Feed**: `/feed`, `/feed/my-activities`

## Socket.io Events

### Emitted Events
- `user_online` - User comes online
- `find_match` - Start searching for match
- `cancel_match` - Cancel match search
- `call_started` - Call initiated
- `call_ended` - Call finished
- `send_message` - Send real-time message
- `typing` / `stop_typing` - Typing indicators

### Received Events
- `searching_match` - Match search in progress
- `match_found` - Match found with user details
- `match_error` - Error during matching
- `call_ended_confirmed` - Call ended with duration
- `receive_message` - New message received
- `user_typing` / `user_stop_typing` - Other user typing
- `user_came_online` / `user_went_offline` - Follower status

## Configuration Notes

### For Physical Device Testing

1. Make sure your phone and computer are on the same Wi-Fi network
2. Find your computer's local IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`
3. Update `API_URL` and `SOCKET_URL` in `src/config/config.js`
4. Make sure backend server is running and accessible

### For Razorpay Integration

1. Sign up at https://razorpay.com
2. Get your Key ID from the dashboard
3. Update `RAZORPAY_KEY` in `src/config/config.js`
4. Update backend `.env` with your Razorpay key and secret

## Building for Production

### Android APK

```bash
expo build:android
```

### iOS IPA

```bash
expo build:ios
```

## Troubleshooting

### Cannot connect to server
- Check if backend server is running
- Verify IP address in config.js
- Check firewall settings
- Make sure devices are on same network

### Socket connection fails
- Verify SOCKET_URL in config
- Check backend server logs
- Ensure Socket.io is properly configured on backend

### Razorpay not opening
- Verify RAZORPAY_KEY is correct
- Check if react-native-razorpay is properly linked
- Test on physical device (may not work on simulator)

## Next Steps / Enhancements

- Implement actual WebRTC for video/audio calls
- Add image upload for avatars
- Add voice/image messages
- Implement push notifications
- Add app localization
- Add dark mode
- Implement call history
- Add video call recording (with permission)
- Add in-app purchases for other premium features

## License

© 2024 Open Talk. All rights reserved.

