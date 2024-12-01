import Train from '../models/train.models.js';

/**
 * Controller function to fetch bogies data for a specific train on a specific date.
 * 
 * This function retrieves the train information from the database based on the provided
 * train number and search date. If the train is found, it populates the boggies (carriages)
 * for that train and returns a list of bogies with available seats and seat details.
 * If the train is not found or an error occurs, an appropriate error message is returned.
 * 
 * @param {Object} req - The request object containing the train number and search date.
 * @param {Object} req.params - The route parameters containing the `trainNumber` and `searchDate`.
 * @param {string} req.params.trainNumber - The unique identifier for the train.
 * @param {string} req.params.searchDate - The date for which to check the train's bogies.
 * 
 * @param {Object} res - The response object used to send the response back to the client.
 * @returns {Object} A JSON response containing either the bogies data or an error message.
 * 
 * @throws {Error} Throws an error if fetching the bogies fails due to a server issue.
 *
 */
export const getBogies = async (req, res) => {
  const { trainNumber, searchDate } = req.params;

  try {
    // Fetch train details based on the train number and search date
    const train = await Train.findOne({ trainCode: trainNumber, date: searchDate }).populate('boggies'); 

    // Return error if train is not found
    if (!train) {
      return res.status(404).json({ message: 'Train not found for the specified date.' });
    }

    // Process and return bogies data
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
    // Log error and return a 500 server error response
    console.error("Error fetching bogies:", error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
