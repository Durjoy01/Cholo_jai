import SSLCommerzPayment from "sslcommerz-lts";
import dotenv from "dotenv";

dotenv.config();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;

/**
 * Generates a unique transaction ID using the current timestamp and a random number.
 * 
 * @returns {string} A unique transaction ID.
 * 
 */
const generateTranId = () =>
  `tran_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

/**
 * Initiates the payment process by preparing data and calling the SSLCommerz API.
 * 
 * This function generates a unique transaction ID, constructs a success URL with query parameters,
 * and sends a request to the SSLCommerz API to initiate the payment process.
 * If the initiation is successful, it returns the URL to redirect the user to the payment gateway.
 * 
 * @param {Object} req - The request object containing the payment details.
 * @param {Object} req.body - The request body containing payment details like total cost, train info, user details, etc.
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
 * @param {Object} res - The response object used to send the response to the client.
 * @returns {Object} JSON response containing the URL for redirecting the user to the payment gateway.
 * 
 * @throws {Error} Throws an error if the payment initiation fails, sending a 500 status response.
 * 
 */
export const initPayment = async (req, res) => {
  const tran_id = generateTranId();
  const {
    totalCost,
    userId,
    from,
    to,
    trainNumber,
    trainName,
    searchDate,
    purchaseDate,
    boggyType,
    boggyNumber,
    selectedSeats,
  } = req.body;

  // Encode each parameter individually for proper URL handling
  const success_url = `${process.env.SERVER_API}/api/payment/success?tran_id=${tran_id}&totalCost=${encodeURIComponent(totalCost)}&userId=${encodeURIComponent(userId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&trainNumber=${encodeURIComponent(trainNumber)}&trainName=${encodeURIComponent(trainName)}&searchDate=${encodeURIComponent(searchDate)}&purchaseDate=${encodeURIComponent(purchaseDate)}&boggyType=${encodeURIComponent(boggyType)}&boggyNumber=${encodeURIComponent(boggyNumber)}&selectedSeats=${encodeURIComponent(JSON.stringify(selectedSeats))}`;

  const data = {
    total_amount: totalCost,
    currency: "BDT",
    tran_id: tran_id,
    success_url: success_url,
    fail_url: `${process.env.SERVER_API}/api/payment/fail`,
    cancel_url: `${process.env.SERVER_API}/api/payment/cancel`,
    ipn_url: `${process.env.SERVER_API}/api/payment/ipn`,
    shipping_method: "Courier",
    product_name: "Train Ticket",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_city: "Dhaka",
    ship_postcode: "1000",
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  sslcz
    .init(data)
    .then((apiResponse) => {
      console.log("Full API Response:", apiResponse);
      const GatewayPageURL = apiResponse.GatewayPageURL;
      if (GatewayPageURL) {
        res.send({ url: GatewayPageURL });
      } else {
        res.status(500).send("Failed to initiate payment.");
      }
    })
    .catch((error) => {
      console.error("Payment initiation error:", error);
      res.status(500).send("Payment initiation failed.");
    });
};

/**
 * Handles the success response from the payment gateway.
 * 
 * This function constructs a URL with the payment details and redirects the user to a success page
 * where the payment status is displayed.
 * 
 * @param {Object} req - The request object containing the payment details.
 * @param {Object} req.query - The query parameters containing payment details like total cost, train info, user details, etc.
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
 * 
 */
export const paymentSuccess = (req, res) => {
  // Retrieve transaction details from query parameters
  const { 
    totalCost, userId, from, to, trainNumber, trainName, searchDate, 
    purchaseDate, boggyType, boggyNumber, selectedSeats 
  } = req.query;

  const redirectUrl = `http://localhost:5173/payment?status=success&totalCost=${totalCost}&userId=${userId}&from=${from}&to=${to}&trainNumber=${trainNumber}&trainName=${trainName}&searchDate=${searchDate}&purchaseDate=${purchaseDate}&boggyType=${boggyType}&boggyNumber=${boggyNumber}&selectedSeats=${selectedSeats}`;

  res.redirect(redirectUrl);
};

/**
 * Handles the failure response from the payment gateway.
 * 
 * This function simply redirects the user to the failure page if the payment process fails.
 * 
 * @param {Object} req - The request object containing the failure response.
 * @param {Object} res - The response object used to redirect the user to the failure page.
 * @returns {void} Redirects the user to the failure page with the status as 'failure'.
 * 
 */
export const paymentFail = (req, res) => {
  console.log("Payment fail response:", req.body);
  res.redirect(`http://localhost:5173/payment?status=failure`);
};
