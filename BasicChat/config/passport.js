const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../model/User');

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField : 'email'}, (email, password, done) => {
        
        //Match email
        User.findOne({ email: email })
        .then((user) => {
            if(!user) {
                return done(null, false, {message: 'User not registered'});
            }

            //Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;

                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Password is Incorrect'});
                }
                
            })
        })
        .catch(err => console.log(err));
    }));

    //Serialize user
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}
