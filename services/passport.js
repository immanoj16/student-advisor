const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const Schema = mongoose.model('users');

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile.id);
      console.log(profile.displayName);
      console.log(profile.photos[0].value);
      console.log(profile.gender);
      console.log(profile.emails[0].value);
      // console.log(profile._json.image.url);
      new Schema({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        imageURL: profile.photos[0].value,
        gender: profile.gender
      }).save();
    }
  )
);
