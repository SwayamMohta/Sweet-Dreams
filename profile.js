import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
// ✅ Your Firebase config — already used in your login system
const firebaseConfig = {
  apiKey: "AIzaSyBijcZU3XQZQsLf9eAy5WKXNVlm1Mhf6OQ",
  authDomain: "sweet-dreams-6d6a6.firebaseapp.com",
  projectId: "sweet-dreams-6d6a6",
  storageBucket: "sweet-dreams-6d6a6.appspot.com",
  messagingSenderId: "568329085439",
  appId: "1:568329085439:web:276a5c7e0af4fbd264c7ca",
  measurementId: "G-KDMG5R6KN9",
};

// 🔥 Initialize Firebase + Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ this initializes Firestore
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid); // each user gets a document under /users/{uid}
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // First time login: set XP and level to 0 and 1
      await setDoc(userRef, {
        email: user.email,
        xp: 0,
        level: 1,
      });
      console.log("✅ New user XP and level set.");
    } else {
      console.log("📦 User data already exists.");
    }
  } else {
    // If not logged in, redirect
    window.location.href = "login.html";
  }
});
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      document.getElementById("userEmail").textContent = user.email;
      document.getElementById("userXP").textContent = data.xp;
      document.getElementById("userLevel").textContent = data.level;
    }
  } else {
    window.location.href = "login.html";
  }
});
