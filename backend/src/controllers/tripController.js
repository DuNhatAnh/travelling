import Trip from '../models/Trip.js';

const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createTrip = async (req, res) => {
    try {
        console.log('Incoming createTrip request:', req.body);
        const inviteCode = generateInviteCode();
        const tripData = { ...req.body, inviteCode };
        const trip = new Trip(tripData);
        await trip.save();
        console.log('Trip created successfully:', trip._id);
        res.status(201).json(trip);
    } catch (error) {
        console.error('Error in createTrip:', error);
        res.status(400).json({ message: error.message });
    }
};

export const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find().sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTripByInviteCode = async (req, res) => {
    try {
        const trip = await Trip.findOne({ inviteCode: req.params.code.toUpperCase() });
        if (!trip) return res.status(404).json({ message: 'Invalid invite code' });
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
