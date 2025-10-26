const express = require('express');
const router = express.Router();
const {
  getStreak,
  updateStreak,
  getLeaderboard,
  getWeeklyStats
} = require('../controllers/streakController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getStreak);
router.post('/update', protect, updateStreak);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/weekly', protect, getWeeklyStats);

module.exports = router;

