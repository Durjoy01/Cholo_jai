import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

import { register, login, googleLogin, updateUser } from "../controllers/user.controller.js";
import User from "../models/user.models.js";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("google-auth-library", () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        getPayload: jest.fn().mockReturnValue({
          name: "Test User",
          email: "testuser@example.com",
        }),
      }),
    })),
  };
});

// Mock Express App
const app = express();
app.use(express.json());
app.post("/api/user/register", register);
app.post("/api/user/login", login);
app.post("/api/user/googleLogin", googleLogin);
app.put("/api/user/update/:id", updateUser);

// Mock MongoDB connection
beforeAll(async () => {
  mongoose.connect = jest.fn();
});

afterAll(async () => {
  mongoose.connection.close = jest.fn();
});

jest.mock("../models/user.models.js");

describe("User Controller", () => {
  describe("Register User", () => {
    it("should register a new user", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      User.prototype.save = jest.fn().mockResolvedValue();

      const userData = {
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        dob: "2000-01-01",
        address: "Test Address",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/user/register")
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
    });

    it("should return an error if the user already exists", async () => {
      User.findOne.mockResolvedValue({ email: "test@example.com" });

      const response = await request(app)
        .post("/api/user/register")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("Login User", () => {
    it("should login an existing user with correct credentials", async () => {
      const user = {
        id: "12345",
        email: "test@example.com",
        password: "hashedPassword",
      };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mockToken");

      const response = await request(app)
        .post("/api/user/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.token).toBe("mockToken");
    });

    it("should return an error for invalid credentials", async () => {
      User.findOne.mockResolvedValue({ password: "hashedPassword" });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post("/api/user/login")
        .send({ email: "test@example.com", password: "wrongPassword" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });

  describe("Google Login", () => {
    it("should login or register a user via Google", async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue();
      jwt.sign.mockReturnValue("mockToken");

      const response = await request(app)
        .post("/api/user/googleLogin")
        .send({ token: "mockGoogleToken" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Google login successful");
      expect(response.body.token).toBe("mockToken");
    });
  });

  describe("Update User", () => {
    it("should update user information", async () => {
      User.findByIdAndUpdate = jest.fn().mockResolvedValue({
        _id: "12345",
        name: "Updated User",
        email: "updated@example.com",
      });

      const updates = { name: "Updated User", email: "updated@example.com" };

      const response = await request(app)
        .put("/api/user/update/12345")
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User updated successfully");
      expect(response.body.user.name).toBe("Updated User");
    });

    it("should return an error if the user is not found", async () => {
      User.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/user/update/12345")
        .send({ name: "Nonexistent User" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });
});
