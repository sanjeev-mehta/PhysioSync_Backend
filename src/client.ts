import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:8080');

const form: HTMLFormElement = document.getElementById('send-container') as HTMLFormElement;
const messageInput: HTMLInputElement = document.getElementById('messageInp') as HTMLInputElement;
const messageContainer: HTMLElement = document.querySelector(".container") as HTMLElement;
const audio: HTMLAudioElement = new Audio('sound.mp3');

const append = (message: string, position: string) => {
    const messageElement: HTMLDivElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message: string = messageInput.value;
    append(`you: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = "";
});

const name: string | null = prompt("Enter your name");
if (name) {
    socket.emit('new-user-joined', name);
}

socket.on('user-joined', (name: string) => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', (data: { name: string, message: string }) => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', (name: string) => {
    append(`${name} left the chat`, 'left');
});
