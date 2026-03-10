import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    category: {
        type: String,
        enum: ['Transport', 'Accommodation', 'Food', 'Tickets', 'Entertainment', 'Other'],
        default: 'Other'
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
