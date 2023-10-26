let loginBtn = document.getElementById('loginBtn');
let signupBtn = document.getElementById('signupBtn');
let loginForm = document.getElementById('login');
let signupForm = document.getElementById('register');

function login() {
  loginForm.style.left = '4px';
  signupForm.style.right = '-520px';
  loginBtn.className += ' white-btn';
  signupBtn.className = 'btn';
}

function register() {
  loginForm.style.left = '-520px';
  signupForm.style.right = '4px';
  loginBtn.className = 'btn';
  signupBtn.className += ' white-btn';
}

function menuFunction() {
  let navMenu = document.getElementById('navMenu');

  if (navMenu.className === 'nav-menu') {
    navMenu.className += ' responsive';
  } else {
    navMenu.className = 'nav-menu';
  }
}

function loginAndRedirect() {
  const username = document.getElementById('input-field-login-username').value; // Get the username from the input field
  login(); // Execute the login function
  redirectToChat(username); // Redirect to chat.html with the username
}

function registerAndRedirect() {
  const username = document.getElementById('input-field-first_name').value; // Get the username from the input field
  register(); // Execute the register function
  redirectToChat(username); // Redirect to chat.html with the username
}

function redirectToChat(username) {
  window.location.href = `/client/pages/chat.html?user=${username}`;
}
