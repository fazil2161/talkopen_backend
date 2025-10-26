# Open Talk Backend

Backend server for Open Talk - Connect and talk with strangers app.

## Tech Stack

- Node.js + Express
- MongoDB (Mongoose)
- Socket.io (Real-time communication)
- Razorpay (Payment gateway)
- JWT (Authentication)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/opentalk
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=30d

# Razorpay Keys (get from razorpay dashboard)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# App Settings
PREMIUM_PRICE=299
NODE_ENV=development
```

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/settings` - Update settings
- `GET /api/users/online` - Get online users for matching
- `POST /api/users/block/:id` - Block user
- `POST /api/users/report/:id` - Report user

### Payment
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/history` - Get payment history
- `GET /api/payment/premium-status` - Check premium status

### Follows
- `POST /api/follows/:id` - Follow user
- `DELETE /api/follows/:id` - Unfollow user
- `GET /api/follows/followers` - Get followers
- `GET /api/follows/following` - Get following
- `GET /api/follows/can-chat/:id` - Check if can chat

### Messages
- `POST /api/messages/:id` - Send message
- `GET /api/messages/conversation/:id` - Get conversation
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/unread-count` - Get unread count
- `DELETE /api/messages/:id` - Delete message

### Streaks
- `GET /api/streaks` - Get user's streak
- `POST /api/streaks/update` - Update streak after call
- `GET /api/streaks/leaderboard` - Get leaderboard
- `GET /api/streaks/weekly` - Get weekly stats

### Feed
- `GET /api/feed` - Get user feed
- `GET /api/feed/my-activities` - Get own activities
- `POST /api/feed` - Create feed activity
- `DELETE /api/feed/:id` - Delete feed activity

## Socket.io Events

### Client to Server
- `user_online` - User comes online
- `find_match` - Find a match
- `cancel_match` - Cancel match search
- `call_user` - Initiate call
- `answer_call` - Answer call
- `ice_candidate` - WebRTC ICE candidate
- `call_started` - Call started
- `call_ended` - Call ended
- `send_message` - Send real-time message
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server to Client
- `user_came_online` - Follower came online
- `user_went_offline` - Follower went offline
- `searching_match` - Searching for match
- `match_found` - Match found
- `match_error` - Match error
- `match_cancelled` - Match cancelled
- `incoming_call` - Incoming call
- `call_answered` - Call answered
- `call_ended_confirmed` - Call ended with duration
- `receive_message` - Receive message
- `user_typing` - User is typing
- `user_stop_typing` - User stopped typing

## Features

- User authentication with JWT
- Random video/audio calling with strangers
- Gender-based filtering (Premium feature)
- Follow system (after 2+ minutes call)
- Direct messaging for followed users
- Premium subscription via Razorpay
- Daily streak tracking (5+ minutes goal)
- Activity feed
- Real-time notifications via Socket.io

## Database Models

- User
- Follow
- Payment
- Message
- Streak
- CallHistory
- Feed

