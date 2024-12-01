import { searchTickets } from "../controllers/seat.controller.js";
import Train from "../models/train.models.js";

jest.mock("../models/train.models.js");

describe("searchTickets Controller", () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      query: {
        from: "Station A",
        to: "Station C",
        date: "2024-12-01",
        type: "AC_CHAIR",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should return 200 and list of tickets when valid search query is provided", async () => {
    const mockTrains = [
      {
        trainName: "Express Train",
        trainCode: "ET123",
        routes: [
          { station: "Station A", durationFromPrevious: "0h 30m" },
          { station: "Station B", durationFromPrevious: "1h 0m" },
          { station: "Station C", durationFromPrevious: "0h 45m" },
        ],
        boggies: [
          { type: "AC_CHAIR", availableSeatsCount: 20 },
          { type: "S_CHAIR", availableSeatsCount: 30 },
        ],
      },
    ];

    Train.find.mockResolvedValue(mockTrains);

    await searchTickets(mockRequest, mockResponse);

    expect(Train.find).toHaveBeenCalledWith({ date: new Date("2024-12-01") });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith([
      {
        from: "Station A",
        to: "Station C",
        searchDate: new Date("2024-12-01"),
        trainName: "Express Train",
        trainNumber: "ET123",
        totalDuration: 75, // 30m + 45m duration
        availableSeats: 20,
        boggyType: "AC_CHAIR",
        ticketPrice: 135, // Price based on totalDuration * 1.8
      },
    ]);
  });

  it("should return 404 if no train matches the search criteria", async () => {
    Train.find.mockResolvedValue([]);

    await searchTickets(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "No train found.",
    });
  });

  it("should handle errors and return 500 status", async () => {
    const errorMessage = "Database error";
    Train.find.mockRejectedValue(new Error(errorMessage));

    await searchTickets(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Error searching for tickets",
      error: errorMessage,
    });
  });

  it("should return filtered trains based on available seats", async () => {
    const mockTrains = [
      {
        trainName: "Express Train",
        trainCode: "ET123",
        routes: [
          { station: "Station A", durationFromPrevious: "0h 30m" },
          { station: "Station B", durationFromPrevious: "1h 0m" },
          { station: "Station C", durationFromPrevious: "0h 45m" },
        ],
        boggies: [
          { type: "AC_CHAIR", availableSeatsCount: 10 },
          { type: "S_CHAIR", availableSeatsCount: 0 },
        ],
      },
    ];

    Train.find.mockResolvedValue(mockTrains);

    await searchTickets(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith([
      {
        from: "Station A",
        to: "Station C",
        searchDate: new Date("2024-12-01"),
        trainName: "Express Train",
        trainNumber: "ET123",
        totalDuration: 75, // 30m + 45m duration
        availableSeats: 10, // Based on the "AC_CHAIR" type with available seats
        boggyType: "AC_CHAIR",
        ticketPrice: 135, // Price based on totalDuration * 1.8
      },
    ]);
  });
});
