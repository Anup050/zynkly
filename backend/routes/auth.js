const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.post('/send-otp', authController.sendOtpToEmail);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.get('/logout', authController.logout);
router.get('/me', authController.getMe);

module.exports = router;
