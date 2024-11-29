import express from 'express';
import {initPayment, paymentSuccess,paymentFail} from '../controllers/payment.controller.js';


const router = express.Router();

router.post('/init', initPayment);
router.post('/success', paymentSuccess);
router.post('/fail', paymentFail);

export default router;