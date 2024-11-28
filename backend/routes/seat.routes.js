import express from 'express';
import {searchTickets} from '../controllers/seat.controller.js';

const router = express.Router();

router.get('/search', searchTickets);

export default router;