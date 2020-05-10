const express = require('express');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Router initialisation
const router = express.Router();

//Get Requests

//Login
router.get('/login', (req, res) => {
    res.render('login');
});

//Register
router.get('/register', (req, res) => {
    res.render('register');
});

//Post Requests

//Register
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    const err = [];

    //Validation
    if(!name || !email || !password || !password2) {
        err.push({msg: 'Please fill all fields'});
    } 
    if(password.length <= 5) {
        err.push({msg: 'Password should contain atleast 6 characters'});
    }
    if(password !== password2) {
        err.push({msg: 'Passwords dont match'});
    }

    if(err.length > 0) {
        res.render('register', {
            err,
            name,
            email,
            password,
            password2
        }) 
    } else {
            User.findOne({ email: email })
            .then((user) => {
                if(user) {
                    err.push({msg: 'User already registered'});
                    res.render('register', {
                        err,
                        name, 
                        email,
                        password,
                        password2
                    })
                } else {
                    //Create Instance
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //Encrypt password
                    bcrypt.genSalt(10, (err, salt) => {
                        if(err) throw err
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err
                            newUser.password = hash;

                            //Save to DB
                            newUser.save()
                            .then((user) => {
                                req.flash('success_msg', 'Registered Successfully');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                        })
                    })

                } 
            })
            .catch(err => console.log(error))
        }
    


});

//Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout 
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged Out Successfully')
    res.redirect('/users/login');
})



module.exports = router;