// Connect to the server using socket.io
const socket = io('http://localhost:8000');

// Get references to HTML elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('solo.mp3');

// Function to append a message to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    
    // Play a sound for incoming messages if the position is 'right'
    if (position == 'right') {
        audio.play();
    }
}

// Event listener for message submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Prompt the user to enter their name
const uname = prompt("Enter your name to join:");
socket.emit('new-user-joined', uname);

// Event handlers for socket.io events
socket.on('user-joined', uname => {
    append(`${uname} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.uname}: ${data.message}`, 'left');
});

socket.on('left', uname => {
    append(`${uname} left the chat`, 'left');
});
