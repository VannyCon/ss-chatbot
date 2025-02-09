const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "reply in Tagalog",
});

const generationConfig = {
  temperature: 0.85,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: "Missing userInput field" });
  }

  try {
    const chatSession = model.startChat({ generationConfig, history: [] });
    const result = await chatSession.sendMessage(userInput);
    res.json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "Error processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
