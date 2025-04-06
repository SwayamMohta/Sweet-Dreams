require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 3000;

console.log("Loaded OpenRouter Key:", process.env.OPENROUTER_API_KEY);

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

// Mock database for demonstration purposes
const users = {
  H8315gbZGKV79amC4NP7L9pzupB2: { xp: 100, level: 1 },
};

// Get user data (XP and level)
app.get("/api/user/:uid", (req, res) => {
  const { uid } = req.params;

  if (users[uid]) {
    res.json(users[uid]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Add XP to a user
app.post("/api/add-xp/:uid", (req, res) => {
  const { uid } = req.params;
  const { amount } = req.body;

  if (users[uid]) {
    users[uid].xp += amount;

    // Update level based on XP (example logic)
    users[uid].level = Math.floor(users[uid].xp / 100) + 1;

    res.json(users[uid]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// New route to handle adding a featured story and awarding 25 XP
app.post("/api/add-featured-story/:uid", async (req, res) => {
  const { uid } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Missing title or content for the story.",
    });
  }

  // Here you would add the new story to your database (e.g., Firebase or MongoDB)
  // For this example, we're just mocking the database
  // Assuming the story is added to the "featured" collection

  // Award the user 25 XP for uploading the story
  if (users[uid]) {
    users[uid].xp += 25;

    // Update level based on new XP
    users[uid].level = Math.floor(users[uid].xp / 100) + 1;

    res.json({
      success: true,
      message: "Story added successfully and 25 XP awarded!",
      user: users[uid], // Send back the updated user info
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Existing story completion functionality (no changes here)
app.post("/complete-story", async (req, res) => {
  const { title, story, prompt } = req.body;

  if (!title || !story || !prompt) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const completionPrompt = `${story}\n\nWrite a continuation of the story titled "${title}" with the following prompt: "${prompt}"`;

  const openrouterRequestBody = {
    model: "mistralai/mistral-7b-instruct", // or try "openai/gpt-3.5-turbo"
    messages: [
      { role: "system", content: "You are a helpful storytelling assistant." },
      { role: "user", content: completionPrompt },
    ],
    temperature: 0.7,
    max_tokens: 200,
  };

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      openrouterRequestBody,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // optional but good to include
          "X-Title": "Story App",
        },
      }
    );

    const completedStory = response.data.choices[0].message.content.trim();
    res.json({ success: true, completedStory });
  } catch (error) {
    console.error(
      "Error generating story:",
      error.response?.data || error.message
    );
    res.json({ success: false, error: "Error generating the story." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
