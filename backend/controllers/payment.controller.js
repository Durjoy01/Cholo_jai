import SSLCommerzPayment from "sslcommerz-lts";
import dotenv from "dotenv";

dotenv.config();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;

// Function to create a unique transaction ID using the current timestamp and a random number
const generateTranId = () =>
`tran_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

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

export const paymentSuccess = (req, res) => {
  // Retrieve transaction details from query parameters
  const { 
    totalCost, userId, from, to, trainNumber, trainName, searchDate, 
    purchaseDate, boggyType, boggyNumber, selectedSeats 
  } = req.query;

  const redirectUrl = `http://localhost:5173/payment?status=success&totalCost=${totalCost}&userId=${userId}&from=${from}&to=${to}&trainNumber=${trainNumber}&trainName=${trainName}&searchDate=${searchDate}&purchaseDate=${purchaseDate}&boggyType=${boggyType}&boggyNumber=${boggyNumber}&selectedSeats=${selectedSeats}`;

  res.redirect(redirectUrl);
};


export const paymentFail = (req, res) => {
  console.log("Payment fail response:", req.body);
  res.redirect(`http://localhost:5173/payment?status=failure`);
};
