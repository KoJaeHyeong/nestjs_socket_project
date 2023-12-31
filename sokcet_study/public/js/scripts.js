const socket = io('/chat'); // webSocket_namespace

const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

function helloUser() {
  const username = prompt('What is your name?');
  socket.emit('new_user', username, (data) => {
    console.log('front2', data);
  });

  socket.on('hello', (data) => {
    console.log('front1', data);
  });
}

function init() {
  helloUser();
}

init();
