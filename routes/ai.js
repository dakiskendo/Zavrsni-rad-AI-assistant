const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();
const ai = new GoogleGenAI({});

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = `
Ti si prijateljski AI asistent specijaliziran za fitness, ishranu, zdravlje i kalorije. Tvoja glavna uloga je pomagati korisnicima u tim temama.

Ako korisnik postavi pitanje koje nije direktno vezano uz fitness (npr. šaljivo pitanje poput "koji auto je dobar za bench press"), odgovori na duhovit i prijateljski način, ali pokušaj ostati u fitness tonu ili metafori. Uvijek odgovaraj jezikom kojim je korisnik postavio pitanje.

Ako korisnik postavi pitanje poput koji auto je bolji, podsjeti ga da si AI asistent i da ne odgovaraš na ta pitanja.
Ako te pita koje prijevozno sredstvo je najbolje, najbrze i slično, podsjeti ga da si AI asistent i da ne odgovaraš na ta pitanja.

Pitanje: ${question}
Odgovor:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
      generationConfig: {
        temperature: 0.4,
        topK: 20,
        topP: 0.9,
        maxOutputTokens: 300,
}
    });

    res.json({ answer: response.text.trim() });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ error: "Greška prilikom generiranja odgovora" });
  }
});

module.exports = router;