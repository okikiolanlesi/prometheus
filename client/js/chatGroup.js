'use strict';
import config from './config.js';

const getUserName = () => sessionStorage.getItem('username') || 'Unknown';

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${config.baseUrl}?username=${getUserName()}`) //May change based on your port number
  .configureLogging(signalR.LogLevel.Information)
  .build();

const start = async () => {
  try {
    await connection.start();
    console.log('SignalR Connected.');
  } catch (err) {
    console.log(err);
  }
};

const getGroupNameFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('groupName');
};

const joinChat = async (user) => {
  if (user === null) return;

  try {
    const message = `${user} joined the group chat.`;
    await connection.invoke(
      'JoinRoom',
      getGroupNameFromURL(),
      getUserName(),
      message
    );
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};

// getting notification message
const getNotificationMessage = async () => {
  const currentUser = getUserName();

  if (!currentUser) return;

  try {
    await connection.on('ReceiveGroupMessage', (message, user) => {
      const messageClass = user === getUserName() ? 'sent-msg' : 'received-msg';
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
  console.log('called');
  e.preventDefault();

  const user = getUserName();
  // const receiver = document.getElementById("receiverInput").value;

  if (!user) return;
  // if (!user || !receiver) return;

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
    await connection.invoke(
      'SendMessageToRoom',
      getGroupNameFromURL(),
      message,
      user
    );
  } catch (error) {
    console.log(error);
  }
};

const listenForUserNameErrors = async () => {
  connection.on('NameTaken', (name) => {
    alert("Sorry, your username isn't valid please enter another one");

    window.location.href = `/`;
  });
};

const setUsername = () => {
  const username = getUserName();
  document.getElementById('usernamePlaceholder').textContent = username;
};

const startApp = async () => {
  await start();
  const user = getUserName();
  if (user) {
    await joinChat(user);
    await getNotificationMessage();
    await listenForUserNameErrors();
  }

  setUsername(); // Set the username when the app starts
};

startApp();
