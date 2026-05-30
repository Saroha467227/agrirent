const Razorpay = require('razorpay');
const crypto = require('crypto'); // Built into Node.js, no installation needed
const Booking = require('../models/Booking');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({ message: 'Amount and Booking ID are required' });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in smaller units (paise)
      currency: 'INR',
      receipt: `receipt_booking_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // 1. Create the expected signature using your secret key
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // 2. Compare the signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // 3. If authentic, update the booking status to 'confirmed'
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'confirmed' },
        { new: true }
      );

      res.json({ message: 'Payment verified successfully', booking });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
