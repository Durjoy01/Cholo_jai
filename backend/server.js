import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from './routes/user.Routes.js';
import trainRoutes from './routes/train.routes.js';
import ticketRoutes from './routes/seat.routes.js';
import seatSelectRoutes from './routes/seatselect.routes.js';
import ticketRouter from './routes/ticket.routes.js';
import ticketPdf from './routes/pdf.routes.js';
import payment from './routes/payment.routes.js';



dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

app.use('/api/payment', payment);
app.use('/api/users', userRouter);
app.use('/api/trains', trainRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/bogies', seatSelectRoutes);
app.use('/api/tickets', ticketRouter);
app.use('/api/pdf', ticketPdf);

app.use((err, req, res, next) => {
  console.error("An error occurred:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
