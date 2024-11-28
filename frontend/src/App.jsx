import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Profile from "./components/user/Profile.jsx";
import SearchResults from "./components/SearchResults";
import SeatSelection from "./components/SeatSelection";
import Contactus from "./components/Contactus.jsx";
import TermsAndCondition from "./components/TermsAndCondition.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import Traininfo from "./components/Traininfo.jsx";
import Payment from "./components/Payment.jsx";
import "./index.css";

const AppContent = () => {
  const location = useLocation();
  const isProfilePage = location.pathname.startsWith("/profile");
  const isPaymentPage = location.pathname.startsWith("/payment");

  // Determine if Header and Footer should be rendered based on the current page
  const shouldRenderHeaderAndFooter = !isProfilePage && !isPaymentPage;

  return (
    <div className="flex flex-col min-h-screen">
      {shouldRenderHeaderAndFooter && <Header />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/results" element={<SearchResults />} />
          <Route path="/seat-selection" element={<SeatSelection />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/contactus/*" element={<Contactus />} />
          <Route path="/termsandconditions" element={<TermsAndCondition />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/traininfo" element={<Traininfo />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
      {shouldRenderHeaderAndFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AppContent />
  );
};

export default App;
