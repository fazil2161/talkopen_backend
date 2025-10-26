const Message = require('../models/Message');
const User = require('../models/User');
const Follow = require('../models/Follow');

// Generate conversation ID between two users
const getConversationId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

// @desc    Send message
// @route   POST /api/messages/:id
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { content, messageType } = req.body;
    const receiverId = req.params.id;

    // Check if users can chat (must be following each other or have premium)
    const currentUser = await User.findById(req.user.id);
    
    const canChat = currentUser.isPremiumActive() || 
                   await Follow.findOne({
                     follower: req.user.id,
                     following: receiverId,
                     isMutual: true
                   });

    if (!canChat) {
      return res.status(403).json({
        success: false,
        message: 'Cannot send messages. Users must follow each other or have premium subscription'
      });
    }

    const conversationId = getConversationId(req.user.id, receiverId);

    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
      messageType: messageType || 'text',
      conversationId
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar');

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get conversation between two users
// @route   GET /api/messages/conversation/:id
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.id;
    const conversationId = getConversationId(req.user.id, otherUserId);

    const messages = await Message.find({ conversationId })
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar')
      .sort('createdAt');

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiver: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all conversations
// @route   GET /api/messages/conversations
// @access  Private
exports.getAllConversations = async (req, res) => {
  try {
    // Get all unique conversation partners
    const sentMessages = await Message.find({ sender: req.user.id }).distinct('receiver');
    const receivedMessages = await Message.find({ receiver: req.user.id }).distinct('sender');
    
    const conversationPartners = [...new Set([...sentMessages, ...receivedMessages])];

    const conversations = await Promise.all(
      conversationPartners.map(async (partnerId) => {
        const conversationId = getConversationId(req.user.id, partnerId.toString());
        
        // Get last message
        const lastMessage = await Message.findOne({ conversationId })
          .sort('-createdAt')
          .populate('sender', 'username avatar')
          .populate('receiver', 'username avatar');

        // Get unread count
        const unreadCount = await Message.countDocuments({
          conversationId,
          receiver: req.user.id,
          isRead: false
        });

        // Get partner info
        const partner = await User.findById(partnerId)
          .select('username avatar isOnline');

        return {
          partner,
          lastMessage,
          unreadCount,
          conversationId
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    });

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await message.remove();

    res.status(200).json({
      success: true,
      message: 'Message deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

