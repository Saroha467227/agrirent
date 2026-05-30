const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, totalPrice } = req.body;

    if (!equipmentId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: 'Please provide all booking details' });
    }

    // Find the equipment so we know who the owner is
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Create the booking
    const booking = await Booking.create({
      equipment: equipmentId,
      renter: req.user._id,      // The person making the request (from JWT token)
      owner: equipment.owner,    // The person who owns the equipment
      startDate,
      endDate,
      totalPrice,
      status: 'pending'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's bookings (as either renter or owner)
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    // Find bookings where the user is EITHER the renter OR the owner
    const bookings = await Booking.find({
      $or: [{ renter: req.user._id }, { owner: req.user._id }]
    }).populate('equipment', 'title images pricePerDay'); // Pulls in equipment details

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Confirm or Cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // Expects 'confirmed', 'cancelled', or 'completed'
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Security check: Only the renter or owner can modify this booking
    if (booking.owner.toString() !== req.user._id.toString() && booking.renter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus
};
