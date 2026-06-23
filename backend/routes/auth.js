import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { activeSessions } from '../utils/sessionStore.js'; // 👑 FIXED FIXED: Import from shared store

const router = express.Router();

// Middleware interceptor to log successful student sign-ins
router.use((req, res, next) => {
  const originalJson = res.json;
  
  res.json = function (data) {
    if (res.statusCode === 200 && data && data.username) {
      if (data.role !== 'admin') {
        activeSessions.set(data.username.toLowerCase(), {
          username: data.username,
          lastActive: new Date().toLocaleTimeString(),
          role: data.role || 'student'
        });
      }
    }
    return originalJson.call(this, data);
  };
  next();
});

router.post('/signup', registerUser);
router.post('/login', loginUser);

export default router;