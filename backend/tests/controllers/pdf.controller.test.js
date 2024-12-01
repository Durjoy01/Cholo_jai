import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import Ticket from "../models/ticket.models.js";
import { generateTicketPDF } from "../controllers/pdf.controller.js";

jest.mock("fs");
jest.mock("path");
jest.mock("puppeteer");
jest.mock("../models/ticket.models.js");

describe("generateTicketPDF", () => {
  let mockResponse;
  let mockRequest;

  beforeEach(() => {
    mockResponse = {
      setHeader: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      params: {
        ticketId: "12345",
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a PDF and send it as a response", async () => {
    // Mock the Ticket model
    const ticketMock = {
      _id: "12345",
      trainName: "Intercity Express",
      trainNumber: "IC123",
      from: "Dhaka",
      to: "Chittagong",
      date: "2024-12-25",
      purchaseDate: "2024-12-01",
      seatType: "First Class",
      selectedSeats: ["A1", "A2"],
      totalCost: 500,
      user: {
        name: "John Doe",
        email: "johndoe@example.com",
      },
    };
    Ticket.findById.mockResolvedValue(ticketMock);

    // Mock the HTML template loading
    const htmlTemplate = `
      <html>
        <body>
          Ticket ID: {{ticketId}}
          Train Name: {{trainName}}
        </body>
      </html>`;
    fs.readFileSync.mockReturnValue(htmlTemplate);

    // Mock Puppeteer
    const mockPage = {
      setContent: jest.fn(),
      pdf: jest.fn().mockResolvedValue(Buffer.from("Mock PDF Content")),
    };
    const mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn(),
    };
    puppeteer.launch.mockResolvedValue(mockBrowser);

    // Call the function
    await generateTicketPDF(mockRequest, mockResponse);

    // Expectations
    expect(Ticket.findById).toHaveBeenCalledWith("12345");
    expect(fs.readFileSync).toHaveBeenCalledWith(expect.any(String), "utf-8");
    expect(mockPage.setContent).toHaveBeenCalledWith(expect.stringContaining(ticketMock.trainName));
    expect(mockPage.pdf).toHaveBeenCalledWith({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    expect(mockBrowser.close).toHaveBeenCalled();
    expect(mockResponse.setHeader).toHaveBeenCalledWith("Content-Type", "application/pdf");
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      "Content-Disposition",
      "attachment; filename=ticket_12345.pdf"
    );
    expect(mockResponse.send).toHaveBeenCalledWith(Buffer.from("Mock PDF Content"));
  });

  it("should return a 404 error if the ticket is not found", async () => {
    Ticket.findById.mockResolvedValue(null);

    await generateTicketPDF(mockRequest, mockResponse);

    expect(Ticket.findById).toHaveBeenCalledWith("12345");
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Ticket not found" });
  });

  it("should handle errors and return a 500 status", async () => {
    Ticket.findById.mockRejectedValue(new Error("Database error"));

    await generateTicketPDF(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Failed to generate PDF",
      error: "Database error",
    });
  });
});
