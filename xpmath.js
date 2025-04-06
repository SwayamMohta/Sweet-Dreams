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

// Task-to-XP mapping
const taskXP = {
  writeJournal: 25, // Writing a journal gives 25 XP
  likePost: 7, // Liking a post gives 7 XP
  postFeatured: 25, // Posting in the featured section gives 25 XP
};

// Calculate the level based on XP
function calculateLevel(xp) {
  return Math.floor(1 + xp / 100); // Every 100 XP = 1 level
}

// Add XP based on the task the user performs
app.post("/api/add-xp/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const task = req.body.task; // Get the task type (e.g., 'writeJournal', 'likePost', etc.)

    // Check if the task is valid
    if (!taskXP[task]) {
      return res.status(400).json({ error: "Invalid task" });
    }

    const amount = taskXP[task]; // Get the XP for the task

    // Find the user in the Firestore database
    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const data = doc.data();
    const newXP = (data.xp || 0) + amount; // Update XP
    const newLevel = calculateLevel(newXP); // Recalculate level

    // Update the user's XP and level in Firestore
    await userRef.update({
      xp: newXP,
      level: newLevel,
    });

    res.json({ xp: newXP, level: newLevel });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🔥 XP system running at http://localhost:${port}`);
});
