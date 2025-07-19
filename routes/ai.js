const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();
const ai = new GoogleGenAI({});

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = `
Ti si fitness AI asistent. Odgovaraj samo na pitanja vezana uz fitness, prehranu i trening. Ne odgovaraj na ništa drugo.

Pitanje: ${question}
Odgovor:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    res.json({ answer: response.text.trim() });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ error: "Greška prilikom generiranja odgovora" });
  }
});

module.exports = router;