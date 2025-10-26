const Feed = require('../models/Feed');
const User = require('../models/User');

// @desc    Get user feed (following users' activities)
// @route   GET /api/feed
// @access  Private
exports.getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get activities from users that current user follows
    const feed = await Feed.find({
      $or: [
        { user: { $in: currentUser.following } },
        { user: req.user.id }
      ],
      isPublic: true
    })
      .populate('user', 'username avatar gender')
      .populate('relatedUser', 'username avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Feed.countDocuments({
      $or: [
        { user: { $in: currentUser.following } },
        { user: req.user.id }
      ],
      isPublic: true
    });

    res.status(200).json({
      success: true,
      count: feed.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      feed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's own activities
// @route   GET /api/feed/my-activities
// @access  Private
exports.getMyActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const activities = await Feed.find({ user: req.user.id })
      .populate('relatedUser', 'username avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Feed.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create manual feed activity
// @route   POST /api/feed
// @access  Private
exports.createFeedActivity = async (req, res) => {
  try {
    const { activityType, description, relatedUser, metadata, isPublic } = req.body;

    const activity = await Feed.create({
      user: req.user.id,
      activityType,
      description,
      relatedUser,
      metadata,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    const populatedActivity = await Feed.findById(activity._id)
      .populate('user', 'username avatar')
      .populate('relatedUser', 'username avatar');

    res.status(201).json({
      success: true,
      activity: populatedActivity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete feed activity
// @route   DELETE /api/feed/:id
// @access  Private
exports.deleteFeedActivity = async (req, res) => {
  try {
    const activity = await Feed.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    // Check if user owns this activity
    if (activity.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this activity'
      });
    }

    await activity.remove();

    res.status(200).json({
      success: true,
      message: 'Activity deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

