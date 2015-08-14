var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

//Passport is authentication middleware for Node.js. It can be put in any Express-based web application and handles authentication using username, password, Facebook, Twitter, etc.

passport.use(new LocalStrategy(
    function(username, password, done){
        User.findOne({username:username}, function (err, user){
            if (err) { return done(err); }
            if (!user) { return done(null, false, {message: 'Incorrect username'}); }
            if (!user.validPassword(password)) { return done(null, false, {message: 'Incorrect password.'}); }
            return done(null, user)
        });
    }
));
