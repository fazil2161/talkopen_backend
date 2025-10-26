const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metDuration: {
    type: Number, // in seconds
    required: true
  },
  metAt: {
    type: Date,
    default: Date.now
  },
  isMutual: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);

