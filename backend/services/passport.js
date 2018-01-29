// Google OAuth Configuration
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var authConfig = require("../config");
var mongoose = require('mongoose');

const Users = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    Users.findById(id)
         .then((user) => {
             done(null, user);
         })
})

passport.use(new GoogleStrategy(
    authConfig.google,
    function (accessToken, refreshToken, profile, done) {
        Users.findOne({googleId : profile.id})
            .then((existingUser) => {
                if (existingUser) {
                    return done(null, existingUser);
                } else {
                    new Users({googleId : profile.id}).save()
                        .then((user) => {
                            return done(null, user);
                        })
                }
            }); 
    }
));
