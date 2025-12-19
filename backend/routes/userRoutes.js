const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  updateSettings,
  blockUser,
  reportUser,
  getOnlineUsers,
  changePassword,
  unblockUser,
  getBlockedUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/online', protect, getOnlineUsers);
router.get('/blocked-users', protect, getBlockedUsers);
router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/settings', protect, updateSettings);
router.put('/change-password', protect, changePassword);
router.post('/block/:id', protect, blockUser);
router.post('/unblock', protect, unblockUser);
router.post('/report/:id', protect, reportUser);

module.exports = router;

