import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Train from "../models/train.models.js";
import User from "../models/user.models.js"; // Assuming you have a User model

let mongoServer;

beforeAll(async () => {
  // Start an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Close the connection and stop the in-memory server
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("Train Model", () => {
  it("should create and save a train successfully", async () => {
    const validTrain = new Train({
      trainName: "Express Train",
      trainCode: "ET123",
      date: new Date("2024-12-01"),
      day: "Monday",
      runsOn: ["Mon", "Wed", "Fri"],
      offDay: "Sun",
      routes: [
        { station: "Station A", arrivalTime: new Date(), departureTime: new Date(), durationFromPrevious: "0h 30m" },
        { station: "Station B", arrivalTime: new Date(), departureTime: new Date(), durationFromPrevious: "1h 0m" },
        { station: "Station C", arrivalTime: new Date(), departureTime: new Date(), durationFromPrevious: "0h 45m" },
      ],
      boggies: [
        {
          boggyNumber: "B1",
          type: "AC",
          seats: [{ seatNumber: 1, isBooked: false }],
          availableSeatsCount: 10,
        },
      ],
      totalDuration: "2h 15m",
    });

    const savedTrain = await validTrain.save();

    expect(savedTrain._id).toBeDefined();
    expect(savedTrain.trainName).toBe("Express Train");
    expect(savedTrain.routes.length).toBe(3);
    expect(savedTrain.boggies.length).toBe(1);
    expect(savedTrain.boggies[0].seats.length).toBe(1);
  });

  it("should throw an error if required fields are missing", async () => {
    const invalidTrain = new Train({
      // Missing required fields
      trainName: "Express Train",
      trainCode: "ET123",
      date: new Date("2024-12-01"),
      day: "Monday",
      runsOn: ["Mon", "Wed", "Fri"],
    });

    let error;
    try {
      await invalidTrain.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.routes).toBeDefined(); // routes is missing
  });
});
