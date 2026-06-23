import express from 'express';
import { GoogleGenAI } from "@google/genai";

const router = express.Router();
const aiEngine = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/generate', async (req, res) => {
  const { word } = req.body; // Extract safely at the outer scope

  if (!word || !word.trim()) {
    return res.status(400).json({ error: "A valid word is required." });
  }

  try {
    // Call Gemini to generate structured visual card data
    const result = await aiEngine.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a visual syllable layout, friendly definition, and find the 2 best emojis that illustrate the word: "${word}"`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: `You are a dyslexia accessibility tutor.
        Analyze the word and return a strict JSON object structure:
        {
          "word": "${word}",
          "syllables": "Syllable breakdown with dots (e.g., pho•to•syn•the•sis)",
          "definition": "A super simple, child-friendly definition (1 short sentence)",
          "visualEmojis": "Two high-contrast emojis that represent the concept visually",
          "memoryTrick": "A simple visual memory phrase for a dyslexic child."
        }`
      }
    });

    // Parse the data layer safely before passing it to the response stream
    const parsedData = JSON.parse(result.text);
    return res.status(200).json(parsedData);

  } catch (apiError) {
    // 🚨 503 EXCEPTION LAYER: Safely intercepts model overload spikes or parsing bugs
    console.warn(`⚠️ Mnemonic generation failed for "${word}". Routing to dynamic backup layer...`);

    // 👑 DICTIONARY NORMALIZATION FALLBACK: Guarantees the frontend gets the shape it needs!
    const cleanWord = word.trim();
    
    const genericFallbackCard = {
      word: cleanWord,
      syllables: cleanWord.split('').join('•'), // Simple baseline fallback: letters separated by dots
      definition: "An important learning word we are practicing together.",
      visualEmojis: "🧠⭐",
      memoryTrick: `Look at the shapes of the letters in "${cleanWord}" to map out its special sound!`,
      isFallback: true
    };

    // Return status 200 with the matching fallback card schema so the UI doesn't drop row properties
    return res.status(200).json(genericFallbackCard);
  }
});

export default router;