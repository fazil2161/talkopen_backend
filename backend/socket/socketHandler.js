const User = require('../models/User');
const CallHistory = require('../models/CallHistory');
const Feed = require('../models/Feed');
const Message = require('../models/Message');

// Store active users and their socket connections
const activeUsers = new Map();
const waitingQueue = {
  free: [],
  male: [],
  female: []
};
const activeCalls = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // User goes online
    socket.on('user_online', async (data) => {
      try {
        const { userId } = data;
        
        activeUsers.set(userId, socket.id);
        socket.userId = userId;

        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          socketId: socket.id
        });

        // Notify followers
        const user = await User.findById(userId).populate('followers');
        user.followers.forEach(follower => {
          const followerSocketId = activeUsers.get(follower._id.toString());
          if (followerSocketId) {
            io.to(followerSocketId).emit('user_came_online', {
              userId,
              username: user.username
            });
          }
        });

        console.log(`👤 User ${userId} is online`);
      } catch (error) {
        console.error('Error in user_online:', error);
      }
    });

    // Find match - add user to waiting queue
    socket.on('find_match', async (data) => {
      try {
        const { userId, filter } = data; // filter: 'free', 'male', 'female'
        
        const user = await User.findById(userId);
        
        // Check if premium required for gender filter
        if (filter !== 'free' && !user.isPremiumActive()) {
          socket.emit('match_error', {
            message: 'Premium subscription required for gender filtering'
          });
          return;
        }

        // Add to appropriate queue
        const queueKey = filter || 'free';
        
        // Check if user already in queue
        const inQueue = waitingQueue[queueKey].find(u => u.userId === userId);
        if (inQueue) {
          socket.emit('match_error', {
            message: 'Already searching for match'
          });
          return;
        }

        waitingQueue[queueKey].push({
          userId,
          socketId: socket.id,
          gender: user.gender,
          username: user.username,
          avatar: user.avatar,
          joinedAt: Date.now()
        });

        socket.emit('searching_match', {
          message: 'Searching for a match...',
          queuePosition: waitingQueue[queueKey].length
        });

        console.log(`🔍 User ${userId} searching in ${queueKey} queue`);

        // Try to find match
        tryMatchUsers(queueKey, io);
      } catch (error) {
        console.error('Error in find_match:', error);
        socket.emit('match_error', { message: error.message });
      }
    });

    // Cancel match search
    socket.on('cancel_match', (data) => {
      try {
        const { userId } = data;
        
        // Remove from all queues
        Object.keys(waitingQueue).forEach(key => {
          waitingQueue[key] = waitingQueue[key].filter(u => u.userId !== userId);
        });

        socket.emit('match_cancelled', {
          message: 'Search cancelled'
        });

        console.log(`❌ User ${userId} cancelled match search`);
      } catch (error) {
        console.error('Error in cancel_match:', error);
      }
    });

    // WebRTC Signaling
    socket.on('call_user', (data) => {
      const { to, offer, callId } = data;
      const toSocketId = activeUsers.get(to);
      
      if (toSocketId) {
        io.to(toSocketId).emit('incoming_call', {
          from: socket.userId,
          offer,
          callId
        });
      }
    });

    socket.on('answer_call', (data) => {
      const { to, answer, callId } = data;
      const toSocketId = activeUsers.get(to);
      
      if (toSocketId) {
        io.to(toSocketId).emit('call_answered', {
          from: socket.userId,
          answer,
          callId
        });
      }
    });

    socket.on('ice_candidate', (data) => {
      const { to, candidate } = data;
      const toSocketId = activeUsers.get(to);
      
      if (toSocketId) {
        io.to(toSocketId).emit('ice_candidate', {
          from: socket.userId,
          candidate
        });
      }
    });

    // Call started
    socket.on('call_started', async (data) => {
      try {
        const { callId, participants } = data;
        
        activeCalls.set(callId, {
          participants,
          startTime: Date.now()
        });

        // Update users in call status
        await Promise.all(participants.map(userId =>
          User.findByIdAndUpdate(userId, { inCall: true, currentMatch: null })
        ));

        console.log(`📞 Call started: ${callId}`);
      } catch (error) {
        console.error('Error in call_started:', error);
      }
    });

    // Call ended
    socket.on('call_ended', async (data) => {
      try {
        const { callId, participants } = data;
        
        const callData = activeCalls.get(callId);
        if (!callData) return;

        const duration = Math.floor((Date.now() - callData.startTime) / 1000); // in seconds
        
        // Save call history
        if (participants.length === 2) {
          await CallHistory.create({
            caller: participants[0],
            receiver: participants[1],
            duration,
            callType: 'video',
            startedAt: new Date(callData.startTime),
            endedAt: new Date()
          });

          // Create feed activity if call was significant (> 1 minute)
          if (duration > 60) {
            const user1 = await User.findById(participants[0]);
            const user2 = await User.findById(participants[1]);

            await Feed.create({
              user: participants[0],
              activityType: 'call_completed',
              description: `${user1.username} had a ${Math.floor(duration / 60)} minute call with ${user2.username}`,
              relatedUser: participants[1],
              metadata: { duration, callType: 'video' },
              isPublic: true
            });
          }
        }

        // Update users
        await Promise.all(participants.map(userId =>
          User.findByIdAndUpdate(userId, { inCall: false, currentMatch: null })
        ));

        // Notify both users about call end with duration
        participants.forEach(userId => {
          const userSocketId = activeUsers.get(userId);
          if (userSocketId) {
            io.to(userSocketId).emit('call_ended_confirmed', {
              duration,
              canFollow: duration >= 120 // Can follow if 2+ minutes
            });
          }
        });

        activeCalls.delete(callId);
        
        console.log(`📞 Call ended: ${callId}, Duration: ${duration}s`);
      } catch (error) {
        console.error('Error in call_ended:', error);
      }
    });

    // Send message via socket (real-time)
    socket.on('send_message', async (data) => {
      try {
        const { to, message, conversationId } = data;
        const toSocketId = activeUsers.get(to);
        
        if (toSocketId) {
          io.to(toSocketId).emit('receive_message', {
            from: socket.userId,
            message,
            conversationId,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Error in send_message:', error);
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { to } = data;
      const toSocketId = activeUsers.get(to);
      
      if (toSocketId) {
        io.to(toSocketId).emit('user_typing', {
          from: socket.userId
        });
      }
    });

    socket.on('stop_typing', (data) => {
      const { to } = data;
      const toSocketId = activeUsers.get(to);
      
      if (toSocketId) {
        io.to(toSocketId).emit('user_stop_typing', {
          from: socket.userId
        });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      try {
        const userId = socket.userId;
        
        if (userId) {
          // Remove from active users
          activeUsers.delete(userId);

          // Remove from waiting queues
          Object.keys(waitingQueue).forEach(key => {
            waitingQueue[key] = waitingQueue[key].filter(u => u.userId !== userId);
          });

          // Update user status
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            socketId: null
          });

          // Notify followers
          const user = await User.findById(userId).populate('followers');
          if (user && user.followers) {
            user.followers.forEach(follower => {
              const followerSocketId = activeUsers.get(follower._id.toString());
              if (followerSocketId) {
                io.to(followerSocketId).emit('user_went_offline', {
                  userId
                });
              }
            });
          }

          console.log(`❌ User ${userId} disconnected`);
        }
      } catch (error) {
        console.error('Error in disconnect:', error);
      }
    });
  });
};

