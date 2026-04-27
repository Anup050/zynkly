const User = require('../models/User');
const otpGenerator = require('otp-generator');
const { sendOtpEmail } = require('../utils/email');
const passport = require('passport');

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

exports.googleAuth = (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontend}/login?error=Google+OAuth+not+configured`);
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

exports.googleCallback = (req, res, next) => {
  const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${frontend}/login?error=Google+OAuth+not+configured`);
  }
  passport.authenticate('google', { failureRedirect: `${frontend}/login` }, async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect(`${frontend}/login`);

    req.logIn(user, async (err) => {
      if (err) return next(err);

      if (!user.isVerified) {
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();
        try {
          await sendOtpEmail(user.email, otp);
        } catch (e) {
          console.error('Send OTP email error:', e);
        }
        return res.redirect(`${frontend}/verify-email`);
      }

      res.redirect(`${frontend}/`);
    });
  })(req, res, next);
};

/** Send OTP to manually entered email (no Google). Creates/finds user by email. */
exports.sendOtpToEmail = async (req, res) => {
  const { email } = req.body;
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      user = await User.create({ email: normalizedEmail });
    }

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    user.otp = otp;
    user.otpExpires = Date.now() + OTP_EXPIRY_MS;
    await user.save();

    try {
      await sendOtpEmail(user.email, otp);
    } catch (e) {
      console.error('Send OTP email error:', e);
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/** Verify OTP: (1) with session = Google user verifying; (2) with email+otp = manual email login. */
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    let user;

    if (email && otp) {
      // Manual email flow: find by email and verify OTP
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email.' });
      }
      user = await User.findOne({ email: email.trim().toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: 'No account found for this email.' });
      }
    } else if (req.isAuthenticated() && req.user && otp) {
      // Google flow: session user verifying OTP
      user = req.user;
    } else {
      return res.status(400).json({ message: 'Provide email and OTP, or log in with Google first and then OTP.' });
    }

    if (user.otp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // For manual email flow, log the user in and send response inside callback
    if (!req.isAuthenticated() || req.user._id.toString() !== user._id.toString()) {
      return req.login(user, (err) => {
        if (err) return res.status(500).json({ message: 'Login failed.' });
        res.status(200).json({
          message: 'Email verified successfully.',
          user: { _id: user._id, email: user.email, name: user.name, isVerified: user.isVerified, isAdmin: user.isAdmin },
        });
      });
    }
    res.status(200).json({
      message: 'Email verified successfully.',
      user: { _id: user._id, email: user.email, name: user.name, isVerified: user.isVerified, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/** Resend OTP: (1) with session = current user; (2) with email = manual flow. */
exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    let user;
    if (email && isValidEmail(email)) {
      user = await User.findOne({ email: email.trim().toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: 'No account found for this email.' });
      }
    } else if (req.isAuthenticated() && req.user) {
      user = req.user;
    } else {
      return res.status(400).json({ message: 'Provide your email or log in first.' });
    }

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    user.otp = otp;
    user.otpExpires = Date.now() + OTP_EXPIRY_MS;
    await user.save();
    await sendOtpEmail(user.email, otp);
    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed.' });
    req.session.destroy(() => {
      res.status(200).json({ message: 'Logged out.' });
    });
  });
};

exports.getMe = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }
  const u = req.user;
  res.status(200).json({
    user: {
      _id: u._id,
      email: u.email,
      name: u.name,
      isVerified: u.isVerified,
      isAdmin: u.isAdmin,
      mobileNumber: u.mobileNumber,
    },
  });
};
