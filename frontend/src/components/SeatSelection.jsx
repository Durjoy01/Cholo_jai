import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../components/user/UserContext";

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { trainName, trainNumber, boggyType, searchDate, price, from, to } = location.state || {};

  const [bogiesData, setBogiesData] = useState([]);
  const [selectedBogy, setSelectedBogy] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [totalCost, setTotalCost] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [serviceCharge] = useState(5);
  const [vat, setVat] = useState(0);

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

  const handleBogyChange = (event) => {
    const selectedBogyNumber = event.target.value;
    const bogy = bogiesData.find((b) => b.boggyNumber === selectedBogyNumber);
    setSelectedBogy(bogy);
    setSelectedSeats(new Set());
    setTotalCost(0);
    setBasePrice(0);
    setVat(0);
  };

  const filteredBogies = bogiesData.filter((b) => b.boggyType === boggyType);

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

  const calculateTotalCost = (seats) => {
    const seatCount = seats.size;
    const newBasePrice = price * seatCount;
    const newVat = Math.round(0.03 * (newBasePrice + serviceCharge));
    const total = Math.round(newBasePrice + serviceCharge + newVat);
    setTotalCost(total);
    setBasePrice(newBasePrice);
    setVat(newVat.toFixed(2));
  };

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
      <div className="mb-4 space-y-2">
        <p className="text-lg text-neutral_black1">
          Train Name: <strong className="text-neutral_black">{trainName}</strong>
        </p>
        <p className="text-lg text-neutral_black1">
          Train Number: <strong className="text-gray-800">{trainNumber}</strong>
        </p>
        <p className="text-lg text-neutral_black1">
          Boggy Type: <strong className="text-gray-800">{boggyType}</strong>
        </p>
        <p className="text-lg text-neutral_black1">
          Search Date: <strong className="text-gray-800">{searchDate}</strong>
        </p>
      </div>
      <label htmlFor="boggy-select" className="block mb-2 text-lg font-semibold">Select Boggy:</label>
      <select
        id="boggy-select"
        className="border border-neutral_grey p-2 rounded-md mb-4 w-full bg-backgroung transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary_green3"
        onChange={handleBogyChange}
      >
        <option value="" className="bg-white text-gray-900">--Please choose an option--</option>
        {filteredBogies.length > 0 ? (
          filteredBogies.map((bogy, index) => (
            <option key={`${bogy.boggyNumber}-${index}`} value={bogy.boggyNumber}>
              Boggy {bogy.boggyNumber} (Available Seats: {bogy.availableSeats})
            </option>
          ))
        ) : (
          <option disabled>No bogies available for this type</option>
        )}
      </select>
      {selectedBogy && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Seats for Boggy {selectedBogy.boggyNumber}</h2>
          <div className="grid grid-cols-5 gap-4">
            {selectedBogy.seats.map((seat) => {
              const isBooked = seat.isBooked;
              const isSelected = selectedSeats.has(seat.seatNumber);
              return (
                <button
                  key={seat.seatNumber}
                  onClick={() => !isBooked && handleSeatSelect(seat.seatNumber)}
                  className={`w-16 h-16 rounded-lg shadow-md transition duration-300
                    ${isBooked ? "bg-secondary_red text-white cursor-not-allowed" : isSelected ? "bg-primary_green1 text-white" : "bg-gray-200 hover:bg-gray-300"}
                    ${isBooked ? "opacity-75" : ""} flex items-center justify-center text-xl text-gray-800`}
                  disabled={isBooked}
                >
                  {seat.seatNumber}
                </button>
              );
            })}
          </div>
          <p className="mt-16 text-lg font-semibold">
            Selected Seats: <strong className="text-secondary_red1">{Array.from(selectedSeats).join(", ")}</strong>
          </p>
          <div className="mt-4 border-t border-gray-300 pt-4">
            <p className="text-lg font-semibold text-center">Price Breakdown:</p>
            <div className="flex justify-between text-lg">
              <span>Base Price:</span>
              <strong>৳ {Math.round(basePrice)}</strong>
            </div>
            <div className="flex justify-between text-lg">
              <span>Service Charge:</span>
              <strong>৳ {serviceCharge}</strong>
            </div>
            <div className="flex justify-between text-lg">
              <span>VAT (3%):</span>
              <strong>৳ {vat}</strong>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Cost:</span>
              <strong className="text-green-600">৳ {totalCost}</strong>
            </div>
          </div>
          <button
            className="mt-4 w-full py-2 bg-primary_green1 text-white font-semibold rounded-md hover:bg-primary_green2 transition duration-300"
            onClick={handleBuyTicket}
          >
            Buy Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