// Helper function to match users
function tryMatchUsers(queueKey, io) {
  const queue = waitingQueue[queueKey];
  
  if (queue.length < 2) return;

  // Match first two users in queue
  const user1 = queue.shift();
  const user2 = queue.shift();

  // If gender filter is applied, check gender compatibility
  if (queueKey !== 'free') {
    if (queueKey === 'male' && user2.gender !== 'male') {
      queue.unshift(user2);
      queue.push(user1);
      return;
    }
    if (queueKey === 'female' && user2.gender !== 'female') {
      queue.unshift(user2);
      queue.push(user1);
      return;
    }
  }

  const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Notify both users about the match
  io.to(user1.socketId).emit('match_found', {
    matchedUser: {
      userId: user2.userId,
      username: user2.username,
      avatar: user2.avatar,
      gender: user2.gender
    },
    callId
  });

  io.to(user2.socketId).emit('match_found', {
    matchedUser: {
      userId: user1.userId,
      username: user1.username,
      avatar: user1.avatar,
      gender: user1.gender
    },
    callId
  });

  // Update users' current match
  User.findByIdAndUpdate(user1.userId, { currentMatch: user2.userId }).catch(console.error);
  User.findByIdAndUpdate(user2.userId, { currentMatch: user1.userId }).catch(console.error);

  console.log(`✅ Match found: ${user1.username} <-> ${user2.username}`);
}

