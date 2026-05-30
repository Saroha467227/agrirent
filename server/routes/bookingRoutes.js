const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking routes should be protected (user must be logged in)
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;