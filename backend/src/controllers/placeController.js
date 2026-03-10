import Place from '../models/Place.js';
import multer from 'multer';
import path from 'path';

// Setup multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ storage });

export const createPlace = async (req, res) => {
    try {
        const { tripId, name, ticketPrice, description, location } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const place = new Place({
            tripId,
            name,
            image,
            ticketPrice: Number(ticketPrice),
            description,
            location
        });

        await place.save();
        res.status(201).json(place);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPlacesByTrip = async (req, res) => {
    try {
        const places = await Place.find({ tripId: req.params.tripId });
        res.json(places);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePlace = async (req, res) => {
    try {
        const place = await Place.findByIdAndDelete(req.params.id);
        if (!place) return res.status(404).json({ message: 'Place not found' });
        res.json({ message: 'Place deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
