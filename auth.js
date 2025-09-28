// Import Firebase libraries from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD373HsUJ7jJsDZEKZQzaHGPAJglizaZY4",
  authDomain: "pasalobong-486c3.firebaseapp.com",
  projectId: "pasalobong-486c3",
  storageBucket: "pasalobong-486c3.firebasestorage.app",
  messagingSenderId: "157431097657",
  appId: "1:157431097657:web:dc8afc6e6d18ada4a120e8",
  measurementId: "G-Y13929E4XY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Centered Notification Modal function
function showNotification(message, type = "info", title = "") {
  const modal = document.getElementById("notificationModal");
  const content = document.getElementById("notificationContent");
  const notifTitle = document.getElementById("notificationTitle");
  const notifMsg = document.getElementById("notificationMessage");
  const actionBtn = document.getElementById("notificationActionBtn");

  // Set styles & text
  content.className = "notification-content " + type;
  notifTitle.textContent = title || (type === "success"
    ? "Success!"
    : type === "error"
      ? "Error"
      : "Notification");
  notifMsg.textContent = message;
  actionBtn.style.display = "none"; // Hide by default

  modal.classList.add("open");

  // Close function
  function closeModal() {
    modal.classList.remove("open");
    notifTitle.textContent = "";
    notifMsg.textContent = "";
    content.className = "notification-content";
  }

  document.getElementById("closeNotificationModalBtn").onclick = closeModal;
  // Optional: close on click outside content
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
  actionBtn.onclick = closeModal;
}

// Listen for both modal and inline (auth-card) form submission (login & signup)
document.addEventListener('submit', async function(e) {
  if (e.target.classList.contains('modal-form') || e.target.classList.contains('auth-form')) {
    e.preventDefault();
    let isLogin = false;
    let isSignup = false;
    if (e.target.classList.contains('modal-form')) {
      const header = e.target.querySelector('h2')?.textContent;
      isLogin = header === "Login";
      isSignup = header === "Sign Up";
    } else if (e.target.classList.contains('auth-form')) {
      isLogin = e.target.id === "loginForm";
      isSignup = e.target.id === "signupForm";
    }

    // LOGIN
    if (isLogin) {
      const email = e.target.querySelector('input[type="email"]').value;
      const password = e.target.querySelector('input[type="password"]').value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        showNotification('Login successful! Redirecting...', 'success');
        if (document.getElementById('modalOverlay')) {
          document.getElementById('modalOverlay').classList.remove('open');
        }
        sessionStorage.setItem('showWelcomeModal', 'true');
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1100);
      } catch (error) {
        showNotification(`Login failed: ${error.message}`, 'error');
      }
    }

    // SIGNUP
    if (isSignup) {
      const form = e.target;
      const email = form.querySelector('input[type="email"]').value;
      const password = form.querySelector('input[type="password"]').value;
      let confirmPassword = "";
      if (form.querySelector('#signup-confirm-password')) {
        confirmPassword = form.querySelector('#signup-confirm-password').value;
      } else {
        const passwordInputs = form.querySelectorAll('input[type="password"]');
        if (passwordInputs.length > 1) {
          confirmPassword = passwordInputs[1].value;
        }
      }
      if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        showNotification('Signup successful! Please login.', 'success');
        if (document.getElementById('modalOverlay')) {
          document.getElementById('modalOverlay').classList.remove('open');
        }
        if (document.getElementById('loginForm') && document.getElementById('signupForm')) {
          document.getElementById('signupForm').style.display = 'none';
          document.getElementById('loginForm').style.display = 'flex';
        }
      } catch (error) {
        showNotification(`Signup failed: ${error.message}`, 'error');
      }
    }
  }
}, false);