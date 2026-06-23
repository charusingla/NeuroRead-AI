import express from 'express';
import multer from 'multer';
import Tesseract from 'tesseract.js'; // Pure JS/WebAssembly port

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/scan', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please submit a valid image.' });

    // 🚀 Works seamlessly on Windows, Mac, Linux, and Cloud instances without any external setup!
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng');
    
    res.json({ text: text.trim() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;