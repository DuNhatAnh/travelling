import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    name: { type: String, required: true },
    image: { type: String },
    ticketPrice: { type: Number, default: 0 },
    description: { type: String },
    location: { type: String },
}, { timestamps: true });

export default mongoose.model('Place', placeSchema);
