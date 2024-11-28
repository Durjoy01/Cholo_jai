import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    trainNumber: {
        type: String,
        required: true,
    },
    trainName: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    purchaseDate: {
        type: Date,
        required: true,
    },
    selectedSeats: {
        type: [String],
        required: true,
    },
    totalCost: {
        type: Number,
        required: true,
    },
    boggy:{
        type: String,
        required: true,
    },
    seatType:{
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export default mongoose.model("Ticket", ticketSchema);
