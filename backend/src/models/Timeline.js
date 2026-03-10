import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    day: { type: Number, required: true }, // 1, 2, 3...
    time: { type: String, required: true }, // "07:00"
    activity: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Timeline', timelineSchema);
