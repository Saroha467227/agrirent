const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide all review details' });
    }

    // 1. Check if the booking exists and belongs to the logged-in user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.renter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'You can only review your own bookings' });
    }

    // 2. Check if the booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed bookings' });
    }

    // 3. Create the review
    const review = await Review.create({
      booking: bookingId,
      reviewer: req.user._id,
      equipment: booking.equipment,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    // Handle the unique constraint error if they try to review the same booking twice
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for specific equipment
// @route   GET /api/reviews/:equipmentId
// @access  Public
const getEquipmentReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ equipment: req.params.equipmentId })
      .populate('reviewer', 'name')
      .sort('-createdAt'); // Newest first

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getEquipmentReviews
};
