import express from 'express';
import { register, login, googleLogin, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.put('/update/:id', updateUser);

export default router;

