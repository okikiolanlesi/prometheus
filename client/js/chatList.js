"use strict";
import config from "./config.js";

const getUserName = () => sessionStorage.getItem("username") || "Unknown";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${config.baseUrl}?username=${getUserName()}`) //May change based on your port number
  .configureLogging(signalR.LogLevel.Information)
  .build();

const start = async () => {
  try {
    await connection.start();
    console.log("SignalR Connected.");
  } catch (err) {
    console.log(err);
  }
};

const appendUserChatBox = async () => {
  const users = JSON.parse(sessionStorage.getItem("users"));
  // const groups = JSON.parse(sessionStorage.getItem("groups"));
  const usersSection = document.getElementById("users-section");
  usersSection.innerHTML = "";

  if (users.length > 0) {
    users.forEach(function (user) {
      if (user.userId !== connection.connectionId) {
        // Create an anchor element
        const a = document.createElement("a");
        // Set the attributes and the innerHTML
        a.setAttribute(
          "href",
          "/client/pages/chatSingle.html?receiver=" + user.userName
        );
        a.setAttribute("class", "chat-box");
        a.innerHTML = "<p>Chat with " + user.userName + "</p><p>></p>";
        // Append the anchor element to the div element
        usersSection.appendChild(a);
      }
    });
  } else {
    usersSection.innerHTML = "<p>No users found.</p>";
  }
};

const appendGroupChatBox = async () => {
  const groups = JSON.parse(sessionStorage.getItem("groups"));
  // const groups = JSON.parse(sessionStorage.getItem("groups"));
  const groupsSection = document.getElementById("groups-section");
  groupsSection.innerHTML = "";

  if (groups.length > 0) {
    groups.forEach(function (group) {
      // Create an anchor element
      const a = document.createElement("a");
      // Set the attributes and the innerHTML
      a.setAttribute("href", "/client/pages/chatGroup.html?groupName=" + group);
      a.setAttribute("class", "chat-box");
      a.innerHTML = "<p>Chat in " + group + "</p><p>></p>";
      // Append the anchor element to the div element
      groupsSection.appendChild(a);
    });
  } else {
    groupsSection.innerHTML = "<p>No groups found.</p>";
  }
};

const createGroup = async () => {
  document.getElementById("create-group").addEventListener("click", (e) => {
    e.preventDefault();
    const groupName = prompt("What name would you like to name your group");
    connection.invoke("CreateGroup", groupName);
  });
};

const appLogic = async () => {
  connection.invoke("RequestUsersAndGroups");
  connection.on("ReceiveUserAndGroups", (users, groups) => {
    console.log(users);
    sessionStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("groups", JSON.stringify(groups));
    appendUserChatBox();
    appendGroupChatBox();
  });

  createGroup();

  connection.on("RoomAlreadyExists", (room) => {
    alert("Group already exists with name: " + room);
  });
  connection.on("GroupCreated", (room) => {
    alert("Group created successfully");
  });
};

const startApp = async () => {
  await start();

  appLogic();
};

startApp();
