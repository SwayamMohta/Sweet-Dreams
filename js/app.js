const mainHead = document.querySelector(".main-head");
const showcase = document.querySelector(".showcase");
const toggler = document.querySelector(".toggler");
toggler.addEventListener("click", function () {
  mainHead.classList.toggle("active");
  showcase.classList.toggle("width");
});
// Function to save story to Featured collection
async function saveToFeatured(title, content) {
  const featuredRef = db.collection("featured");
  try {
    await featuredRef.add({
      title: title,
      content: content,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    console.log("Story added to the Featured collection.");
  } catch (error) {
    console.error("Error saving to Featured collection: ", error);
  }
}

// Example of how you could use it (you should trigger this from a form submission)
document.getElementById("submitStory").addEventListener("click", function () {
  const title = document.getElementById("storyTitle").value;
  const content = document.getElementById("storyContent").value;
  saveToFeatured(title, content);
});
const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./sweet-dreams-6d6a6-firebase-adminsdk-fbsvc-5ae5397ffe.json");

const app = express();
const port = 3000;

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
app.use(express.static("public"));
app.use(express.json());

// Function to calculate the level based on XP
function calculateLevel(xp) {
  return Math.floor(1 + xp / 100); // Every 100 XP = 1 level
}

// Function to add XP for uploading a story
async function addXPForStoryUpload(uid) {
  try {
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      throw new Error("User not found");
    }

    const userData = doc.data();
    const newXP = (userData.xp || 0) + 25; // Add 25 XP for uploading a story
    const newLevel = calculateLevel(newXP);

    // Update the user's XP and level
    await userRef.update({
      xp: newXP,
      level: newLevel,
    });
  } catch (err) {
    throw new Error(`Failed to add XP: ${err.message}`);
  }
}

// POST route to handle the story upload and give XP to the user
app.post("/api/add-story", async (req, res) => {
  try {
    const { uid, title, content } = req.body; // Get the user ID, title, and content

    if (!uid || !title || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Add the story to the Firestore database
    const storiesRef = db.collection("featured");
    const newStory = {
      title,
      content,
      timestamp: new Date(),
      userId: uid, // Store the user ID of the uploader
    };
    const storyRef = await storiesRef.add(newStory);

    // Add XP to the user who uploaded the story
    await addXPForStoryUpload(uid);

    res
      .status(201)
      .json({ message: "Story added successfully", storyId: storyRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🔥 XP system running at http://localhost:${port}`);
});
