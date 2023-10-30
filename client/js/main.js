import config from "./config.js";

let loginBtn = document.getElementById("loginBtn");
let signupBtn = document.getElementById("signupBtn");
let loginElement = document.getElementById("login-btn");
let signUpElement = document.getElementById("signup-btn");
let hamburgerElement = document.getElementById("hamburger");
let loginForm = document.getElementById("login");
let signupForm = document.getElementById("register");

loginElement?.addEventListener("click", loginAndRedirect);
signUpElement?.addEventListener("click", registerAndRedirect);
hamburgerElement?.addEventListener("click", menuFunction);

function login() {
  // loginForm.style.left = "4px";
  // signupForm.style.right = "-520px";
  // loginBtn?.className += " white-btn";
  // signupBtn?.className = "btn";
}

function register() {
  // loginForm.style.left = "-520px";
  // signupForm.style.right = "4px";
  // loginBtn.className = "btn";
  // signupBtn.className += " white-btn";
}

function menuFunction() {
  let navMenu = document.getElementById("navMenu");

  if (navMenu.className === "nav-menu") {
    navMenu.className += " responsive";
  } else {
    navMenu.className = "nav-menu";
  }
}

function loginAndRedirect() {
  const username = document.getElementById("input-field-login-username").value; // Get the username from the input field
  login(); // Execute the login function

  if (username) {
    checkIfNameIsTaken(username);
  }
}

function registerAndRedirect() {
  const username = document.getElementById("input-field-first_name").value; // Get the username from the input field
  register(); // Execute the register function
  if (username) {
    checkIfNameIsTaken(username);
  }
}

function redirectToChat(username) {
  sessionStorage.setItem("username", username);
  window.location.href = `/client/pages/chatList.html`;
}

async function checkIfNameIsTaken(name) {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${config.baseUrl}?username=${name}`) //May change based on your port number
    .configureLogging(signalR.LogLevel.Information)
    .build();

  await connection.start();

  connection.on("NameTaken", (name) => {
    alert("Sorry, that name has already been used, please enter another one");
  });

  connection.on("NameAvailable", (name) => {
    redirectToChat(name);
  });
}
