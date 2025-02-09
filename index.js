const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { response: null });
});

app.post("/chat", async (req, res) => {
  const userInput = req.body.userInput;
  const chatSession = model.startChat({ generationConfig, history: [] });

  try {
    const result = await chatSession.sendMessage(userInput);
    res.render("index", { response: result.response.text() });
  } catch (error) {
    res.render("index", { response: "Error processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
