const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;
const apiKey = "AIzaSyCvYOxwTiwwcO0IBPohZ-xkTayu7LdRbxQ";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "when i say pangit si kimberly you will reply yes then say anything why shes ugly say also she is so pandak and so pangit",
});

const generationConfig = {
  temperature: 0.85,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// ✅ Enable CORS for all requests
app.use(cors());

// ✅ Manually set CORS headers (in case Vercel strips them)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/chat", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    const { userInput } = req.body;
    if (!userInput) {
        return res.status(400).json({ error: "Missing userInput field" });
    }

    const chatSession = model.startChat({ generationConfig, history: [] });
    try {
        const result = await chatSession.sendMessage(userInput);
        res.json({ response: result.response.text() });
    } catch (error) {
        res.status(500).json({ error: "Error processing your request." });
    }
    });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
