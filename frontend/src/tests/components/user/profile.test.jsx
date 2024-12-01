import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Profile from "../Profile";
import Sidebar from "../Sidebar";
import ProfileDetails from "../ProfileDetails";
import PurchaseHistory from "../PurchaseHistory";

jest.mock("../Sidebar", () => jest.fn(() => <div data-testid="sidebar">Sidebar</div>));
jest.mock("../ProfileDetails", () => jest.fn(() => <div data-testid="profile-details">Profile Details</div>));
jest.mock("../PurchaseHistory", () => jest.fn(() => <div data-testid="purchase-history">Purchase History</div>));

describe("Profile Component", () => {
  it("renders the Profile component with Sidebar and ProfileDetails by default", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Profile />
      </MemoryRouter>
    );

    // Assert Sidebar and ProfileDetails are rendered
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("profile-details")).toBeInTheDocument();
  });

  it("renders PurchaseHistory when navigating to /purchase-history", () => {
    render(
      <MemoryRouter initialEntries={["/purchase-history"]}>
        <Profile />
      </MemoryRouter>
    );

    // Assert Sidebar and PurchaseHistory are rendered
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("purchase-history")).toBeInTheDocument();
  });

  it("renders the correct route when navigating between pages", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/*" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    // Check default route
    expect(screen.getByTestId("profile-details")).toBeInTheDocument();

    // Simulate navigation to /purchase-history
    render(
      <MemoryRouter initialEntries={["/purchase-history"]}>
        <Routes>
          <Route path="/*" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    // Check PurchaseHistory route
    expect(screen.getByTestId("purchase-history")).toBeInTheDocument();
  });
});
