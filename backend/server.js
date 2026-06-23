import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import User from './models/User.js'; // 👑 Imported User model for administrative seeding
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import ocrRoutes from './routes/ocr.js';
import mnemonicRoutes from './routes/mnemonic.js';
import ocrLabRoutes from './routes/ocrLab.js';
import tutorChatRoutes from './routes/tutorChat.js';
import speechLabRoutes from './routes/speechLab.js';
import adminRoutes from './routes/admin.js';
import progressRoutes from './routes/progress.js';

// Initialize Cloud Database Connection Stream
connectDB();

// 👑 AUTOMATED ADMINISTRATIVE CLOUD ATLAS SEED SCRIPT
const seedAdminUser = async () => {
  try {
    const adminEmail = "admin@neuroread.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      console.log("⚠️ No administrative profile detected in your MongoDB Atlas cluster. Provisioning...");
      
      await User.create({
        username: "Administrator",
        email: adminEmail,
        password: "9999", // 💡 Your secure admin access PIN code
        role: "admin",
        gamification: { xp: 0, level: 1, streak: 0 }
      });
      
      console.log("✅ Admin account successfully seeded to Atlas! [User: admin@neuroread.com / PIN: 9999]");
    } else {
      console.log("ℹ️  Core admin account verification complete. Portal secure.");
    }
  } catch (err) {
    console.error("❌ Critical Admin initialization fail loop:", err.message);
  }
};

seedAdminUser();

const app = express();
app.use(cors({
  origin: true, // Allows our future live website to talk to this backend safely
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/mnemonic', mnemonicRoutes);
app.use('/api/ocr-lab', ocrLabRoutes);
app.use('/api/tutor-chat', tutorChatRoutes);
app.use('/api/speech-lab', speechLabRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/progress', progressRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: err.message || "Internal App Execution Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NeuroRead API Gateway running on port ${PORT}`);
});