import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 4 },
  
  // 👑 FIXED: Added 'teacher' to the enum array to prevent background document save validation crashes
  role: { type: String, enum: ['student', 'admin', 'teacher'], default: 'student' },
  
  gamification: {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 }, // Default to Level 1 baseline
    streak: { type: Number, default: 0 },
    lastLoginDate: { type: String, default: "" }
  },
  accessibilitySettings: {
    fontSize: { type: Number, default: 18 },
    letterSpacing: { type: Number, default: 0.14 },
    lineHeight: { type: Number, default: 1.9 },
    wordSpacing: { type: Number, default: 0.28 },
    useOpenDyslexic: { type: Boolean, default: true },
    irlenColor: { type: String, enum: ['none', 'soft-blue', 'soft-yellow', 'soft-green', 'rose-cream'], default: 'none' }
  }
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);