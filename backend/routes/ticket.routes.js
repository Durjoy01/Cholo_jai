import express from 'express';
import { purchaseTicket,viewTicket } from '../controllers/ticket.controller.js';

const router = express.Router();

// Route to purchase a ticket with seat selection
router.post('/purchase', purchaseTicket);

//view ticket
// view ticket route
router.get('/viewticket/:userId', viewTicket);



export default router;
