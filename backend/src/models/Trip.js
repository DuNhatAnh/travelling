import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    name: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    people: { type: Number, default: 2 },
    transport: { type: String },
    inviteCode: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);
