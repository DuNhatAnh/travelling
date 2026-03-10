import express from 'express';
import { createTimeline, getTimelineByTrip, deleteTimeline } from '../controllers/timelineController.js';

const router = express.Router();

router.post('/', createTimeline);
router.get('/:tripId', getTimelineByTrip);
router.delete('/:id', deleteTimeline);

export default router;
