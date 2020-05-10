const moment = require('moment');

const users = [];
 
//format messages 
function userMessages(name, text) {
     return {
         name,
         text,
         time: moment().format('h:mm a')
     }
    
};

//create user array when user joins
function userJoin(id, name, room) {
    const user = {
        id,
        name,
        room
    };
    users.push(user);
    return user;  
};

//return user corresponding to id
function getCurrentUser(id) {
    return users.find((user) => user.id === id);
};

//return users in a given room
function roomUsers(room) {
    return users.filter((user) => user.room === room);
};

//remove user corresponding to id
function userLeave(id) {
    const index = users.findIndex((user) => user.id === id);
    return users.splice(index, 1)[0];    
}

module.exports = {
    userMessages,
    userJoin,
    getCurrentUser,
    roomUsers,
    userLeave
};