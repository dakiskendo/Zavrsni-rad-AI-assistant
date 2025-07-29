const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();
const ai = new GoogleGenAI({});

router.post("/", async (req, res) => {
  try {
    const { question, userData } = req.body;

const prompt = `
Ti si prijateljski AI asistent specijaliziran za fitness, prehranu, zdravlje i kalorije. Tvoja glavna uloga je pomagati korisnicima u tim temama.

Ako korisnik postavi pitanje koje nije direktno vezano uz fitness (npr. šaljivo pitanje poput "koji auto je dobar za bench press"), odgovori na duhovit i prijateljski način, ali pokušaj ostati u fitness tonu ili metafori. Uvijek odgovaraj jezikom kojim je korisnik postavio pitanje.

Ako korisnik postavi pitanje poput koji auto je bolji, podsjeti ga da si AI asistent i da ne odgovaraš na ta pitanja.
Ako te pita koje prijevozno sredstvo je najbolje, najbrze i slično, podsjeti ga da si AI asistent i da ne odgovaraš na ta pitanja.

Ako korisnik traži da ga podsjetiš koje zdravstvene probleme ima, navedi sve zdravstvene probleme koje je unio.
Kada spominješ razinu aktivnosti korisnika, nemoj samo izgovoriti broj (npr. 1.375), nego tu razinu opiši riječima kao što su "niska", "umjerena", "visoka" ili slično, tako da korisnik odmah razumije koliko je njegova aktivnost.

Korisnik ima sljedeće podatke:
Ime: ${userData.name}
Dob: ${userData.age}
Visina: ${userData.height}
Težina: ${userData.weight}
Razina aktivnosti: ${userData.activityLevel}
Zdravstveni problemi: ${userData.medicalConditions}

Pitanje: ${question}
Odgovor:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        topK: 20,
        topP: 0.9,
        maxOutputTokens: 100,
}
    });

    res.json({ answer: response.text.trim() });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ error: "Greška prilikom generiranja odgovora" });
  }
});

module.exports = router;