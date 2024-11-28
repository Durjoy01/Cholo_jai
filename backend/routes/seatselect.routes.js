import express from 'express';
import { getBogies } from '../controllers/seatselect.controller.js';

const router = express.Router();

router.get('/:trainNumber/:searchDate', getBogies);

export default router;
