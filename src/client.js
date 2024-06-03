

const socket = io('http://localhost:8080');

const tokenSubmitButton = document.getElementById('tokenSubmitButton');
const recipientSelect = document.getElementById('recipientSelect');
const messageInput = document.getElementById('messageInput');
const messageContainer = document.getElementById('messageContainer');
const memberList = document.getElementById('memberList');

tokenSubmitButton.addEventListener('click', () => {
    const token = document.getElementById('tokenInput').value;
    console.log('Token submitted:', token);

    socket.emit("new-user-joined", "123456")
});

const sendButton = document.getElementById('sendButton');
var audio = new Audio('sound.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
}

sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    const receiverId = "123457";
    const senderId = "123456";
    console.log('Message:', message);
    console.log('Receiver ID:', receiverId);
    console.log('Token:', senderId);
    if (receiverId && senderId) {
        append(`you: ${message}`, 'right');
        socket.emit('send', { senderId, receiverId, message });
        messageInput.value = "";
    } else {
        alert("Please select a recipient and enter a token.");
    }
});

socket.on('receive', (data) => {
    console.log('jsnsaksanks', data)
    append(`${data.sender}: ${data.message}`, 'left');
});
