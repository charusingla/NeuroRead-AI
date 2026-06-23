import express from 'express';
import { GoogleGenAI } from "@google/genai";

const router = express.Router();
const aiEngine = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/analyze', async (req, res) => {
  try {
    const { spokenText, targetWord } = req.body;

    if (!spokenText) {
      return res.status(400).json({ error: "No voice transcript data received." });
    }

    // Pass transcript to Gemini to evaluate phonetic phoneme accuracy
    const result = await aiEngine.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this spoken word transaction: The child tried to say the target word "${targetWord || spokenText}", and the audio engine transcribed it as "${spokenText}".`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: `You are an expert speech-language pathologist working with dyslexic kids.
        Analyze the spoken text vs the target goal and return a strict JSON object:
        {
          "isMatch": true or false (true if pronunciation is reasonably close),
          "phonemes": "The acoustic sound breakdown using dots (e.g., /b/•/ʌ/•/t/•/ə/•/f/•/l/•/aɪ/)",
          "feedback": "A super short, encouraging 1-sentence note focusing on phonics success (e.g., 'Amazing job locking in the blending sound at the start!')"
        }`
      }
    });

    // 🌟 FIX: Clean potential markdown code blocks (\`\`\`json) out of the text stream before parsing
    const cleanJsonString = result.text.replace(/```json|```/g, "").trim();

    // Send the cleanly parsed JSON data payload back to the client app
    res.status(200).json(JSON.parse(cleanJsonString));

  } catch (error) {
    console.error("💥 Speech Lab Core Exception Details:", error);

    // 🌟 COOL DEVELOPER TRICK: If Google rate limits us, send mock data so the frontend doesn't break!
    if (error.status === 429 || error.message?.includes("Quota exceeded")) {
      console.log("⚠️ Quota hit! Serving a local fallback payload to keep development active.");
      
      return res.status(200).json({
        isMatch: false, // Force a false match so you can test your new tutor button!
        phonemes: `/${targetWord ? targetWord.split('').join('/•/') : 's/•/p/•/e/•/e/•/c/•/h'}/`,
        feedback: "[DEVELOPMENT MODE - RATE LIMIT FALLBACK] You are doing great! Press the tutor button below to hear how this word sounds."
      });
    }
    res.status(500).json({ error: "Failed to analyze speech. Please try again." });
  }
});

export default router;