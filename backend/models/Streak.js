const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: null
  },
  dailyCallTime: {
    type: Number, // in seconds
    default: 0
  },
  weeklyHistory: [{
    date: {
      type: Date,
      required: true
    },
    callTime: {
      type: Number, // in seconds
      required: true
    },
    achieved: {
      type: Boolean,
      default: false // true if >= 5 minutes
    }
  }],
  totalCallsMade: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Method to update streak
streakSchema.methods.updateStreak = function(callDuration) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = this.lastActiveDate ? new Date(this.lastActiveDate) : null;
  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
  }
  
  // Add to daily call time
  this.dailyCallTime += callDuration;
  
  // Check if it's a new day
  if (!lastActive || lastActive.getTime() !== today.getTime()) {
    // Check if yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastActive && lastActive.getTime() === yesterday.getTime()) {
      // Continue streak if daily goal was met yesterday
      const yesterdayEntry = this.weeklyHistory.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === yesterday.getTime();
      });
      
      if (yesterdayEntry && yesterdayEntry.achieved) {
        this.currentStreak += 1;
      } else {
        this.currentStreak = 0;
      }
    } else if (!lastActive || (today.getTime() - lastActive.getTime()) > 86400000) {
      // More than a day gap, reset streak
      this.currentStreak = 0;
    }
    
    this.dailyCallTime = callDuration;
  }
  
  // Update longest streak
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  // Check if daily goal achieved (5 minutes = 300 seconds)
  const achieved = this.dailyCallTime >= 300;
  
  // Update weekly history
  const todayEntry = this.weeklyHistory.find(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  if (todayEntry) {
    todayEntry.callTime = this.dailyCallTime;
    todayEntry.achieved = achieved;
  } else {
    this.weeklyHistory.push({
      date: today,
      callTime: this.dailyCallTime,
      achieved: achieved
    });
  }
  
  // Keep only last 7 days
  if (this.weeklyHistory.length > 7) {
    this.weeklyHistory = this.weeklyHistory.slice(-7);
  }
  
  this.lastActiveDate = new Date();
  this.totalCallsMade += 1;
  
  return this.save();
};

module.exports = mongoose.model('Streak', streakSchema);

