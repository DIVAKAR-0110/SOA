import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/JobApplicationSuccess.css";

export default function JobApplicationSuccess() {
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCheckmark(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="job-success-container" role="alert" aria-live="polite">
      <div className={`checkmark-circle ${showCheckmark ? "visible" : ""}`}>
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            className="checkmark-circle-bg"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
        </svg>
      </div>

      <h2>🎉 Application Submitted Successfully!</h2>

      <p>
        Thank you for applying. Your job application has been received and will
        be reviewed by our team shortly.
      </p>

      <p>If shortlisted, we'll get in touch via email or phone.</p>

      <Link to="/jobportal-dashboard" className="btn-link">
        <button type="button" className="btn-primary">
          Go to Home
        </button>
      </Link>
    </div>
  );
}
