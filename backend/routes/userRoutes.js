const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  updateSettings,
  blockUser,
  reportUser,
  getOnlineUsers
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/online', protect, getOnlineUsers);
router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/settings', protect, updateSettings);
router.post('/block/:id', protect, blockUser);
router.post('/report/:id', protect, reportUser);

module.exports = router;

