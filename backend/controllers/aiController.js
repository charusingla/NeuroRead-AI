import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import express from 'express';
import createError from 'http-errors';
import tesseract from 'tesseract.js';

dotenv.config();

// Correctly initialized client
const aiEngine = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const processOcrAndSimplify = async (req, res, next) => {
  try {
    if (!req.file) return next(createError(400, "Media upload interface mapping failure"));

    // FIX: Destructure the actual text from the Tesseract response object
    const { data: { text: rawText } } = await tesseract.recognize(req.file.buffer, 'eng');
    
    if (!rawText || !rawText.trim()) {
      return next(createError(422, "OCR engine character matching evaluation failure"));
    }

    // FIX: Using the correct new SDK syntax
    const response = await aiEngine.models.generateContent({
      model: "gemini-2.5-flash", // Upgraded to 2.5-flash for faster/better performance
      contents: `Simplify this text: "${rawText}"`,
      config: {
        systemInstruction: "You are an educational psychologist specializing in dyslexia accessibility. Simplify the text into a clean layout. Highlight 3 key terms split into dot-separated syllables (e.g., pho•to•syn•the•sis)."
      }
    });

    // FIX: In the new SDK, text is a direct property, not a function response.text()
    res.status(200).json({ simplifiedText: response.text });
  } catch (error) {
    next(error);
  }
};

export const runProxyChat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return next(createError(400, "Message is required"));

    // FIX: Using the correct new SDK syntax
    const response = await aiEngine.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: "Act as Neuro, a comforting AI reading tutor for dyslexic children. Break hard words into syllables like flow•er. Keep answers under 3 lines."
      }
    });

    res.status(200).json({ reply: response.text });
  } catch (error) {
    next(error);
  }
};

