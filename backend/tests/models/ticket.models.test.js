
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Ticket from "../models/ticket.models.js";
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

describe("Ticket Model", () => {
  it("should create and save a ticket successfully", async () => {
    // Assuming you already have a User instance
    const user = new User({
      name: "John Doe",
      email: "johndoe@example.com",
    });
    await user.save();

    const validTicket = new Ticket({
      trainNumber: "ET123",
      trainName: "Express Train",
      from: "Station A",
      to: "Station B",
      date: new Date("2024-12-01"),
      purchaseDate: new Date("2024-12-01"),
      selectedSeats: ["A1", "A2"],
      totalCost: 500,
      boggy: "AC",
      seatType: "AC_CHAIR",
      user: user._id,
    });

    const savedTicket = await validTicket.save();

    expect(savedTicket._id).toBeDefined();
    expect(savedTicket.trainNumber).toBe("ET123");
    expect(savedTicket.trainName).toBe("Express Train");
    expect(savedTicket.selectedSeats).toEqual(["A1", "A2"]);
    expect(savedTicket.totalCost).toBe(500);
    expect(savedTicket.user.toString()).toBe(user._id.toString());
  });

  it("should throw an error if required fields are missing", async () => {
    const invalidTicket = new Ticket({
      // Missing required fields
      trainNumber: "ET123",
      trainName: "Express Train",
      from: "Station A",
      to: "Station B",
      date: new Date("2024-12-01"),
      purchaseDate: new Date("2024-12-01"),
      selectedSeats: ["A1", "A2"],
      totalCost: 500,
      boggy: "AC",
    });

    let error;
    try {
      await invalidTicket.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.user).toBeDefined(); // user is missing
  });
});
