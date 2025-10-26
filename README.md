# Open Talk

A mobile app for Android that helps people connect and talk with strangers worldwide. Make new friends, practice languages, or just have interesting conversations!

## 🌟 Features

### Core Features
- **Random Video/Audio Calls**: Connect with strangers from around the world
- **Gender Filtering**: Filter by gender (Premium feature)
- **Follow System**: Follow users after 2+ minutes of conversation
- **Direct Messaging**: Chat with followed users (mutual follow or premium required)
- **Weekly Streaks**: Track your daily call activity (5+ minutes goal)
- **Activity Feed**: See what your connections are up to
- **Premium Subscription**: Unlock exclusive features with Razorpay payment

### Premium Features
- Gender-based filtering (Male/Female)
- Unlimited messaging without mutual follow
- Direct calls to followed users
- Premium badge
- Priority matching
- Ad-free experience

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express**: REST API server
- **MongoDB**: Database with Mongoose ODM
- **Socket.io**: Real-time communication
- **Razorpay**: Payment gateway integration
- **JWT**: Authentication
- **Bcrypt**: Password hashing

### Mobile App
- **React Native** (Expo): Cross-platform mobile framework
- **React Navigation**: Screen navigation
- **Socket.io Client**: Real-time features
- **Axios**: HTTP client
- **AsyncStorage**: Local data persistence
- **React Native WebRTC**: Video/audio calling (to be implemented)
- **Razorpay SDK**: Payment integration

## 📁 Project Structure

```
talkopen/
├── backend/                    # Node.js backend server
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── socket/               # Socket.io handlers
│   ├── server.js            # Main server file
│   ├── package.json         # Backend dependencies
│   └── README.md            # Backend documentation
│
└── mobile/                    # React Native mobile app
    ├── src/
    │   ├── config/           # App configuration
    │   ├── context/          # React Context (Auth, Socket)
    │   ├── navigation/       # Navigation setup
    │   ├── screens/          # App screens
    │   └── services/         # API services
    ├── App.js               # Main app component
    ├── package.json         # Mobile dependencies
    └── README.md            # Mobile documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development) or Physical Android device

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/opentalk
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=30d

# Razorpay Keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# App Settings
PREMIUM_PRICE=299
NODE_ENV=development
```

