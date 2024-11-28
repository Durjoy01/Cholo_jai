import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fromStation: "",
    toStation: "",
    travelDate: "",
    seatType: "",
  });
  const [stationOptions] = useState([
    "Abdulpur",
"Akkelpur",
"Akhaura",
"Azampur",
"Alamdanga",
"Arani",
"B Birampur",
"Biman Bandar",
"Bhanugach",
"Bamondanga",
"Borashi",
"Boral Bridge",
"Baharpur",
"Boalmari Bazar",
"Bhairab Bazar",
"Brahmanbaria",
"Birampur",
"Bogura",
"Bhanga",
"Bonar Para",
"Bheramara",
"BBSetu E",
"Chatmohar",
"Chirirbandar",
"Chandradighalia",
"Choto Bahirbag",
"Chittagong",
"Chuadanga",
"Chapta",
"Chilahati",
"Cumilla",
"Dhaka",
"Dewanganj Bazar",
"Dinajpur",
"Daulatpur",
"Domar",
"Darshana Halt",
"Fulbari",
"Feni",
"Faridpur",
"Gaibandha",
"Gunabati",
"Gobra",
"Gafargaon",
"Gopalganj",
"Ishwardi Bypass",
"Islampur Bazar",
"Ishwardi",
"Jamtail",
"Joydebpur",
"Joypurhat",
"Jashore",
"Jamalpur Town",
"Kismat",
"Kaunia",
"Kotchandpur",
"Kashiani",
"Kurigram",
"Khulna",
"Kushtia Court",
"Kumarkhali",
"Kalukhali",
"Kulaura",
"Khoksha",
"Laksam",
"Mymensingh",
"Mubarakganj",
"Madhukhali",
"Melandah Bazar",
"Maijgaon",
"Natore",
"Nandina",
"Nayapara",
"Noapara",
"Naliagram",
"Nilphamari",
"Parbatipur",
"Panchbibi",
"Poradaha",
"Pangsha",
"Piyarpur",
"Pirganj",
"Rajshahi",
"Ruhia",
"Rajbari",
"Santahar",
"Sardah Road",
"Setabganj",
"SH M Monsur Ali",
"Sonatola",
"Shaistaganj",
"Sylhet",
"Sreemangal",
"Saidpur",
"Talora",
"Thakurgaon Road",
"Tangail",
"Ullapara",
"Pirganj",
"Rangpur",
"Rajshahi",
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState({
    fromStation: false,
    toStation: false,
  });
  const [loading, setLoading] = useState(false);

  // Get today's date to set as the minimum travel date
  const today = new Date().toISOString().split("T")[0];

  const handleStationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (value) {
      const filteredSuggestions = stationOptions.filter((station) =>
        station.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions((prev) => ({ ...prev, [field]: true }));
    } else {
      setShowSuggestions((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSelectSuggestion = (field, suggestion) => {
    setFormData((prev) => ({
      ...prev,
      [field]: suggestion,
    }));
    setShowSuggestions((prev) => ({ ...prev, [field]: false }));
  };

  const handleBlur = (field) => {
    setTimeout(() => {
      setShowSuggestions((prev) => ({ ...prev, [field]: false }));
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { fromStation, toStation, travelDate, seatType } = formData;

    try {
      const response = await fetch(
        `/api/tickets/search?from=${fromStation}&to=${toStation}&date=${travelDate}&type=${seatType}`
      );
      const data = await response.json();
      navigate("/results", { state: { results: data } });
    } catch (error) {
      console.error("Error fetching train data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto p-6 mt-6 flex flex-col lg:flex-row justify-between items-center">
        <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
          {loading ? (
            <div className="loading-spinner">loading...</div>
          ) : (
            <form
              className="bg-white p-8 rounded-lg shadow-md"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="From Station"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green3"
                    value={formData.fromStation}
                    onChange={(e) =>
                      handleStationChange("fromStation", e.target.value)
                    }
                    onBlur={() => handleBlur("fromStation")}
                  />
                  {showSuggestions.fromStation && (
                    <div className="absolute bg-white border rounded-md w-full mt-1 shadow-lg z-10 max-h-40 overflow-y-auto">
                      {suggestions.length ? (
                        suggestions.map((suggestion) => (
                          <div
                            key={suggestion}
                            onClick={() =>
                              handleSelectSuggestion("fromStation", suggestion)
                            }
                            className="p-2 cursor-pointer hover:bg-gray-200"
                          >
                            {suggestion}
                          </div>
                        ))
                      ) : (
                        <div className="p-2">No suggestions</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="To Station"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green3"
                    value={formData.toStation}
                    onChange={(e) =>
                      handleStationChange("toStation", e.target.value)
                    }
                    onBlur={() => handleBlur("toStation")}
                  />
                  {showSuggestions.toStation && (
                    <div className="absolute bg-white border rounded-md w-full mt-1 shadow-lg z-10 max-h-40 overflow-y-auto">
                      {suggestions.length ? (
                        suggestions.map((suggestion) => (
                          <div
                            key={suggestion}
                            onClick={() =>
                              handleSelectSuggestion("toStation", suggestion)
                            }
                            className="p-2 cursor-pointer hover:bg-gray-200"
                          >
                            {suggestion}
                          </div>
                        ))
                      ) : (
                        <div className="p-2">No suggestions</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <input
                  type="date"
                  name="travelDate"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green3"
                  value={formData.travelDate}
                  onChange={(e) =>
                    handleStationChange("travelDate", e.target.value)
                  }
                  min={today}
                  required
                />
                <select
                  name="seatType"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary_green3"
                  value={formData.seatType}
                  onChange={(e) =>
                    handleStationChange("seatType", e.target.value)
                  }
                  required
                >
                  <option value="" disabled>
                    Select Seat Type
                  </option>
                  <option value="AC_B">AC_B</option>
                  <option value="AC_S">AC_S</option>
                  <option value="SNIGDHA">SNIGDHA</option>
                  <option value="F_BERTH">F_BERTH</option>
                  <option value="F_SEAT">F_SEAT</option>
                  <option value="F_CHAIR">F_CHAIR</option>
                  <option value="S_CHAIR">S_CHAIR</option>
                  <option value="SHULOV">SHULOV</option>
                  <option value="SHOVAN">SHOVAN</option>
                  <option value="AC_CHAIR">AC_CHAIR</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-[#21A75C] hover:bg-[#1b9450] text-white rounded-md transition-colors"
              >
                Search Trains
              </button>
            </form>
          )}
        </div>

        <div className="container mx-auto p-6 mt-6 flex flex-col lg:flex-row justify-between items-center">
          <img
            src="/train.png"
            alt="Train Journey"
            className="hidden lg:block w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-background p-6 rounded-lg shadow-md">
        <div className="flex justify-around mb-8 ">
          <div className="text-center">
            <img
              aria-hidden="true"
              alt="Search Icon"
              src="https://openui.fly.dev/openui/24x24.svg?text=🔍"
              className="mx-auto mb-2"
            />
            <h3 className="text-lg font-semibold">Search</h3>
            <p className="text-muted-foreground">Choose your origin, destination, journey dates and search for trains</p>
          </div>
          <div className="text-center">
            <img
              aria-hidden="true"
              alt="Select Icon"
              src="https://openui.fly.dev/openui/24x24.svg?text=📋"
              className="mx-auto mb-2"
            />
            <h3 className="text-lg font-semibold">Select</h3>
            <p className="text-muted-foreground">Select your desired seats and choose</p>
          </div>
          <div className="text-center">
            <img
              aria-hidden="true"
              alt="Pay Icon"
              src="https://openui.fly.dev/openui/24x24.svg?text=💳"
              className="mx-auto mb-2"
            />
            <h3 className="text-lg font-semibold">Pay</h3>
            <p className="text-muted-foreground">Pay for the tickets via Debit / Credit Cards or MFS</p>
          </div>
        </div>

        <div className="container mx-auto p-6 mt-6 flex flex-col lg:flex-row justify-between items-center">
          <div>
            <img
              src="/ticketbuying.png"
              alt="Train Journey"
              className="hidden lg:block w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="flex-grow, p-6 ,mt-6">
        <h2 className="text-xl font-bold text-primary mb-4">Instructions to Purchase Tickets</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Tickets can be bought online ten days in advance.</li>
          <li>
            You can pay for the tickets using mobile financial services: 
            <span className="font-semibold"> Bkash, Nagad, Rocket, Upay</span> or debit/credit cards: 
            <span className="font-semibold"> Mastercard, Visa, DBBL Nexus</span>. Other payment options will be available soon.
          </li>
          <li>
            In case of payment or transaction failure, the deducted amount would be refunded by your bank or MFS provider within 8 business days.
          </li>
          <li>
            In case money has been deducted from your card/mobile wallet but you have not received a ticket confirmation, the deducted amount would be refunded by your bank or MFS provider within 8 business days.
          </li>
          <li>
            If you have not received your ticket copy in email, kindly check your Spam/Junk folder. You can also download your ticket copy from the purchase history of your account after you login.
          </li>
        </ul>
      </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
