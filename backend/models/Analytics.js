import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  gameName: { type: String, required: true },
  accuracy: { type: Number, required: true },
  speedInSeconds: { type: Number, required: true },
  xpEarned: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Analytics', AnalyticsSchema);