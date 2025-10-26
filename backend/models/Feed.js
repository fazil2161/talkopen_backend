const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    enum: ['call_completed', 'new_follow', 'premium_activated', 'streak_achieved'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  metadata: {
    duration: Number,
    streakCount: Number,
    callType: String
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
feedSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Feed', feedSchema);

