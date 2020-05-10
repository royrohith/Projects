const express = require('express');
const {ensureAuthenticated} = require('../config/auth');

const router = express.Router();

//Index page for chatapp
router.get('/', (req, res) => {
    res.render('welcome');
});

let name;
//chatapp index after login
router.get('/index', ensureAuthenticated, (req, res) => {
    name = req.user.name;
    res.render('index', {name});
});

//chatapp
router.get('/chat', (req, res) => {
    res.render('chat', {name});
});

module.exports = router;
