//Initialise client side socket
const socket = io();

//get username from chat.ejs
let username = document.querySelector('#username').innerText;

const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.querySelector('#chat-form');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

//parse roomname from url
let {room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

socket.emit('joinChatRoom', {username, room});

socket.on('appMessage', msg => {
    outputAppMessage(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('userMessage', msg => {
    OutputUserMessage(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('roomUsers', ({room, users}) => {
    OutputRoom(room);
    OutputUsers(users);
})

chatForm.addEventListener('submit', e => {
    e.preventDefault();
//target element with id 'msg' ie the message
    const message = e.target.elements.msg.value;
    
    socket.emit('chatMessage', message);
//Clear fields and return focus
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});



function outputAppMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('app-message');
    div.innerHTML = `<p>${msg}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function OutputUserMessage(msg) {

    const div = document.createElement('div');
    div.classList.add('user-message');
    div.innerHTML = `<p class="meta">${msg.name} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);   
};

function OutputRoom(room) {
    roomName.innerText = room;
};

function OutputUsers(users) {
    userList.innerHTML = `${users.map(user =>`<li>${user.name}</li>`).join('')}`;
};



