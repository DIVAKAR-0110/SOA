import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/layout.css";
import "./Components/Navbar/Navbar.css";
import "./styles/slider.css";
import "./styles/complaint-cards.css";
import "./styles/animations.css";
import "./Components/Footer/Footer.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
