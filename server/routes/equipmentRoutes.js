const express = require('express');
const router = express.Router();
const { getEquipment, getEquipmentById, createEquipment } = require('../controllers/equipmentController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinaryConfig'); // <-- Import the upload config

// Route for getting all equipment (Public)
router.get('/', getEquipment);
router.get('/:id', getEquipmentById);

// Route for creating equipment
// We add 'upload.array('images', 5)' so a user can upload up to 5 images
router.post('/', protect, upload.array('images', 5), createEquipment);

module.exports = router;