const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io')
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const {userMessages, userJoin, getCurrentUser, roomUsers, userLeave} = require('./utils/utils')

//Initialize express
const app = express();

//Passport config
require('./config/passport')(passport);

//Server for socket
const server = http.createServer(app);
const io = socketio(server);

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Connect to db
const db = 'mongodb+srv://<username>:<password>@mycluster-quacc.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(db, {useUnifiedTopology: true, useNewUrlParser: true})
.then(() => console.log('Mongodb Connected'))
.catch(err => console.log(err));

//EJS Middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser Middleware
app.use(express.urlencoded({ extended: false}));

//Session Middleware
app.use(session({             //available in github repository
    secret: 'secret',         
    resave: true,             
    saveUninitialized: true,
    }));

//Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());    

//Flash Middleware
app.use(flash());

//Set Global variables Middleware for flash message
app.use((req, res, next) => { 
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));



//Socket events
io.on('connection', socket => {
    socket.on('joinChatRoom', ({username, room}) => {
        //pass arguements to userarray
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.broadcast.to(user.room).emit('appMessage', `${user.name} has joined the chat`);
        io.to(user.room).emit('roomUsers', {room: user.room, users: roomUsers(user.room)});
    });
    socket.on('chatMessage', msg => {
        let user = getCurrentUser(socket.id);
        io.to(user.room).emit('userMessage', userMessages(user.name, msg));
    });
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
        socket.to(user.room).emit('appMessage', `${user.name} has left the chat`);
        io.to(user.room).emit('roomUsers', {room: user.room, users: roomUsers(user.room)});
        }
    })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running in PORT ${PORT}`));
