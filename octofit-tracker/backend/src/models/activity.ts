import { model, Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    calories: { type: Number, min: 0, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default model('Activity', activitySchema);
