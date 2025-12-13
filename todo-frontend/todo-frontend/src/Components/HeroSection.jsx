// src/components/HeroSection.jsx
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Report any civic problem in seconds",
    text: "Road damage, street lights, drainage, and more — all from a unified national portal.",
    image: "/assets/slide1.jpg",
  },
  {
    id: 2,
    title: "Connect directly to the right authority",
    text: "Your complaint is routed to the correct department based on category and location.",
    image: "/assets/slide2.jpg",
  },
  {
    id: 3,
    title: "Track status from registration to resolution",
    text: "Transparent visibility across organizations, with real‑time updates.",
    image: "/assets/slide3.jpg",
  },
  {
    id: 4,
    title: "Attach photos and documents as proof",
    text: "Upload clear images and files to help officials act faster.",
    image: "/assets/slide4.jpg",
  },
  {
    id: 5,
    title: "Designed for every Indian citizen",
    text: "From metros to villages, one digital front door for all complaints.",
    image: "/assets/slide5.jpg",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % slides.length),
      4500
    );
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  const handleRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;
    circle.className = "ripple";
    button.appendChild(circle);
    setTimeout(() => circle.remove(), 500);
  };

  return (
    <section className="hero-wrap">
      <div className="hero-inner">
        {/* Left: slider */}
        <div className="hero-left">
          <p className="hero-tagline">Premium ERP‑style Complaint Dashboard</p>
          <h1 className="hero-heading">{slide.title}</h1>
          <p className="hero-text">{slide.text}</p>

          <div className="hero-controls">
            <button
              className="hero-arrow"
              onClick={() =>
                setIndex((prev) => (prev - 1 + slides.length) % slides.length)
              }
            >
              ‹
            </button>
            <button
              className="hero-arrow"
              onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
            >
              ›
            </button>
          </div>

          <div className="hero-dots-wrap">
            {slides.map((s, i) => (
              <button
                key={s.id}
                className={`hero-dot ${i === index ? "hero-dot--active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* Right: image + CTA */}
        <div className="hero-right">
          <div className="hero-image-shell">
            <img
              src={slide.image}
              alt={slide.title}
              className="hero-main-image"
            />
            <div className="hero-image-overlay">
              <p>Secure • Pan‑India • Multi‑department</p>
            </div>
          </div>

          <button
            className="hero-cta-btn"
            onClick={(e) => {
              handleRipple(e);
              // later: navigation to /raise-complaint
            }}
          >
            Complain Now
          </button>
        </div>
      </div>
    </section>
  );
}
