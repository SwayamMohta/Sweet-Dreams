// login.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBijcZU3XQZQsLf9eAy5WKXNVlm1Mhf6OQ",
  authDomain: "sweet-dreams-6d6a6.firebaseapp.com",
  projectId: "sweet-dreams-6d6a6",
  storageBucket: "sweet-dreams-6d6a6.appspot.com",
  messagingSenderId: "568329085439",
  appId: "1:568329085439:web:276a5c7e0af4fbd264c7ca",
  measurementId: "G-KDMG5R6KN9",
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔐 Handle login
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("signInButton");

  loginButton.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("✅ Logged in:", user);
      alert("Login successful! Redirecting...");

      // 🎯 Redirect to profile.html
      //window.location.href = `${window.location.origin}/profile.html`;
      window.location.replace("profile.html");
    } catch (error) {
      console.error("❌ Login failed:", error);
      alert("Error: " + error.message);
    }
  });
});
