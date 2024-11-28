import Ticket from "../models/ticket.models.js";
import trains from "../models/train.models.js";
import mongoose from "mongoose";

// Purchase Ticket Controller
export const purchaseTicket = async (req, res) => {
  try {
    const {
      trainNumber,
      trainName,
      from,
      to,
      date, // The journey date
      purchaseDate, // The date of ticket purchase
      selectedSeats,
      boggy,
      seatType,
      user,
      totalCost,
    } = req.body;

    // Validate required fields
    if (
      !trainNumber ||
      !trainName ||
      !from ||
      !to ||
      !date ||
      !selectedSeats ||
      !user ||
      !totalCost ||
      !boggy ||
      !seatType ||
      !purchaseDate
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new ticket with the purchase date and train journey date
    const ticket = new Ticket({
      trainNumber,
      trainName,
      from,
      to,
      date,
      purchaseDate,
      selectedSeats,
      boggy,
      seatType,
      totalCost,
      user,
    });

    await ticket.save();
    

    // Call updateSeats API
    await updateSeats(trainNumber, selectedSeats, user, boggy, date); // Pass journey date as parameter

    res.status(201).json({ message: "Ticket reserved successfully", ticket });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to purchase ticket", error: error.message });
  }
};

// Update Seats Function
const updateSeats = async (
  trainNumber,
  selectedSeats,
  userId,
  boggiesNumber,
  trainDate
) => {
  const trainCode = trainNumber;
  const date = trainDate;

  try {
    // Find the train with both trainNumber and trainDate
    const train = await trains.findOne({ trainCode, date }); // Use Train model here

    if (!train) {
      throw new Error("Train not found");
    }

    // Find the specified boggy
    const boggy = train.boggies.find((b) => b.boggyNumber === boggiesNumber);
    if (!boggy) {
      throw new Error("Boggy not found");
    }

    // Loop through selected seats and update them
    selectedSeats.forEach((seatNumber) => {
      const seat = boggy.seats.find(
        (seat) => seat.seatNumber === parseInt(seatNumber)
      );
      if (seat && !seat.isBooked) {
        seat.isBooked = true; // Mark the seat as booked
        seat.userId = userId; // Assign the user ID to the seat
        boggy.availableSeatsCount--; // Decrease available seat count
      }
    });

    await train.save();
  } catch (error) {
    throw new Error(`Failed to update seats: ${error.message}`);
  }
};

// Get Ticket by ID
export const viewTicket = async (req, res) => {
  try {
    const { userId } = req.params; // Ensure lowercase 'userId'
    const tickets = await Ticket.find({ user: new mongoose.Types.ObjectId(userId) });

    if (tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found" });
    }

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Failed to get tickets", error: error.message });
  }
};





