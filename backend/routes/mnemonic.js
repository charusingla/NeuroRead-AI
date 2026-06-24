import express from 'express';
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { word } = req.body; 

  if (!word || !word.trim()) {
    return res.status(400).json({ error: "A valid word is required." });
  }

  try {
    // 👑 RUNTIME INITIALIZATION: Pulls the key fresh from memory during the active request
    const aiEngine = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Call Gemini to generate structured visual card data
    const result = await aiEngine.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `Create a visual syllable layout, friendly definition, and find the 2 best emojis that illustrate the word: "${word}"`,
      config: {
        responseMimeType: "application/json",
        // 👑 responseSchema enforces exact property fields matching your React parameters
        responseSchema: {
          type: "OBJECT",
          properties: {
            word: { type: "STRING" },
            syllables: { type: "STRING" },
            definition: { type: "STRING" },
            visualEmojis: { type: "STRING" },
            memoryTrick: { type: "STRING" }
          },
          required: ["word", "syllables", "definition", "visualEmojis", "memoryTrick"]
        },
        systemInstruction: `You are a dyslexia accessibility tutor.
        Analyze the word and return a strict JSON object structure matching the provided responseSchema fields.`
      }
    });

    // Parse the data layer safely before passing it to the response stream
    const parsedData = JSON.parse(result.text);
    return res.status(200).json(parsedData);

  } catch (apiError) {
    console.warn(`⚠️ Mnemonic generation failed for "${word}". Routing to dynamic backup layer...`);
    console.error("Detailed Mnemonic Error Profile:", apiError);

    const cleanWord = word.trim();
    
    const genericFallbackCard = {
      word: cleanWord,
      syllables: cleanWord, 
      definition: "An important learning word we are practicing together.",
      visualEmojis: "🧠⭐",
      memoryTrick: `Look at the shapes of the letters in "${cleanWord}" to map out its special sound!`,
      isFallback: true
    };

    return res.status(200).json(genericFallbackCard);
  }
});

export default router;