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
