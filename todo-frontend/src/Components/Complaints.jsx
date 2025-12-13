// src/Complaints.jsx
import React from "react";
//import { useState, useEffect } from "react";
import "../styles/complaints.css";

const MODULES = [
  {
    id: "civic",
    title: "Civic & Public Utilities",
    icon: "🏙️",
    color: "civic",
    covers: [
      "Potholes, damaged roads, broken footpaths and unsafe crossings.",
      "Streetlights not working, always on, flickering or damaged poles.",
      "Garbage dumping, irregular collection, dirty public toilets, stray animals.",
      "Waterlogging, blocked drains, water supply interruptions, low pressure.",
      "Basic electricity supply issues in your area (not individual appliance faults).",
    ],
    role: [
      "Share exact location, landmark and photos of the issue for faster resolution.",
      "Mention how long the problem exists and how it affects daily life (safety, access, health).",
      "Avoid abusive language; focus on facts so local bodies can prioritize correctly.",
    ],
    avoid:
      "Do not use this for crimes (assault, theft) or serious safety emergencies. Call police or emergency services instead.",
  },
  {
    id: "governance",
    title: "Governance & Administration",
    icon: "🏛️",
    color: "governance",
    covers: [
      "Delays in certificates, approvals, subsidies or other government services.",
      "Rude behaviour, negligence, corruption, or demand for bribes by officials.",
      "Issues in government schemes, unfair or restrictive trade practices.",
      "Unauthorized construction, land encroachments, building plan violations.",
    ],
    role: [
      "Describe the department/office, service requested and timelines already crossed.",
      "Record dates, receipt numbers and names/designations of officials you interacted with.",
      "Attach copies of receipts, notices or order copies whenever possible.",
    ],
    avoid:
      "Do not use this for private commercial disputes like purely private contracts unless linked to a government scheme.",
  },
  {
    id: "criminal",
    title: "Criminal & Legal",
    icon: "⚖️",
    color: "criminal",
    covers: [
      "Assault, theft, domestic violence, dowry issues, matrimonial harassment, murder.",
      "Cyber crimes: online financial frauds, account hacks, fake profiles, doxxing.",
      "Child sexual exploitation material (CSEAM), stalking, serious threats.",
    ],
    role: [
      "Use this when you need formal FIR/complaint to police or relevant authority.",
      "Clearly mention date, time, location, and a factual description of what happened.",
      "Preserve evidence: messages, screenshots, CCTV clips, transaction proofs.",
    ],
    avoid:
      "Do not file fake or exaggerated criminal complaints; false reporting is itself a punishable offence.",
  },
  {
    id: "electoral",
    title: "Electoral Violations (cVIGIL)",
    icon: "🗳️",
    color: "electoral",
    covers: [
      "Cash, gifts, liquor distribution to influence voters.",
      "Illegal banners/hoardings, hate speech, communal campaigning.",
      "Campaigning near polling stations, transporting voters illegally, ‘paid news’.",
    ],
    role: [
      "Capture photo/video with location and time if it is safe to do so.",
      "Describe the party/candidate involved, type of violation and exact place.",
      "Use official election apps/helplines (like cVIGIL) wherever mandated.",
    ],
    avoid:
      "Avoid personal confrontations at the spot. Your safety is more important than confronting violators directly.",
  },
  {
    id: "consumer",
    title: "Consumer & Product",
    icon: "🛍️",
    color: "consumer",
    covers: [
      "Defective, expired, fake or substandard products.",
      "Services not delivered as promised, misleading advertisements.",
      "Overcharging above printed MRP, online purchase issues, refund problems.",
    ],
    role: [
      "Keep bills, invoices, order IDs and communication with seller/service provider.",
      "Explain what was promised and what exactly went wrong (defect, delay, denial).",
      "First try customer care/Grievance Cell, then escalate to consumer forum if unresolved.",
    ],
    avoid:
      "Do not use this for employer–employee disputes, property disputes or purely personal disagreements.",
  },
  {
    id: "police",
    title: "Police Misconduct",
    icon: "👮‍♂️",
    color: "police",
    covers: [
      "Corruption, demand for bribe, or illegal detention by police officers.",
      "Use of excessive force, custodial violence, or serious human rights violations.",
      "Refusal to register FIR in serious cases despite clear information.",
    ],
    role: [
      "Note station name, officer name/rank (if known), date, time and what was said or done.",
      "Mention if you already approached higher police officers or complaint bodies.",
      "Share medical reports, photos, audio/video only if safe and legal to do so.",
    ],
    avoid:
      "For immediate danger or ongoing violence, prioritize safety and call emergency helplines before filing an online grievance.",
  },
];

export default function Complaints({ onBack }) {
  return (
    <div className="complaints-page">
      <header className="complaints-header">
        <button
          className="complaints-back-btn"
          onClick={onBack || (() => window.history.back())}
        >
          ← Back
        </button>
        <div className="complaints-title-block">
          <h1>Complaints Module</h1>
          <p>
            Understand different complaint categories and your role as a citizen
            before filing a case in the OCMS portal.
          </p>
        </div>
      </header>

      <main className="complaints-grid">
        {MODULES.map((m) => (
          <section
            key={m.id}
            className={`complaint-card complaint-card--${m.color}`}
          >
            <div className="complaint-card-ribbon">
              <span className="complaint-card-icon">{m.icon}</span>
              <span className="complaint-card-title">{m.title}</span>
            </div>

            <div className="complaint-card-body">
              <div className="complaint-card-section">
                <h2>What this covers</h2>
                <ul>
                  {m.covers.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="complaint-card-section">
                <h2>Your role as a citizen</h2>
                <ul>
                  {m.role.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="complaint-card-section complaint-card-section--note">
                <h2>Do not use this when</h2>
                <p>{m.avoid}</p>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
