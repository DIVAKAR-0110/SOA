// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-top-border" />
      <div className="footer-inner">
        <div className="footer-col">
          <h4>Online Complaint Management System</h4>
          <p>
            A unified platform to register and track complaints across multiple
            organizations and departments in India.
          </p>
        </div>

        <div className="footer-col">
          <h5>Quick Links</h5>
          <ul>
            <li>About Us</li>
            <li>Terms &amp; Conditions</li>
            <li>Privacy Policy</li>
            <li>Feedback</li>
            <li>Help Center</li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Contact</h5>
          <p>Email: support@ocms.in</p>
          <p>Phone: +91‑00000‑00000</p>
          <p>Address: New Delhi, India</p>
          <div className="footer-social">
            <span>in</span>
            <span>f</span>
            <span>x</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 Online Complaint Management – All Rights Reserved.
      </div>
    </footer>
  );
}
