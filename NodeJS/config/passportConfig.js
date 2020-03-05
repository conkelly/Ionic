var passport = require('passport'); 
const localStrategy = require('passport-local').Strategy; 
const mongoose = require('mongoose');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
//var ClientJWTBearerStrategy = require('passport-oauth2-jwt-bearer').Strategy;

var User = mongoose.model('User');

passport.use(
    new localStrategy({usernameField: 'fullName'}, 
    (username, password, done) => {
        User.findOne({ fullName: username }, 
            (err,user) => { 
                if (err)
                    return done(err); 
                else if (!user)
                    return done(null, false, {message: 'Name is not registered'}); 
                else if (!user.verifyPassword(password))
                    return done(null,false, {message: 'Wrong password.'});
                else 
                    return done(null, user);
            
                });}));

passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'your_jwt_secret'
    },
    function (jwtPayload, cb) {
        console.log(User.findOneById(jwtPayload.id));
        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return User.findOneById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));