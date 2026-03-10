import express from 'express';
import { createTrip, getTrips, getTripById, deleteTrip, getTripByInviteCode } from '../controllers/tripController.js';

const router = express.Router();

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/join/:code', getTripByInviteCode);
router.get('/:id', getTripById);
router.delete('/:id', deleteTrip);

export default router;
