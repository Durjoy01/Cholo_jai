import Train from '../models/train.models.js';

export const getBogies = async (req, res) => {
  const { trainNumber, searchDate } = req.params;

  try {
    const train = await Train.findOne({ trainCode: trainNumber, date: searchDate }).populate('boggies'); 

    if (!train) {
      return res.status(404).json({ message: 'Train not found for the specified date.' });
    }

    const bogies = train.boggies.map((boggy) => ({
      boggyType: boggy.type,
      boggyNumber: boggy.boggyNumber,
      availableSeats: boggy.availableSeatsCount,
      seats: boggy.seats.map((seat) => ({
        seatNumber: seat.seatNumber,
        isBooked: seat.isBooked,
      })),
    }));

    return res.json(bogies);
  } catch (error) {
    console.error("Error fetching bogies:", error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
