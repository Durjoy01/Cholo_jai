import express from 'express';
import { generateTicketPDF } from '../controllers/pdf.controller.js';  

const router = express.Router();

// Route to generate PDF for the ticket
router.get('/generateTicketPDF/:ticketId', generateTicketPDF);

export default router;
