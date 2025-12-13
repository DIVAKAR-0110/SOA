// src/pages/CitizenSignup.jsx
import { useState } from "react";
import "./CitizenSignup.css";
import { useNavigate } from "react-router-dom";

const initialForm = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  mobile: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: "India",
  state: "",
  district: "",
  city: "",
  pincode: "",
  addressLine1: "",
  addressLine2: "",
  govIdType: "",
  govIdLast4: "",
  altPhone: "",
  language: "English",
  notifySms: true,
  notifyEmail: true,
  notifyWhatsApp: false,
  securityQuestion: "",
  securityAnswer: "",
  acceptTerms: false,
  acceptPrivacy: false,
};

export default function CitizenSignup() {
  const [form, setForm] = useState(initialForm);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // form | otp | done
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.acceptTerms || !form.acceptPrivacy) {
      setMessage("Please accept Terms and Privacy Policy.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/register/prepare",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Failed to send OTP.");
      } else {
        setMessage("OTP sent to your email. Please check your inbox.");
        setStep("otp");
      }
    } catch (err) {
      setMessage("Network error while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!otp) {
      setMessage("Enter the OTP you received.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/register/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, otp }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Invalid or expired OTP.");
      } else {
        setMessage("Registration successful. You can now login.");
        setStep("done");
      }
    } catch (err) {
      setMessage("Network error while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const STATES_AND_UTS = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",

    // UTs
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra & Nagar Haveli and Daman & Diu",
    "Delhi",
    "Jammu & Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const DISTRICTS = {
    "Tamil Nadu": [
      "Ariyalur",
      "Chengalpattu",
      "Chennai",
      "Coimbatore",
      "Cuddalore",
      "Dharmapuri",
      "Dindigul",
      "Erode",
      "Kallakurichi",
      "Kanchipuram",
      "Kanyakumari",
      "Karur",
      "Krishnagiri",
      "Madurai",
      "Nagapattinam",
      "Namakkal",
      "Nilgiris",
      "Perambalur",
      "Pudukkottai",
      "Ramanathapuram",
      "Ranipet",
      "Salem",
      "Sivaganga",
      "Tenkasi",
      "Thanjavur",
      "Theni",
      "Thoothukudi",
      "Tiruchirappalli",
      "Tirunelveli",
      "Tirupathur",
      "Tiruppur",
      "Tiruvallur",
      "Tiruvannamalai",
      "Tiruvarur",
      "Vellore",
      "Viluppuram",
      "Virudhunagar",
    ],

    Karnataka: [
      "Bagalkot",
      "Ballari",
      "Belagavi",
      "Bengaluru Rural",
      "Bengaluru Urban",
      "Bidar",
      "Chamarajanagar",
      "Chikkaballapur",
      "Chikkamagaluru",
      "Chitradurga",
      "Dakshina Kannada",
      "Davangere",
      "Dharwad",
      "Gadag",
      "Hassan",
      "Haveri",
      "Kalaburagi",
      "Kodagu",
      "Kolar",
      "Koppal",
      "Mandya",
      "Mysuru",
      "Raichur",
      "Ramanagara",
      "Shivamogga",
      "Tumakuru",
      "Udupi",
      "Uttara Kannada",
      "Vijayapura",
      "Yadgir",
    ],

    Kerala: [
      "Alappuzha",
      "Ernakulam",
      "Idukki",
      "Kannur",
      "Kasaragod",
      "Kollam",
      "Kottayam",
      "Kozhikode",
      "Malappuram",
      "Palakkad",
      "Pathanamthitta",
      "Thiruvananthapuram",
      "Thrissur",
      "Wayanad",
    ],
  };

  const CITIES = {
    Chennai: [
      "Teynampet",
      "Velachery",
      "Adyar",
      "Anna Nagar",
      "Perambur",
      "Kodambakkam",
      "Sholinganallur",
      "Tondiarpet",
    ],

    Coimbatore: [
      "Gandhipuram",
      "RS Puram",
      "Peelamedu",
      "Saibaba Colony",
      "Town Hall",
      "Race Course",
    ],

    "Bengaluru Urban": [
      "Whitefield",
      "Koramangala",
      "Indiranagar",
      "Jayanagar",
      "HSR Layout",
      "Yelahanka",
      "Malleshwaram",
    ],

    Ernakulam: ["Kochi", "Kaloor", "Edappally", "Fort Kochi", "Mattancherry"],
  };

  return (
    <>
      <div
        style={{
          minHeight: "29px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3c72, #2a5298)",
          color: "#ffffff",
          fontFamily: "Segoe UI, sans-serif",
          textAlign: "center",
          padding: "20px",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            top: "30px",
            left: "30px",
            padding: "12px 20px",
            backgroundColor: "#ffffff",
            color: "#1e3c72",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          ← Back to Home
        </button>

        {/* Title */}
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "10px",
            letterSpacing: "1px",
          }}
        >
          ONLINE COMPLAINT MANAGEMENT SYSTEM
        </h1>

        {/* Subtitle */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "400",
            marginTop: "0",
            opacity: "0.9",
          }}
        >
          REGISTRATION FORM
        </h3>
      </div>

      <div className="signup-page">
        <div className="signup-card">
          <header className="signup-header">
            <h1>Citizen Registration</h1>
            <p>
              Create your OCMS citizen account to file and track complaints
              online.
            </p>
          </header>

          {message && <div className="signup-message">{message}</div>}

          {step === "form" && (
            <form className="signup-form" onSubmit={handleRequestOtp}>
              <section className="signup-section">
                <h2>Account details</h2>
                <div className="signup-grid">
                  <div className="field">
                    <label>First name *</label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Last name *</label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Date of birth *</label>
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Mobile number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Email address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="field">
                    <label>Confirm password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="field">
                    <label>Security question *</label>
                    <select
                      name="securityQuestion"
                      value={form.securityQuestion}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a question</option>
                      <option value="school">Your first school name?</option>
                      <option value="pet">Your first pet name?</option>
                      <option value="city">City where you were born?</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Security answer *</label>
                    <input
                      name="securityAnswer"
                      value={form.securityAnswer}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="signup-section">
                <h2>Address & location</h2>
                <div className="signup-grid">
                  <div className="field">
                    <label>Country *</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      disabled
                      required
                    />
                  </div>
                  <div className="field">
                    <label>State *</label>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="ocms-select"
                    >
                      <option value="">Select State / Union Territory</option>

                      {STATES_AND_UTS.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>District *</label>
                    <select
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select District</option>

                      {form.state &&
                        DISTRICTS[form.state]?.map((district, index) => (
                          <option key={index} value={district}>
                            {district}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="field">
                    <label>City / Town *</label>
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select City / Town</option>

                      {form.district &&
                        CITIES[form.district]?.map((city, index) => (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      pattern="\d{6}"
                      maxLength="6"
                      placeholder="Enter 6-digit PIN code"
                    />
                  </div>

                  <div className="field field--full">
                    <label>Address line 1 *</label>
                    <input
                      name="addressLine1"
                      value={form.addressLine1}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="field field--full">
                    <label>Address line 2</label>
                    <input
                      name="addressLine2"
                      value={form.addressLine2}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </section>

              <section className="signup-section">
                <h2>Identity </h2>
                <div className="signup-grid">
                  <div className="field">
                    <label>Government ID type</label>
                    <select
                      name="govIdType"
                      value={form.govIdType}
                      onChange={handleChange}
                    >
                      <option value="">None</option>
                      <option value="aadhaar">Aadhaar</option>
                      <option value="pan">PAN</option>
                      <option value="voter">Voter ID</option>
                      <option value="dl">Driving Licence</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>ID last 4 digits</label>
                    <input
                      name="govIdLast4"
                      value={form.govIdLast4}
                      onChange={handleChange}
                      maxLength={4}
                    />
                  </div>
                  <div className="field">
                    <label>Alternate phone</label>
                    <input
                      name="altPhone"
                      value={form.altPhone}
                      onChange={handleChange}
                      type="tel"
                    />
                  </div>
                </div>
              </section>

              <section className="signup-section">
                <h2>Preferences & consent</h2>
                <div className="signup-grid">
                  <div className="field">
                    <label>Preferred language</label>
                    <select
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="field field--checkboxes">
                    <label>Notifications</label>
                    <div className="checkbox-row">
                      <label>
                        <input
                          type="checkbox"
                          name="notifySms"
                          checked={form.notifySms}
                          onChange={handleChange}
                        />
                        SMS
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="notifyEmail"
                          checked={form.notifyEmail}
                          onChange={handleChange}
                        />
                        Email
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="notifyWhatsApp"
                          checked={form.notifyWhatsApp}
                          onChange={handleChange}
                        />
                        WhatsApp
                      </label>
                    </div>
                  </div>
                </div>
                <div className="consent-box">
                  <label>
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={form.acceptTerms}
                      onChange={handleChange}
                    />
                    I agree to the Terms of Use and Citizen Charter.
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="acceptPrivacy"
                      checked={form.acceptPrivacy}
                      onChange={handleChange}
                    />
                    I have read the Privacy Policy and consent to processing of
                    my data for grievance redressal.
                  </label>
                  <p className="consent-warning">
                    Submitting false or misleading complaints may attract legal
                    action under applicable laws.
                  </p>
                </div>
              </section>

              <button
                className="signup-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Generate OTP & Continue"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form className="signup-otp-form" onSubmit={handleVerifyOtp}>
              <h2>Email verification</h2>
              <p>
                An OTP has been sent to <strong>{form.email}</strong>. Enter it
                below to complete your registration.
              </p>
              <div className="field">
                <label>OTP</label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <button
                className="signup-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="signup-complete">
              <h2>Registration successful</h2>
              <p>You can now login with your email and password.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
