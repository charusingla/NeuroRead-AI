import express from 'express';
import multer from 'multer';
import { processOcrAndSimplify, runProxyChat } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB Upload Boundary

router.post('/ocr-simplify', protect, upload.single('image'), processOcrAndSimplify);
router.post('/chat', protect, runProxyChat);

export default router;