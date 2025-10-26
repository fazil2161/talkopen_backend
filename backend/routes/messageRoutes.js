const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getAllConversations,
  deleteMessage,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getAllConversations);
router.get('/conversation/:id', protect, getConversation);
router.get('/unread-count', protect, getUnreadCount);
router.post('/:id', protect, sendMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;

