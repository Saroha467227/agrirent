const express = require('express');
const router = express.Router();
const { createReview, getEquipmentReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/:equipmentId', getEquipmentReviews);

module.exports = router;