// import express from 'express';
// import { GoogleGenAI } from "@google/genai";

// const router = express.Router();
// const aiEngine = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// router.post('/message', async (req, res) => {
//   try {
//     const { message, chatHistory } = req.body;

//     if (!message || !message.trim()) {
//       return res.status(400).json({ error: "Message context cannot be empty." });
//     }

//     // Map your incoming frontend state logs into a schema the new SDK recognizes
//     const formattedContents = [
//       ...(chatHistory || []).map(msg => ({
//         role: msg.sender === 'Neuro' ? 'model' : 'user',
//         parts: [{ text: msg.text }]
//       })),
//       { role: 'user', parts: [{ text: message }] }
//     ];

//     const result = await aiEngine.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: formattedContents,
//       config: {
//         systemInstruction: `Act as Neuro, a comforting and enthusiastic AI reading tutor for dyslexic children. 
//         Guidelines:
//         1. Keep sentences short, crisp, correct, sweet, and easy to parse.
//         2. Keep total answers under 3 lines.
//         3. Break occasionally difficult, multi-syllable vocabulary words down into bullet-dot separation tracks (e.g., fan•tas•tic, ti•ger).
//         4. Use encouraging words and emojis to maintain a friendly atmosphere.`
//       }
//     });

//     res.status(200).json({ reply: result.text });

//   } catch (error) {
//     console.error("Companion Chat Bot Core Exception:", error);
//     res.status(500).json({ error: "Your reading companion got a bit sleepy. Try sending that message again!" });
//   }
// });

// export default router;

import express from 'express';
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

router.post('/message', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message context cannot be empty." });
    }

    // 👑 RUNTIME INITIALIZATION: Pulls the key fresh from memory during the active request
    const aiEngine = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Map your incoming frontend state logs into a schema the new SDK recognizes
    const formattedContents = [
      ...(chatHistory || []).map(msg => ({
        role: msg.sender === 'Neuro' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const result = await aiEngine.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `Act as Neuro, a comforting and enthusiastic AI reading tutor for dyslexic children. 
        Guidelines:
        1. Keep sentences short, crisp, correct, sweet, and easy to parse.
        2. Keep total answers under 3 lines.
        3. Break occasionally difficult, multi-syllable vocabulary words down into bullet-dot separation tracks (e.g., fan•tas•tic, ti•ger).
        4. Use encouraging words and emojis to maintain a friendly atmosphere.`
      }
    });

    res.status(200).json({ reply: result.text });

  } catch (error) {
    console.error("Companion Chat Bot Core Exception:", error);
    res.status(500).json({ error: "Your reading companion got a bit sleepy. Try sending that message again!" });
  }
});

export default router;