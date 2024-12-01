import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/user.models.js";

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

describe("User Model", () => {
  it("should create and save a user successfully", async () => {
    const validUser = new User({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "1234567890",
      dob: "1990-01-01",
      address: "123 Main Street",
      password: "securepassword123",
    });

    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe("John Doe");
    expect(savedUser.email).toBe("johndoe@example.com");
    expect(savedUser.phone).toBe("1234567890");
    expect(savedUser.dob).toEqual(new Date("1990-01-01"));
    expect(savedUser.address).toBe("123 Main Street");
    expect(savedUser.password).toBe("securepassword123");
  });

  it("should fail to create a user without a required email", async () => {
    const invalidUser = new User({
      name: "Jane Doe",
      phone: "9876543210",
    });

    let error;
    try {
      await invalidUser.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.email).toBeDefined();
  });

  it("should fail to create a user with a duplicate email", async () => {
    const user1 = new User({
      name: "John Doe",
      email: "duplicate@example.com",
      phone: "1234567890",
    });

    const user2 = new User({
      name: "Jane Doe",
      email: "duplicate@example.com",
      phone: "9876543210",
    });

    await user1.save();

    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(mongoose.Error);
    expect(error.code).toBe(11000); // MongoDB duplicate key error code
  });

  it("should create a user without optional fields", async () => {
    const minimalUser = new User({
      email: "minimal@example.com",
    });

    const savedUser = await minimalUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBeUndefined();
    expect(savedUser.phone).toBeUndefined();
    expect(savedUser.dob).toBeUndefined();
    expect(savedUser.address).toBeUndefined();
    expect(savedUser.password).toBeUndefined();
  });
});
