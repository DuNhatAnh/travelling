import express from 'express';
import { createExpense, getExpensesByTrip, deleteExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', createExpense);
router.get('/:tripId', getExpensesByTrip);
router.delete('/:id', deleteExpense);

export default router;
