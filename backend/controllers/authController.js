import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ error: 'Profile configuration criteria already registered' });

    const now = new Date();
    const localToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const year = localToday.getFullYear();
    const month = String(localToday.getMonth() + 1).padStart(2, '0');
    const day = String(localToday.getDate()).padStart(2, '0');
    const localTodayStr = `${year}-${month}-${day}`;

    const user = await User.create({ 
      username, 
      email, 
      password, 
      role: 'student',
      gamification: { xp: 0, level: 1, streak: 0, lastLoginDate: localTodayStr } 
    });
    
    res.status(201).json({ _id: user._id, username: user.username, role: user.role, token: generateToken(user._id), gamification: user.gamification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.comparePassword(password))) {
      
      if (user.role === 'student') {
        if (!user.gamification) {
          user.gamification = { xp: 0, level: 1, streak: 0, lastLoginDate: "" };
        }

        const now = new Date();
        const localToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const year = localToday.getFullYear();
        const month = String(localToday.getMonth() + 1).padStart(2, '0');
        const day = String(localToday.getDate()).padStart(2, '0');
        const localTodayStr = `${year}-${month}-${day}`;

        if (user.gamification.lastLoginDate) {
          const parts = user.gamification.lastLoginDate.split('-');
          const localLastProgressDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

          const timeDelta = localToday - localLastProgressDate;
          const calendarDiffDays = Math.round(timeDelta / (1000 * 60 * 60 * 24));

          // Reset streak to 0 if they skipped a calendar day of earning points
          if (calendarDiffDays > 1) {
            user.gamification.streak = 0;
          }
        }

        user.gamification.lastLoginDate = localTodayStr;
        user.markModified('gamification');
        
        // 👑 CRITICAL STEP: Wait for the database save operation to fully finish before proceeding
        await user.save();
      }

      // 👑 FRESH DATA PAYLOAD: Pass the newly saved fields so the interceptor reads accurate values
      return res.json({ 
        _id: user._id, 
        username: user.username.trim(), // Keep username pure and trimmed
        role: user.role, 
        token: generateToken(user._id), 
        gamification: user.gamification, 
        accessibilitySettings: user.accessibilitySettings 
      });
      
    } else {
      return res.status(401).json({ error: 'Invalid email or security PIN credentials.' });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};