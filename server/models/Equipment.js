const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  // This links the equipment directly to a specific user in our database
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add an equipment title (e.g., John Deere Tractor)']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Tractor', 'Harvester', 'Plow', 'Seeder', 'Other']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Please add a rental price per day']
  },
  location: {
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    district: {
      type: String,
      required: [true, 'Please add a district']
    },
    village: {
      type: String,
      required: [true, 'Please add a village or city area']
    }
  },
  images: [
    {
      type: String,
      required: [true, 'Please add at least one image URL']
    }
  ],
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Equipment', equipmentSchema);