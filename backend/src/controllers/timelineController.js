import Timeline from '../models/Timeline.js';

export const createTimeline = async (req, res) => {
    try {
        const timeline = new Timeline(req.body);
        await timeline.save();
        res.status(201).json(timeline);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTimelineByTrip = async (req, res) => {
    try {
        const timeline = await Timeline.find({ tripId: req.params.tripId }).sort({ day: 1, time: 1 });
        res.json(timeline);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTimeline = async (req, res) => {
    try {
        const timeline = await Timeline.findByIdAndDelete(req.params.id);
        if (!timeline) return res.status(404).json({ message: 'Timeline item not found' });
        res.json({ message: 'Timeline item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
