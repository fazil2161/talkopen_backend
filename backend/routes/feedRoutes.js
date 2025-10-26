const express = require('express');
const router = express.Router();
const {
  getFeed,
  getMyActivities,
  createFeedActivity,
  deleteFeedActivity
} = require('../controllers/feedController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFeed);
router.get('/my-activities', protect, getMyActivities);
router.post('/', protect, createFeedActivity);
router.delete('/:id', protect, deleteFeedActivity);

module.exports = router;

