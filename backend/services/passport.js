// Google OAuth Configuration
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var authConfig = require("../config");

passport.serializeUser((user, done) => {
    done(null, user.id);
})
passport.deserializeUser((id, done) => {
    done(null, id);
})

passport.use(new GoogleStrategy(
    authConfig.google,
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile)
    }
));
