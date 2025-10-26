const User = require('../models/User');
const Streak = require('../models/Streak');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get streak info
    const streak = await Streak.findOne({ user: user._id });

    res.status(200).json({
      success: true,
      user,
      streak
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio, interests, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, bio, interests, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    const { notifications, showOnlineStatus } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        settings: {
          notifications,
          showOnlineStatus
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Block user
// @route   POST /api/users/block/:id
// @access  Private
exports.blockUser = async (req, res) => {
  try {
    const userToBlock = req.params.id;

    if (userToBlock === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot block yourself'
      });
    }

    const user = await User.findById(req.user.id);

    if (user.blockedUsers.includes(userToBlock)) {
      return res.status(400).json({
        success: false,
        message: 'User already blocked'
      });
    }

    user.blockedUsers.push(userToBlock);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User blocked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Report user
// @route   POST /api/users/report/:id
// @access  Private
exports.reportUser = async (req, res) => {
  try {
    const userToReport = req.params.id;
    const { reason } = req.body;

    if (userToReport === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot report yourself'
      });
    }

    const user = await User.findById(req.user.id);

    user.reportedUsers.push({
      userId: userToReport,
      reason,
      date: new Date()
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User reported successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get online users for matching
// @route   GET /api/users/online
// @access  Private
exports.getOnlineUsers = async (req, res) => {
  try {
    const { gender } = req.query;
    const currentUser = await User.findById(req.user.id);

    let query = {
      _id: { $ne: req.user.id },
      isOnline: true,
      inCall: false,
      blockedUsers: { $nin: [req.user.id] }
    };

    // Check if user has premium and requesting gender filter
    if (gender && gender !== 'free') {
      if (!currentUser.isPremiumActive()) {
        return res.status(403).json({
          success: false,
          message: 'Premium subscription required for gender filtering'
        });
      }
      query.gender = gender;
    }

    const users = await User.find(query)
      .select('username gender age avatar interests')
      .limit(20);

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

