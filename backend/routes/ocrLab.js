import express from 'express';
import multer from 'multer';
import tesseract from 'tesseract.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB Limit
});

router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No homework image snapshot found in request stream." });
    }

    // Execute character map localization extraction using standard configuration
    const ocrResult = await tesseract.recognize(req.file.buffer, 
      'eng', 
      { 
        options: {
          oem: 1, 
          psm: 3 
        }
      }
    );
    
    const rawProse = ocrResult.data.text;

    if (!rawProse || !rawProse.trim()) {
      return res.status(422).json({ error: "OCR localized text matrix could not read clean printable glyphs." });
    }

    // Split paragraphs cleanly to map lines into individual tracker elements on frontend
    const structuralLines = rawProse
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    res.status(200).json({
      success: true,
      lines: structuralLines,
      wordCount: rawProse.split(/\s+/).length
    });

  } catch (error) {
    console.error("Advanced OCR Lab Module Exception:", error);
    res.status(500).json({ error: "Failed to cleanly unpack document characters." });
  }
});

export default router;