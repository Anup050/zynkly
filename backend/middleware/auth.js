const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isVerified) {
    return next();
  }
  res.status(401).json({ message: 'Not authorized. Please log in and verify your email.' });
};

const ensureAuthForOtp = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Please log in with Google first.' });
};

const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ message: 'Not authorized as admin.' });
};

module.exports = { ensureAuth, ensureAuthForOtp, ensureAdmin };
