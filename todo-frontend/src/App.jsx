// src/App.jsx
import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar/Navbar.jsx";
import SplashScreen from "./Components/SplashScreen.jsx";
import HeroSection from "./Components/HeroSection.jsx";
import CategoriesSection from "./Components/CategoriesSection.jsx";
import FloatingActions from "./Components/FloatingActions.jsx";
import Footer from "./Components/Footer/Footer.jsx";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500); // 3.5 sec
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-root">
      {showSplash && <SplashScreen />}

      <Navbar />

      <main className="page-main">
        <HeroSection />
        <CategoriesSection />
      </main>

      <FloatingActions />

      <Footer />
    </div>
  );
}
