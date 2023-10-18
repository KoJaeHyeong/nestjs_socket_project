const socket = io('/chat'); // webSocket_namespace

const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

//* global socket handler
socket.on('user_connected', (username) => {
  drawNewChat(`${username} is joined :)`);
});

socket.on('new_chat', (data) => {
  const { msg, username } = data;

  drawNewChat(`${username}: ${msg}`);
});

socket.on('disconnected_user', (username) =>
  drawNewChat(`${username}: exited..:(`),
);

//* event Callback Functions
const handleSubmit = (event) => {
  event.preventDefault();
  const inputChatMsg = event.target.elements[0].value;

  if (inputChatMsg != '') {
    socket.emit('send_msg', inputChatMsg);

    // 화면 표출
    drawNewChat(`me : ${inputChatMsg}`, true);
    event.target.elements[0].value = ''; // 전송 후 빈칸 만들기
  }
};

//* draw Functions
const drawStranger = (username) => {
  helloStrangerElement.innerText = `${username} is joined :)`;
};

const drawNewChat = (msg, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  let chatBox;
  if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${msg}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${msg}
    </div>
    `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

function helloUser() {
  const username = prompt('What is your name?');
  socket.emit('join', username, (data) => {
    drawStranger(data);
  });
}

function init() {
  helloUser();

  formElement.addEventListener('submit', handleSubmit); // form태그는 동작 시 browser는 새로고침 된다.
}

init();
