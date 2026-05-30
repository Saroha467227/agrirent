const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Ensures password isn't returned in general queries
  },
  role: {
    type: String,
    enum: ['farmer', 'owner', 'admin'],
    default: 'farmer'
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordExpire: {
    type: Date,
    select: false,
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Generate and hash a password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate a random 32-byte hex token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the token and store it in the database
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expiry to 15 minutes from now
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  // Return the unhashed token (sent to the user)
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
