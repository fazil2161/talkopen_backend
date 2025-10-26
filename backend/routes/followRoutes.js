const express = require('express');
const router = express.Router();
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  canChat
} = require('../controllers/followController');
const { protect } = require('../middleware/auth');

router.get('/followers', protect, getFollowers);
router.get('/following', protect, getFollowing);
router.get('/can-chat/:id', protect, canChat);
router.post('/:id', protect, followUser);
router.delete('/:id', protect, unfollowUser);

module.exports = router;

