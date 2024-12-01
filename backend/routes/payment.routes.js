import express from 'express';
import { initPayment, paymentSuccess, paymentFail } from '../controllers/payment.controller.js';

const router = express.Router();

/**
 * @typedef {Object} PaymentRouter
 * @description A set of routes to handle payment-related functionality in the application.
 * Provides endpoints for initiating payments, handling payment success, and handling payment failure.
 */

/**
 * @route POST /api/payment/init
 * @description Initiates the payment process by calling the initPayment controller function.
 * This route is responsible for starting the payment process by generating a transaction ID
 * and redirecting the user to the payment gateway.
 * 
 * @param {Object} req - The request object containing the payment details.
 * @param {Object} req.body - The payment details like total cost, train information, user details, etc.
 * @param {number} req.body.totalCost - The total cost of the transaction.
 * @param {string} req.body.userId - The user ID for the transaction.
 * @param {string} req.body.from - The departure station.
 * @param {string} req.body.to - The arrival station.
 * @param {string} req.body.trainNumber - The unique train number.
 * @param {string} req.body.trainName - The name of the train.
 * @param {string} req.body.searchDate - The search date for the train.
 * @param {string} req.body.purchaseDate - The date of ticket purchase.
 * @param {string} req.body.boggyType - The type of the boggy.
 * @param {string} req.body.boggyNumber - The boggy number.
 * @param {Array} req.body.selectedSeats - The selected seats for the ticket.
 * 
 * @param {Object} res - The response object used to send back the result of the operation.
 * @returns {Object} JSON response containing the URL for redirecting the user to the payment gateway.
 */
router.post('/init', initPayment);

/**
 * @route POST /api/payment/success
 * @description Handles the success response from the payment gateway.
 * This route is triggered after a successful payment and redirects the user to a success page
 * with payment details.
 * 
 * @param {Object} req - The request object containing the payment details (from query parameters).
 * @param {Object} req.query - Query parameters containing payment details like total cost, train information, etc.
 * @param {string} req.query.totalCost - The total cost of the transaction.
 * @param {string} req.query.userId - The user ID for the transaction.
 * @param {string} req.query.from - The departure station.
 * @param {string} req.query.to - The arrival station.
 * @param {string} req.query.trainNumber - The unique train number.
 * @param {string} req.query.trainName - The name of the train.
 * @param {string} req.query.searchDate - The search date for the train.
 * @param {string} req.query.purchaseDate - The date of ticket purchase.
 * @param {string} req.query.boggyType - The type of the boggy.
 * @param {string} req.query.boggyNumber - The boggy number.
 * @param {string} req.query.selectedSeats - The selected seats for the ticket.
 * 
 * @param {Object} res - The response object used to redirect the user to the success page.
 * @returns {void} Redirects the user to the success page with the payment details in the URL.
 */
router.post('/success', paymentSuccess);

/**
 * @route POST /api/payment/fail
 * @description Handles the failure response from the payment gateway.
 * This route is triggered when the payment process fails and redirects the user to a failure page.
 * 
 * @param {Object} req - The request object containing the failure details.
 * @param {Object} res - The response object used to redirect the user to the failure page.
 * @returns {void} Redirects the user to the failure page with the status as 'failure'.
 */
router.post('/fail', paymentFail);

export default router;
