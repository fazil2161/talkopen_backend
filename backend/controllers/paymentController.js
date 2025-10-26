const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Feed = require('../models/Feed');

// Initialize Razorpay only if keys are provided
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('✅ Razorpay initialized successfully');
} else {
  console.log('⚠️  Razorpay keys not found - Payment features disabled');
}

// @desc    Create payment order
// @route   POST /api/payment/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service not available. Razorpay keys not configured.'
      });
    }

    const amount = parseInt(process.env.PREMIUM_PRICE) * 100; // Convert to paise

    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user.id,
        purpose: 'Premium Subscription'
      }
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      razorpayOrderId: order.id,
      amount: amount / 100,
      currency: 'INR',
      status: 'created'
    });

    res.status(200).json({
      success: true,
      order,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service not available. Razorpay keys not configured.'
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment record
      const payment = await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'success'
        },
        { new: true }
      );

      // Update user premium status
      const user = await User.findById(req.user.id);
      user.isPremium = true;
      
      // Set expiry to 30 days from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      user.premiumExpiresAt = expiryDate;
      
      await user.save();

      // Create feed activity
      await Feed.create({
        user: user._id,
        activityType: 'premium_activated',
        description: `${user.username} activated Premium subscription`,
        isPublic: true
      });

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment,
        user
      });
    } else {
      // Update payment as failed
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payment/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check premium status
// @route   GET /api/payment/premium-status
// @access  Private
exports.checkPremiumStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isPremiumActive = user.isPremiumActive();

    res.status(200).json({
      success: true,
      isPremium: isPremiumActive,
      expiresAt: user.premiumExpiresAt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

