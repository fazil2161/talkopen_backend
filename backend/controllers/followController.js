const Follow = require('../models/Follow');
const User = require('../models/User');
const Feed = require('../models/Feed');

// @desc    Follow a user (after 2+ minute call)
// @route   POST /api/follows/:id
// @access  Private
exports.followUser = async (req, res) => {
  try {
    const { metDuration } = req.body;
    const userToFollow = req.params.id;

    // Check if trying to follow self
    if (userToFollow === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot follow yourself'
      });
    }

    // Check if call duration was at least 2 minutes (120 seconds)
    if (metDuration < 120) {
      return res.status(400).json({
        success: false,
        message: 'Need at least 2 minutes of call to follow'
      });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.user.id,
      following: userToFollow
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: 'Already following this user'
      });
    }

    // Create follow relationship
    const follow = await Follow.create({
      follower: req.user.id,
      following: userToFollow,
      metDuration,
      metAt: new Date()
    });

    // Update user's following list
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { following: userToFollow }
    });

    // Update followed user's followers list
    await User.findByIdAndUpdate(userToFollow, {
      $addToSet: { followers: req.user.id }
    });

    // Check if mutual follow
    const reverseFollow = await Follow.findOne({
      follower: userToFollow,
      following: req.user.id
    });

    if (reverseFollow) {
      follow.isMutual = true;
      reverseFollow.isMutual = true;
      await follow.save();
      await reverseFollow.save();
    }

    // Create feed activity
    const currentUser = await User.findById(req.user.id);
    const followedUser = await User.findById(userToFollow);
    
    await Feed.create({
      user: req.user.id,
      activityType: 'new_follow',
      description: `${currentUser.username} started following ${followedUser.username}`,
      relatedUser: userToFollow,
      isPublic: true
    });

    res.status(201).json({
      success: true,
      follow,
      isMutual: follow.isMutual
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/follows/:id
// @access  Private
exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = req.params.id;

    // Delete follow relationship
    await Follow.findOneAndDelete({
      follower: req.user.id,
      following: userToUnfollow
    });

    // Update user's following list
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: userToUnfollow }
    });

    // Update unfollowed user's followers list
    await User.findByIdAndUpdate(userToUnfollow, {
      $pull: { followers: req.user.id }
    });

    // Update mutual status for reverse follow if exists
    const reverseFollow = await Follow.findOne({
      follower: userToUnfollow,
      following: req.user.id
    });

    if (reverseFollow) {
      reverseFollow.isMutual = false;
      await reverseFollow.save();
    }

    res.status(200).json({
      success: true,
      message: 'Unfollowed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's followers
// @route   GET /api/follows/followers
// @access  Private
exports.getFollowers = async (req, res) => {
  try {
    const follows = await Follow.find({ following: req.user.id })
      .populate('follower', 'username avatar gender age isOnline')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: follows.length,
      followers: follows.map(f => ({
        ...f.follower._doc,
        isMutual: f.isMutual,
        metDuration: f.metDuration,
        metAt: f.metAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's following
// @route   GET /api/follows/following
// @access  Private
exports.getFollowing = async (req, res) => {
  try {
    const follows = await Follow.find({ follower: req.user.id })
      .populate('following', 'username avatar gender age isOnline')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: follows.length,
      following: follows.map(f => ({
        ...f.following._doc,
        isMutual: f.isMutual,
        metDuration: f.metDuration,
        metAt: f.metAt
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if users can chat (mutual follow or premium)
// @route   GET /api/follows/can-chat/:id
// @access  Private
exports.canChat = async (req, res) => {
  try {
    const otherUserId = req.params.id;
    const currentUser = await User.findById(req.user.id);

    // Check if premium
    if (currentUser.isPremiumActive()) {
      return res.status(200).json({
        success: true,
        canChat: true,
        reason: 'premium'
      });
    }

    // Check if mutual follow
    const follow = await Follow.findOne({
      follower: req.user.id,
      following: otherUserId,
      isMutual: true
    });

    res.status(200).json({
      success: true,
      canChat: !!follow,
      reason: follow ? 'mutual_follow' : 'none'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

