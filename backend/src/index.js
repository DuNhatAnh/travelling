import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import tripRoutes from './routes/tripRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/trips', tripRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/timeline', timelineRoutes);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trip_planner';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Trip Planner API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
