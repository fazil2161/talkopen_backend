const Streak = require('../models/Streak');
const Feed = require('../models/Feed');
const User = require('../models/User');

// @desc    Get user's streak
// @route   GET /api/streaks
// @access  Private
exports.getStreak = async (req, res) => {
  try {
    let streak = await Streak.findOne({ user: req.user.id });

    if (!streak) {
      // Create streak if doesn't exist
      streak = await Streak.create({ user: req.user.id });
    }

    res.status(200).json({
      success: true,
      streak
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update streak after call
// @route   POST /api/streaks/update
// @access  Private
exports.updateStreak = async (req, res) => {
  try {
    const { callDuration } = req.body; // in seconds

    let streak = await Streak.findOne({ user: req.user.id });

    if (!streak) {
      streak = await Streak.create({ user: req.user.id });
    }

    const previousStreak = streak.currentStreak;
    await streak.updateStreak(callDuration);

    // Check if new streak milestone achieved
    if (streak.currentStreak > previousStreak && streak.currentStreak % 7 === 0) {
      const user = await User.findById(req.user.id);
      
      // Create feed activity for streak milestone
      await Feed.create({
        user: user._id,
        activityType: 'streak_achieved',
        description: `${user.username} achieved ${streak.currentStreak} day streak!`,
        metadata: { streakCount: streak.currentStreak },
        isPublic: true
      });
    }

    res.status(200).json({
      success: true,
      streak
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/streaks/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const streaks = await Streak.find()
      .populate('user', 'username avatar gender')
      .sort('-currentStreak -longestStreak')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: streaks.length,
      leaderboard: streaks.map((s, index) => ({
        rank: index + 1,
        user: s.user,
        currentStreak: s.currentStreak,
        longestStreak: s.longestStreak,
        totalCallsMade: s.totalCallsMade
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get weekly stats
// @route   GET /api/streaks/weekly
// @access  Private
exports.getWeeklyStats = async (req, res) => {
  try {
    const streak = await Streak.findOne({ user: req.user.id });

    if (!streak) {
      return res.status(404).json({
        success: false,
        message: 'Streak not found'
      });
    }

    res.status(200).json({
      success: true,
      weeklyHistory: streak.weeklyHistory,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

