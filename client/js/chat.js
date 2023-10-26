'use strict';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:7037/chathub') //May change basd on your port number
  .configureLogging(signalR.LogLevel.Information)
  .build();

const start = async () => {
  try {
    await connection.start();
    console.log('SignalR Connected.');
  } catch (err) {
    console.log(err);
    // setTimeout(start, 5000);
  }
};

const getUserNameFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('user');
};

const joinChat = async (user) => {
  if (user === null) return;

  try {
    const message = `${user} joined.`;
    await connection.invoke('JoinChat', user, message);
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};

// getting username from session storage
const getUserName = () => sessionStorage.getItem('username');

// getting notification message
const getNotificationMessage = async () => {
  const currentUser = getUserName();

  if (!currentUser) return;

  try {
    await connection.on('ReceiveMessage', (user, message) => {
      const messageClass = user === currentUser ? 'sent-msg' : 'received-msg';
      appendMessage(message, messageClass);
    });
  } catch (error) {
    console.log(error);
  }
};

// appending message to the message section
const appendMessage = (message, messageClass) => {
  const messageSection = document.getElementById('messageSection');
  const messageElement = document.createElement('div');
  messageElement.classList.add('msg-box');
  messageElement.classList.add(messageClass);
  messageElement.innerHTML = message;
  messageSection.appendChild(messageElement);
};

// binding the send button
document.getElementById('sendBtn').addEventListener('click', async (e) => {
  e.preventDefault();

  const user = getUserName();

  if (!user) return;

  const messageInputElement = document.getElementById('messageInput');
  const messageInput = messageInputElement.value;

  if (messageInput) {
    // call method to send message
    await sendMessage(user, `${user}: ${messageInput}`); // send message to server
    messageInputElement.value = '';
  }
});

const sendMessage = async (user, message) => {
  try {
    await connection.invoke('SendMessage', user, message);
  } catch (error) {
    console.log(error);
  }
};

// starting the app
// const startApp = async () => {
//   await start(); // connect to signalR hub
//   await joinUserName();
//   await getNotificationMessage();
// };

const startApp = async () => {
  await start();
  const user = getUserNameFromURL();
  if (user) {
    sessionStorage.setItem('username', user);
    await joinChat(user);
    await getNotificationMessage();
  }
};

startApp();