4. Start MongoDB:
```bash
# On Windows
mongod

# On Mac/Linux
sudo systemctl start mongod
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure the app - Edit `src/config/config.js`:
```javascript
// Replace with your server IP
export const API_URL = 'http://192.168.1.100:5000/api';
export const SOCKET_URL = 'http://192.168.1.100:5000';
export const RAZORPAY_KEY = 'your_razorpay_key_id';
```

4. Start the Expo development server:
```bash
npm start
```

5. Run on Android:
```bash
npm run android
```

Or scan the QR code with Expo Go app on your Android device.

## 📱 App Screens

### 1. Authentication
- Register with username, email, password, gender, and age
- Login with email and password
- Persistent sessions

### 2. Home Screen
- Connection status indicator
- Weekly streak calendar
- Filter options (Free/Male/Female)
- Start connecting button
- Profile access

### 3. Call Screen
- Video/audio call interface
- Call duration timer
- Mute/video toggle controls
- Follow button (appears after 2 min)
- End call button

### 4. Chat Screen
- List of all conversations
- Unread message badges
- Online status indicators
- Last message preview

### 5. Premium Screen
- Feature showcase
- Pricing information
- Razorpay payment integration
- Subscription status

### 6. Profile Screen
- User stats (followers, following, streak)
- Streak details
- Following list
- Settings access
- Logout

### 7. Feed Screen
- Activity feed from connections
- Activity types: calls, follows, premium, streaks
- Pull to refresh
- Infinite scroll

## 🔐 API Documentation

Detailed API documentation available in `backend/README.md`

### Main Endpoints

- **Auth**: `/api/auth/*` - Registration, login, user info
- **Users**: `/api/users/*` - Profile, settings, online users
- **Payment**: `/api/payment/*` - Create order, verify payment
- **Follows**: `/api/follows/*` - Follow/unfollow, followers list
- **Messages**: `/api/messages/*` - Send, receive, conversations
- **Streaks**: `/api/streaks/*` - Get streak, update, leaderboard
- **Feed**: `/api/feed/*` - Activity feed

## 💳 Razorpay Integration

### Setup

1. Sign up at [Razorpay](https://razorpay.com)
2. Get your Key ID and Secret from dashboard
3. Update backend `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```
4. Update mobile `src/config/config.js`:
   ```javascript
   export const RAZORPAY_KEY = 'rzp_test_xxxxx';
   ```

### Payment Flow

1. User clicks "Subscribe Now"
2. App creates order via backend
3. Razorpay checkout opens
4. User completes payment
5. Backend verifies payment signature
6. User premium status updated
7. Premium features unlocked

## 🔌 Socket.io Events

### Client → Server
- `user_online` - User comes online
- `find_match` - Search for a match
- `cancel_match` - Cancel search
- `call_started` - Call initiated
- `call_ended` - Call finished
- `send_message` - Real-time message

### Server → Client
- `match_found` - Match found
- `match_error` - Matching error
- `call_ended_confirmed` - Call ended with stats
- `receive_message` - New message
- `user_came_online` - Follower online
- `user_went_offline` - Follower offline

## 🎯 Key Features Implementation

### 1. Streak System
- Tracks daily call time
- Goal: 5+ minutes per day
- Shows 7-day calendar
- Current and longest streak
- Auto-updates after each call

### 2. Follow System
- Enabled after 2+ minute calls
- Mutual follow detection
- Follow to chat requirement
- Can unfollow anytime

### 3. Matching Algorithm
- Random matching by default
- Gender filtering (premium)
- Online users only
- Excludes blocked users
- FIFO queue system

### 4. Premium Features
- Gender filtering
- Unlimited messaging
- Direct calls
- Premium badge
- Priority queue
- Ad-free

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Payment signature verification
- User blocking system
- Report user functionality
- Premium status validation

## 🚧 Future Enhancements

- [ ] Implement actual WebRTC video/audio
- [ ] Push notifications
- [ ] Image/voice messages
- [ ] Profile pictures upload
- [ ] Call history
- [ ] Multiple language support
- [ ] Dark mode
- [ ] iOS version
- [ ] Group video calls
- [ ] Interest-based matching

## 📝 Database Models

### User
- Personal info (username, email, password, gender, age)
- Premium status
- Followers/following lists
- Settings
- Online status

### Streak
- Current and longest streak
- Daily call time
- Weekly history
- Total calls made

### Follow
- Follower and following IDs
- Met duration
- Mutual status

### Message
- Sender and receiver
- Content
- Read status
- Conversation ID

### Payment
- User reference
- Razorpay IDs
- Amount
- Status

### Feed
- User reference
- Activity type
- Description
- Metadata

### CallHistory
- Participants
- Duration
- Call type
- Timestamps

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB connection failed**: Ensure MongoDB is running
- **Port already in use**: Change PORT in .env
- **JWT errors**: Check JWT_SECRET in .env

### Mobile App Issues
- **Cannot connect to server**: 
  - Verify IP address in config.js
  - Check if devices on same Wi-Fi
  - Check firewall settings
  
- **Socket not connecting**:
  - Verify SOCKET_URL
  - Check backend logs
  - Restart both servers

- **Razorpay not opening**:
  - Use physical device (not simulator)
  - Verify RAZORPAY_KEY
  - Check package installation

## 📄 License

© 2024 Open Talk. All rights reserved.

## 👥 Author

Built with ❤️ for connecting people worldwide.

## 🤝 Contributing

This is a personal project. Feel free to fork and modify for your own use.

## 📞 Support

For issues and questions, please check the README files in backend and mobile directories for detailed documentation.

