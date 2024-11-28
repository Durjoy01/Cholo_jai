import express from 'express';
import { addTrain, viewRoute } from '../controllers/train.controller.js';

const router = express.Router();

router.post('/add', addTrain);
router.get('/viewRoute', viewRoute);


export default router;