const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  googleLogin,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/google', googleLogin);

module.exports = router;
