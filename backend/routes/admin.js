import express from 'express';
import { activeSessions } from '../utils/sessionStore.js';
import User from '../models/User.js'; // 👑 GUARANTEED REFERENCE IMPORT

const router = express.Router();

/**
 * @route   GET /api/admin/live-status
 * @desc    Fetch currently online students, joining live database gamification telemetry directly
 */
router.get('/live-status', async (req, res) => {
  try {
    const sessionItems = Array.from(activeSessions.values());
    const completeOnlineStudents = [];

    for (const session of sessionItems) {
      const freshUser = await User.findOne({ username: session.username }).select('gamification email');
      if (freshUser) {
        completeOnlineStudents.push({
          username: session.username,
          lastActive: session.lastActive,
          role: session.role,
          email: freshUser.email,
          gamification: freshUser.gamification || { xp: 0, level: 1, streak: 0 }
        });
      } else {
        completeOnlineStudents.push({
          ...session,
          gamification: { xp: 0, level: 1, streak: 0 }
        });
      }
    }

    res.status(200).json({
      onlineCount: completeOnlineStudents.length,
      onlineStudents: completeOnlineStudents
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to gather live stream tracking telemetry." });
  }
});

/**
 * @route   GET /api/admin/students-metrics
 * @desc    Fetch all student profiles, normalization layer handles missing objects safely
 */
router.get('/students-metrics', async (req, res) => {
  try {
    // 👑 Gather plain JSON objects from MongoDB to prevent property mutation blocks
    const rawStudents = await User.find({ role: 'student' })
      .select('username email gamification accessibilitySettings createdAt')
      .lean();

    const now = new Date();
    const localToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const normalizedStudents = [];

    for (let student of rawStudents) {
      let currentStreak = student.gamification?.streak || 0;

      if (student.gamification?.lastLoginDate) {
        const parts = student.gamification.lastLoginDate.split('-');
        const localLastProgressDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

        const timeDelta = localToday - localLastProgressDate;
        const calendarDiffDays = Math.round(timeDelta / (1000 * 60 * 60 * 24));

        if (calendarDiffDays > 1 && currentStreak !== 0) {
          currentStreak = 0;
          // Clean background atomic database update
          await User.updateOne(
            { _id: student._id },
            { $set: { 'gamification.streak': 0 } }
          );
        }
      }

      normalizedStudents.push({
        _id: student._id,
        username: student.username || "Unknown Student",
        email: student.email || "N/A",
        gamification: {
          xp: student.gamification?.xp || 0,
          level: student.gamification?.level || 1,
          streak: currentStreak
        }
      });
    }

    // Sort descending by highest XP score
    normalizedStudents.sort((a, b) => (b.gamification?.xp || 0) - (a.gamification?.xp || 0));

    res.status(200).json({
      totalCount: normalizedStudents.length,
      students: normalizedStudents
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to gather database score tracking metrics." });
  }
});

/**
 * @route   POST /api/admin/logout-student
 * @desc    Administratively kick/disconnect an active session
 */
router.post('/logout-student', (req, res) => {
  const { username } = req.body;
  if (username) {
    activeSessions.delete(username.toLowerCase());
    return res.status(200).json({ message: `Session for ${username} disconnected.` });
  }
  res.status(400).json({ error: "Missing username" });
});

export default router;