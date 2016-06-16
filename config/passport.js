var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/user.js');
var configAuth = require('./auth.js');

var crypto = require('crypto');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){    
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('HUI');
      User.findOne({ username: username }, function (err, user) {
        console.log('HUI');
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!password) { return done(null, false); }
        if (user.username == user.google.email) { return done(null, false); }
        if (!user.verifyPassword(crypto.createHash('md5').update(password).digest("hex"))) { return done(null, false); } 
          console.log('au!!');
        return done(null, user);
      });
    }
  ));

  passport.use(new GoogleStrategy({
    clientID    : configAuth.googleAuth.clientID,
    clientSecret  : configAuth.googleAuth.clientSecret,
    callbackURL    : configAuth.googleAuth.callbackURL,
  },
  function(token, refreshToken, profile, done) {

    process.nextTick(function(){
      User.findOne({ 'google.id' : profile.id }, function(err, user) {
        if (err)
          return done(err);

        if (user){
          return done(null, user);
        } else {
          var newUser   = new User();
          newUser.google.id = profile.id;
          newUser.google.token = token;
          newUser.google.name = profile.displayName;
          // newUser.google.email = profile.email[0].value;
          newUser.username = profile.displayName;
              console.log('ya tut', profile);
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));
};
