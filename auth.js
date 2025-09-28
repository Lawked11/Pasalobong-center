// auth.js - Authentication Logic and UI Handling (Customer Registration)

// Import Firebase auth functions and the auth instance from firebase.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { auth, db } from './firebase.js';

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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Check user role by looking in both collections
        let userRole = null;
        let redirectUrl = null;
        
        // Check if user is admin
        const adminDocRef = doc(db, 'admins', user.uid);
        const adminDoc = await getDoc(adminDocRef);
        
        if (adminDoc.exists()) {
          userRole = adminDoc.data().role;
          redirectUrl = 'admin_dashboard.html';
        } else {
          // Check if user is customer
          const customerDocRef = doc(db, 'customers', user.uid);
          const customerDoc = await getDoc(customerDocRef);
          
          if (customerDoc.exists()) {
            userRole = customerDoc.data().role;
            redirectUrl = 'home.html';
          }
        }
        
        // If no role found, show error
        if (!userRole) {
          showNotification('User account not found in database. Please contact support.', 'error');
          await signOut(auth);
          return;
        }
        
        showNotification('Login successful! Redirecting...', 'success');
        if (document.getElementById('modalOverlay')) {
          document.getElementById('modalOverlay').classList.remove('open');
        }
        sessionStorage.setItem('showWelcomeModal', 'true');
        sessionStorage.setItem('userRole', userRole);
        
        setTimeout(() => {
          window.location.href = redirectUrl;
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
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // PROFESSIONAL APPROACH: Store in separate top-level collection
        // Path: customers/{uid}
        const customerDocRef = doc(db, 'customers', user.uid);
        await setDoc(customerDocRef, {
          uid: user.uid,
          email: email,
          role: 'customer',
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        showNotification('Account created successfully! Please login.', 'success');
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