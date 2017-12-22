const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id })
        .then(existingUser => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              imageURL: profile.photos[0].value,
              gender: profile.gender
            }).save()
              .then(user => done(null, user));
          }
        });
    }
  )
);
