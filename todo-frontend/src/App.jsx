// src/App.jsx
import { useEffect, useState } from "react";
import SplashScreen from "./Components/SplashScreen";
import Home from "./Components/Home.jsx";
import Complaints from "./Components/Complaints.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CitizenSignup from "./Components/Signup/CitizenSignup.jsx";
import AboutUs from "./Components/About/AboutUs.jsx";
import ContactUs from "./Components/ContactUs/ContactUs.jsx";
import CitizenLogin from "./Components/Login/CitizenLogin.jsx";
import RolePortal from "./Components/RolePortal/RolePortal.jsx";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <BrowserRouter>
      <div className="page-root">
        {showSplash ? (
          <SplashScreen />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/start_complaints" element={<Complaints />} />

            <Route path="/citizen_signup" element={<CitizenSignup />} />
            <Route path="/citizen_login" element={<CitizenLogin />} />
            <Route path="/about_us" element={<AboutUs />} />
            <Route path="/contact_us" element={<ContactUs />} />

            <Route path="/start" element={<RolePortal />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}
