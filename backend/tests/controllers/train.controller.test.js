import { addTrain } from "../controllers/train.controller.js";
import Train from "../models/train.models.js";

jest.mock("../models/train.models.js");

describe("addTrain Controller", () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        trainName: "Express Train",
        trainCode: "ET123",
        date: "2024-12-01",
        day: "Monday",
        runsOn: ["Monday", "Wednesday", "Friday"],
        offDay: "Sunday",
        routes: ["Station A", "Station B", "Station C"],
        boggies: [
          { type: "AC", seats: 50 },
          { type: "Non-AC", seats: 100 },
        ],
        totalDuration: "5h 30m",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should add a train successfully and return 201 status", async () => {
    const mockSavedTrain = {
      ...mockRequest.body,
      _id: "1234567890",
    };

    Train.prototype.save = jest.fn().mockResolvedValue(mockSavedTrain);

    await addTrain(mockRequest, mockResponse);

    expect(Train.prototype.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Train added successfully",
      train: mockSavedTrain,
    });
  });

  it("should return 400 if off day is the same as running day", async () => {
    mockRequest.body.offDay = "Monday"; // Same as running day

    await addTrain(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Off day can't be same as running day",
    });
  });

  it("should handle errors and return 500 status", async () => {
    const errorMessage = "Database error";
    Train.prototype.save = jest.fn().mockRejectedValue(new Error(errorMessage));

    await addTrain(mockRequest, mockResponse);

    expect(Train.prototype.save).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Error adding train",
      error: errorMessage,
    });
  });
});
