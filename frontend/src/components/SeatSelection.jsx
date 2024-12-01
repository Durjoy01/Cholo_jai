import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../components/user/UserContext";

/**
 * SeatSelection component is responsible for selecting seats on a train,
 * viewing the price breakdown, and initiating the payment process.
 * It fetches bogie data based on the train number and search date, displays
 * available seats, and calculates the total cost. The user can select up to 4 seats
 * and proceed to purchase the ticket.
 *
 * @component
 * @example
 * // Example usage of the SeatSelection component
 * return <SeatSelection />;
 */
const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { trainName, trainNumber, boggyType, searchDate, price, from, to } = location.state || {};

  /**
   * State for storing bogie data fetched from the API.
   * @type {Array<Object>}
   */
  const [bogiesData, setBogiesData] = useState([]);

  /**
   * State for storing the selected bogie information.
   * @type {Object|null}
   */
  const [selectedBogy, setSelectedBogy] = useState(null);

  /**
   * State for storing selected seats.
   * @type {Set<string>}
   */
  const [selectedSeats, setSelectedSeats] = useState(new Set());

  /**
   * State for storing the total cost of the selected seats.
   * @type {number}
   */
  const [totalCost, setTotalCost] = useState(0);

  /**
   * State for storing the base price of the tickets (without additional charges).
   * @type {number}
   */
  const [basePrice, setBasePrice] = useState(0);

  /**
   * Fixed service charge for each ticket.
   * @type {number}
   */
  const [serviceCharge] = useState(5);

  /**
   * State for storing VAT value applied to the base price and service charge.
   * @type {string}
   */
  const [vat, setVat] = useState(0);

  /**
   * Fetches bogie data for the selected train and date and updates the state.
   * Redirects the user to the login page if not logged in.
   * 
   * @returns {void}
   */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBogies = async () => {
      try {
        const response = await fetch(`/api/bogies/${trainNumber}/${searchDate}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setBogiesData(data);
      } catch (error) {
        console.error("Error fetching bogies data:", error);
      }
    };

    fetchBogies();
  }, [user, trainNumber, searchDate, navigate]);

  /**
   * Handles the change in bogie selection and resets seat selection and costs.
   * 
   * @param {React.ChangeEvent<HTMLSelectElement>} event - The change event when a bogie is selected.
   * @returns {void}
   */
  const handleBogyChange = (event) => {
    const selectedBogyNumber = event.target.value;
    const bogy = bogiesData.find((b) => b.boggyNumber === selectedBogyNumber);
    setSelectedBogy(bogy);
    setSelectedSeats(new Set());
    setTotalCost(0);
    setBasePrice(0);
    setVat(0);
  };

  /**
   * Filters the list of bogies based on the selected bogey type.
   * 
   * @returns {Array<Object>} - A filtered list of bogies that match the selected bogey type.
   */
  const filteredBogies = bogiesData.filter((b) => b.boggyType === boggyType);

  /**
   * Handles seat selection or deselection by updating the selected seats set.
   * Ensures no more than 4 seats are selected at once.
   * 
   * @param {string} seatNumber - The seat number to select or deselect.
   * @returns {void}
   */
  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats((prevSelectedSeats) => {
      const newSelectedSeats = new Set(prevSelectedSeats);
      if (newSelectedSeats.has(seatNumber)) {
        newSelectedSeats.delete(seatNumber);
      } else if (newSelectedSeats.size < 4) {
        newSelectedSeats.add(seatNumber);
      }
      calculateTotalCost(newSelectedSeats);
      return newSelectedSeats;
    });
  };

  /**
   * Calculates the total cost, including base price, service charge, and VAT.
   * Updates the corresponding state values for total cost, base price, and VAT.
   * 
   * @param {Set<string>} seats - The set of selected seat numbers.
   * @returns {void}
   */
  const calculateTotalCost = (seats) => {
    const seatCount = seats.size;
    const newBasePrice = price * seatCount;
    const newVat = Math.round(0.03 * (newBasePrice + serviceCharge));
    const total = Math.round(newBasePrice + serviceCharge + newVat);
    setTotalCost(total);
    setBasePrice(newBasePrice);
    setVat(newVat.toFixed(2));
  };

  /**
   * Initiates the payment process by sending the ticket details to the backend.
   * If successful, redirects the user to the payment URL for completing the transaction.
   * 
   * @returns {void}
   */
  const handleBuyTicket = async () => {
    const ticketDetails = {
      totalCost,
      userId: user?.id,
      from,
      to,
      trainNumber,
      trainName,
      searchDate,
      purchaseDate: new Date().toJSON(),
      boggyType,
      boggyNumber: selectedBogy.boggyNumber,
      selectedSeats: Array.from(selectedSeats),
    };

    try {
      const response = await fetch("/api/payment/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketDetails),
      });

      if (!response.ok) {
        throw new Error("Payment initiation failed");
      }

      const data = await response.json();

      if (data.url) {
        window.location.replace(data.url);
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("Payment initiation failed. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-backgroung shadow-lg rounded-lg border border-neutral_grey">
      <h1 className="text-3xl font-bold text-center mb-6 text-neutral_black">Seat Selection</h1>
      {/* JSX content for rendering seat selection */}
    </div>
  );
};

export default SeatSelection;
