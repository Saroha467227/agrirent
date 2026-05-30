const Equipment = require('../models/Equipment');

// @desc    Get all equipment (with optional filters)
// @route   GET /api/equipment
// @access  Public
const getEquipment = async (req, res) => {
  try {
    const { search, category, location, state, district, village, minPrice, maxPrice } = req.query;
    
    // Build query object
    const query = { isAvailable: true }; // Only show available equipment by default
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    if (category) {
      // Handle comma-separated categories if needed, or exact match
      query.category = { $in: category.split(',') };
    }
    
    if (state) {
      query['location.state'] = { $regex: state, $options: 'i' };
    }

    if (district) {
      query['location.district'] = { $regex: district, $options: 'i' };
    }

    if (village) {
      query['location.village'] = { $regex: village, $options: 'i' };
    }

    // Fallback if frontend still sends generic "location" query
    if (location && !state && !district && !village) {
      query.$or = [
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.district': { $regex: location, $options: 'i' } },
        { 'location.village': { $regex: location, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    // The .populate() method replaces the 'owner' ID with the actual user's name and email!
    const equipment = await Equipment.find(query).populate('owner', 'name email phone');
    
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single equipment by ID
// @route   GET /api/equipment/:id
// @access  Public
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate('owner', 'name email phone');
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new equipment listing
// @route   POST /api/equipment
// @access  Private (Owner/Admin only)
const createEquipment = async (req, res) => {
  try {
    const { title, description, category, pricePerDay, location } = req.body;

    if (!title || !description || !category || !pricePerDay || !location || !location.state || !location.district || !location.village) {
      return res.status(400).json({ message: 'Please provide all required fields including state, district, and village' });
    }

    // Extract the Cloudinary URLs from the uploaded files
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path);
    }

    // Create the equipment in the database
    const equipment = await Equipment.create({
      owner: req.user._id, // Gotten from the 'protect' middleware
      title,
      description,
      category,
      pricePerDay,
      location,
      images: imageUrls, // Saves the real Cloudinary URLs
    });

    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEquipment,
  getEquipmentById,
  createEquipment,
};
