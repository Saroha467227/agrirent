const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extract the token from the header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user in the database by the ID inside the token
      // We use .select('-password') to ensure we don't accidentally pass the password around
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Move on to the actual route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is found at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };