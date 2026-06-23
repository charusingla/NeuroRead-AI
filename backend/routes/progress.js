import express from 'express';
import User from '../models/User.js';
import { activeSessions } from '../utils/sessionStore.js'; // 👑 IMPORT SHARED SESSION STORE

const router = express.Router();

/**
 * @route   POST /api/progress/earn-xp
 * @desc    Earn XP points on game completion and instantly synchronize admin live feeds
 */
router.post('/earn-xp', async (req, res) => {
  const { userId, xpGained } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Student profile record not found." });
    }

    // 1. Calculate and update database metrics
    if (!user.gamification) {
      user.gamification = { xp: 0, level: 1, streak: 0, lastLoginDate: "" };
    }

    user.gamification.xp += Number(xpGained);

    // 👑 LEVEL UP ENGINE: Simple dynamic threshold calculation (e.g., every 1000 XP)
    const calculatedLevel = Math.floor(user.gamification.xp / 1000) + 1;
    if (calculatedLevel > user.gamification.level) {
      user.gamification.level = calculatedLevel;
    }

    user.markModified('gamification');
    await user.save(); // Flushes changes safely to MongoDB Atlas

    // 👑 2. LIVE SYNC PIPELINE: Push the fresh scores directly into the active session map instantly
    const sessionKey = user.username.toLowerCase();
    if (activeSessions.has(sessionKey)) {
      const currentSessionData = activeSessions.get(sessionKey);
      
      activeSessions.set(sessionKey, {
        ...currentSessionData,
        gamification: {
          xp: user.gamification.xp,
          level: user.gamification.level,
          streak: user.gamification.streak
        }
      });
    }

    // 3. Return response back down to the student view
    res.status(200).json({
      message: "Progress synchronized successfully",
      gamification: user.gamification
    });

  } catch (err) {
    console.error("XP Sync Processing Exception:", err);
    res.status(500).json({ error: "Internal progress processing engine breakdown." });
  }
});

export default router;