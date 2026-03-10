import express from 'express';
import { createPlace, getPlacesByTrip, deletePlace, upload } from '../controllers/placeController.js';

const router = express.Router();

router.post('/', upload.single('image'), createPlace);
router.get('/:tripId', getPlacesByTrip);
router.delete('/:id', deletePlace);

export default router;
