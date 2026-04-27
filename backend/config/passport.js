const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          const newUser = {
            gmailId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          };

          try {
            let user = await User.findOne({ gmailId: profile.id });
            if (user) {
              return done(null, user);
            }
            const email = profile.emails[0].value;
            user = await User.findOne({ email });
            if (user) {
              user.gmailId = profile.id;
              user.name = user.name || profile.displayName;
              await user.save();
              return done(null, user);
            }
            user = await User.create(newUser);
            done(null, user);
          } catch (err) {
            done(err, null);
          }
        }
      )
    );
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
