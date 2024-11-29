import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProfileDetails from "./ProfileDetails";
import PurchaseHistory from "./PurchaseHistory";

const Profile = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<ProfileDetails />} />
          <Route path="purchase-history" element={<PurchaseHistory />} />
        </Routes>
      </div>
    </div>
  );
};

export default Profile;
