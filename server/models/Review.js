const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Booking',
    unique: true // Ensures one review per booking
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Equipment'
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment']
  }
}, {
  timestamps: true
});

// We want to calculate the average rating for the equipment every time a review is added
reviewSchema.statics.calculateAverageRating = async function(equipmentId) {
  const obj = await this.aggregate([
    { $match: { equipment: equipmentId } },
    { $group: { _id: '$equipment', averageRating: { $avg: '$rating' } } }
  ]);

  try {
    await this.model('Equipment').findByIdAndUpdate(equipmentId, {
      averageRating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0
    });
  } catch (error) {
    console.error(error);
  }
};

// Call calculateAverageRating after saving a review
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.equipment);
});

module.exports = mongoose.model('Review', reviewSchema);