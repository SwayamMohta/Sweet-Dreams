import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBijcZU3XQZQsLf9eAy5WKXNVlm1Mhf6OQ",
  authDomain: "sweet-dreams-6d6a6.firebaseapp.com",
  projectId: "sweet-dreams-6d6a6",
  storageBucket: "sweet-dreams-6d6a6.appspot.com",
  messagingSenderId: "568329085439",
  appId: "1:568329085439:web:276a5c7e0af4fbd264c7ca",
  measurementId: "G-KDMG5R6KN9",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ✅ Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const signInButton = document.getElementById("signInButton");

  if (!signInButton) {
    alert("❌ Sign In button not found!");
    return;
  }

  signInButton.addEventListener("click", () => {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!emailInput || !passwordInput) {
      alert("❌ Email or password input not found!");
      return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("✅ Registered successfully!");
        window.location.href = "login.html";
      })
      .catch((error) => {
        alert("❌ Error: " + error.message);
      });
  });
});
