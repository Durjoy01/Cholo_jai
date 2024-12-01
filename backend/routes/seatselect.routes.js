import express from 'express';
import { getBogies } from '../controllers/seatselect.controller.js';

const router = express.Router();

/**
 * @typedef {Object} SeatSelectRouter
 * @description A router that provides the endpoint for fetching bogies of a train for a specific date.
 * The route accepts the train number and search date as parameters and returns the available bogie information.
 */

/**
 * @route GET /api/seatselect/:trainNumber/:searchDate
 * @description Retrieves the bogies for a specific train on a given date.
 * This route is responsible for fetching the available bogies of a particular train based on the train number
 * and the search date, and it returns detailed seat availability information.
 * 
 * @param {string} trainNumber - The unique identifier for the train.
 * @param {string} searchDate - The date for which the bogie information is required.
 * 
 * @param {Object} req - The request object containing the train number and search date.
 * @param {string} req.params.trainNumber - The train number for which the bogies are being queried.
 * @param {string} req.params.searchDate - The date for which the bogie information is being queried.
 * 
 * @param {Object} res - The response object used to send back the bogie information or errors.
 * @returns {Object} JSON response containing the bogie details like available seats, seat numbers, and booking status.
 */
router.get('/:trainNumber/:searchDate', getBogies);

export default router;

