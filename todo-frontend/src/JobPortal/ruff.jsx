import { useEffect, useState } from "react";
import axios from "axios";
import Dropdown from "./Dropdown";
import { LocationAPI } from "../api/LocationApi";
import "../styles/JobApplicationForm.css";
import { useNavigate } from "react-router-dom";

export default function JobApplicationForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);

  const [profileFile, setProfileFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [degreeFile, setDegreeFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [sendMessage, setSendMessage] = useState("");

  const [form, setForm] = useState({
    role_applied_for: "",
    full_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    aadhaar_number: "",
    address_line: "",
    pincode: "",
    date_of_birth: "",
    country_id: "",
    state_id: "",
    district_id: "",
    city_id: "",
    locality_id: "",
    highest_degree: "",
    field_of_study: "",
    institute_name: "",
    year_of_passing: "",
    years_of_experience: "",
    interested_department: "",
    selected_category: "",
    leadership_experience: "",
    skill_id: "",
    service_type_id: "",
    vehicle_available: "NO",
    driving_license_no: "",
    physically_fit: "YES",
  });

  useEffect(() => {
    (async () => {
      try {
        const c = await LocationAPI.getCountries();
        setCountries(normalizeOptions(c));
      } catch (e) {
        console.error("Country fetch error:", e.message);
        setCountries([]);
      }
    })();

    fetchDepartments();
  }, []);

  const normalizeOptions = (items) =>
    Array.isArray(items)
      ? items.map((it) => ({
          id:
            it.department_id ??
            it.category_id ??
            it.id ??
            it.country_id ??
            it.state_id ??
            it.district_id ??
            it.city_id ??
            it.locality_id ??
            it.iso2 ??
            it.code,
          name:
            it.department_name ??
            it.category_name ??
            it.country_name ??
            it.state_name ??
            it.district_name ??
            it.city_name ??
            it.locality_name ??
            it.name ??
            it.label,
        }))
      : [];

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/jobapplication-departments",
      );
      setDepartments(normalizeOptions(res.data));
    } catch (err) {
      console.error("Department fetch error:", err);
      setDepartments([]);
    }
  };

  const fetchCategories = async (departmentId) => {
    if (!departmentId) return setCategories([]);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/jobapplication-categories/${departmentId}`,
      );
      setCategories(normalizeOptions(res.data));
    } catch (err) {
      console.error("Category fetch error:", err);
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "email") {
      // entering a new email requires fresh verification
      setOtpSent(false);
      setOtpVerified(false);
      setOtpCode("");
      setResendTimer(0);
      setSendMessage("");
      setErrors((s) => ({ ...s, email: undefined, otp: undefined }));
    }
  };

  const handleCountry = async (id) => {
    setForm({
      ...form,
      country_id: id,
      state_id: "",
      district_id: "",
      city_id: "",
      locality_id: "",
    });
    try {
      const s = await LocationAPI.getStates(id);
      setStates(normalizeOptions(s));
      setDistricts([]);
      setCities([]);
      setLocalities([]);
    } catch (e) {
      setStates([]);
    }
  };

  const handleState = async (id) => {
    setForm({
      ...form,
      state_id: id,
      district_id: "",
      city_id: "",
      locality_id: "",
    });
    try {
      const d = await LocationAPI.getDistricts(id);
      setDistricts(normalizeOptions(d));
      setCities([]);
      setLocalities([]);
    } catch (e) {
      setDistricts([]);
    }
  };

  const handleDistrict = async (id) => {
    setForm({ ...form, district_id: id, city_id: "", locality_id: "" });
    try {
      const c = await LocationAPI.getCities(id);
      setCities(normalizeOptions(c));
      setLocalities([]);
    } catch (e) {
      setCities([]);
    }
  };

  const handleCity = async (id) => {
    setForm({ ...form, city_id: id, locality_id: "" });
    try {
      const l = await LocationAPI.getLocalities(id);
      setLocalities(normalizeOptions(l));
    } catch (e) {
      setLocalities([]);
    }
  };

  const handleDepartmentChange = (id) => {
    setForm({ ...form, interested_department: id, selected_category: "" });
    fetchCategories(id);
  };

  // ----- Email OTP handling -----
  const sendOtp = async () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setErrors((s) => ({ ...s, email: "Enter a valid email to send OTP" }));
      return;
    }
    if (sendLoading || (otpSent && resendTimer > 0)) return;
    setSendLoading(true);
    try {
      await axios.post("http://localhost:5000/api/send-otp", {
        email: form.email,
      });
      setOtpSent(true);
      setSendMessage("OTP sent to your email");
      setResendTimer(60);
      setErrors((s) => ({ ...s, email: undefined }));
    } catch (err) {
      console.error("send-otp error", err);
      setSendMessage("Failed to send OTP. Try again later.");
    } finally {
      setSendLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpCode) {
      setErrors((s) => ({ ...s, otp: "Enter OTP" }));
      return;
    }
    setVerifyingOtp(true);
    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", {
        email: form.email,
        otp: otpCode,
      });
      if (res?.data?.verified) {
        setOtpVerified(true);
        setOtpSent(false);
        setSendMessage("Email verified ✅");
        setErrors((s) => ({ ...s, otp: undefined, email: undefined }));
      } else {
        setErrors((s) => ({ ...s, otp: "Invalid or expired OTP" }));
      }
    } catch (err) {
      console.error("verify-otp error", err);
      setErrors((s) => ({ ...s, otp: "Verification failed" }));
    } finally {
      setVerifyingOtp(false);
    }
  };

  // countdown for resend
  useEffect(() => {
    if (!resendTimer) return;
    const t = setInterval(
      () => setResendTimer((s) => (s > 0 ? s - 1 : 0)),
      1000,
    );
    return () => clearInterval(t);
  }, [resendTimer]);

  const lockFields = !!(form.email && !otpVerified);

  const validate = () => {
    const e = {};
    if (!form.role_applied_for) e.role = "Please choose a role";
    if (!form.full_name) e.full_name = "Full name required";
    if (!form.last_name) e.last_name = "Last name required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Valid email required";
    } else if (!otpVerified) {
      e.email = "Please verify your email with OTP";
    }
    if (!form.mobile_number || form.mobile_number.length < 7)
      e.mobile_number = "Valid mobile number required";
    if (!form.aadhaar_number || form.aadhaar_number.length < 8)
      e.aadhaar_number = "Aadhaar/ID required";
    if (!form.address_line) e.address_line = "Address required";
    if (!form.pincode) e.pincode = "Pincode required";
    if (!form.date_of_birth) e.date_of_birth = "Date of birth required";
    if (!form.country_id) e.country_id = "Country required";
    if (!form.state_id) e.state_id = "State required";
    if (!form.city_id) e.city_id = "City required";

    // If role is Employee, ensure department/category
    if (form.role_applied_for === "Employee") {
      if (!form.interested_department)
        e.interested_department = "Department required";
      if (!form.selected_category) e.selected_category = "Category required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return window.scrollTo({ top: 0, behavior: "smooth" });

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("role_applied_for", form.role_applied_for || null);
      fd.append("full_name", form.full_name || null);
      fd.append("last_name", form.last_name || null);
      fd.append("email", form.email || null);
      fd.append("mobile_number", form.mobile_number || null);
      fd.append("aadhaar_number", form.aadhaar_number || null);
      fd.append("address_line", form.address_line || null);
      fd.append("pincode", form.pincode || null);
      fd.append("date_of_birth", form.date_of_birth || null);

      // INT fields
      fd.append(
        "country_id",
        form.country_id ? parseInt(form.country_id) : null,
      );
      fd.append("state_id", form.state_id ? parseInt(form.state_id) : null);
      fd.append(
        "district_id",
        form.district_id ? parseInt(form.district_id) : null,
      );
      fd.append("city_id", form.city_id ? parseInt(form.city_id) : null);
      fd.append(
        "locality_id",
        form.locality_id ? parseInt(form.locality_id) : null,
      );
      fd.append(
        "interested_department",
        form.interested_department
          ? parseInt(form.interested_department)
          : null,
      );
      fd.append(
        "selected_category",
        form.selected_category ? parseInt(form.selected_category) : null,
      );
      fd.append("skill_id", form.skill_id ? parseInt(form.skill_id) : null);
      fd.append(
        "service_type_id",
        form.service_type_id ? parseInt(form.service_type_id) : null,
      );

      // ENUM fields
      fd.append("vehicle_available", form.vehicle_available || "NO");
      fd.append("physically_fit", form.physically_fit || "YES");

      // Optional strings
      fd.append("highest_degree", form.highest_degree || null);
      fd.append("field_of_study", form.field_of_study || null);
      fd.append("institute_name", form.institute_name || null);
      fd.append("year_of_passing", form.year_of_passing || null);
      fd.append("years_of_experience", form.years_of_experience || null);
      fd.append("leadership_experience", form.leadership_experience || null);

      // Files
      if (profileFile) fd.append("profile_photo", profileFile);
      if (resumeFile) fd.append("resume_pdf", resumeFile);
      if (degreeFile) fd.append("degree_certificate", degreeFile);

      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));

      if (profileFile) fd.append("profile_photo", profileFile);
      if (resumeFile) fd.append("resume_pdf", resumeFile);
      if (degreeFile) fd.append("degree_certificate", degreeFile);

      const res = await axios.post(
        "http://localhost:5000/api/staff/apply",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res?.data?.message) {
        // success
        navigate("/job-application-success");
      }
    } catch (err) {
      console.error("Apply error:", err?.response || err);
      const msg =
        err?.response?.data?.message || err.message || "Submission failed";
      alert(`Submission failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      role_applied_for: "",
      full_name: "",
      last_name: "",
      email: "",
      mobile_number: "",
      aadhaar_number: "",
      address_line: "",
      pincode: "",
      date_of_birth: "",
      country_id: "",
      state_id: "",
      district_id: "",
      city_id: "",
      locality_id: "",
      highest_degree: "",
      field_of_study: "",
      institute_name: "",
      year_of_passing: "",
      years_of_experience: "",
      interested_department: "",
      selected_category: "",
      leadership_experience: "",
      skill_id: "",
      service_type_id: "",
      vehicle_available: "NO",
      driving_license_no: "",
      physically_fit: "YES",
    });
    setProfileFile(null);
    setResumeFile(null);
    setDegreeFile(null);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpCode("");
    setResendTimer(0);
    setSendMessage("");
    setErrors({});
  };

  return (
    <form className="job-form-container card" onSubmit={handleSubmit}>
      "<h2>Staff Application</h2>
      <div className="form-row">
        <div className="field">
          <label className="required">Apply As</label>
          <select
            name="role_applied_for"
            value={form.role_applied_for}
            onChange={(e) => {
              setRole(e.target.value);
              setForm({ ...form, role_applied_for: e.target.value });
            }}
            disabled={lockFields}
          >
            <option value="">Select Role</option>
            <option value="Secondary Admin">Secondary Admin</option>
            <option value="Head">Head</option>
            <option value="Task Manager">Task Manager</option>
            <option value="Employee">Employee</option>
          </select>
          {errors.role && <small className="error">{errors.role}</small>}
        </div>

        <div className="field">
          <label className="required">Full Name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            disabled={lockFields}
          />
          {errors.full_name && (
            <small className="error">{errors.full_name}</small>
          )}
        </div>

        <div className="field">
          <label className="required">Last Name</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            disabled={lockFields}
          />
        </div>

        <div className="field">
          <label className="required">Email</label>

          <div className="email-otp-row">
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            <button
              type="button"
              className="otp-btn"
              onClick={sendOtp}
              disabled={
                sendLoading || !form.email || (otpSent && resendTimer > 0)
              }
            >
              {sendLoading
                ? "Sending..."
                : otpSent && resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : otpSent
                    ? "Resend OTP"
                    : "Send OTP"}
            </button>
          </div>

          {sendMessage && <small className="muted">{sendMessage}</small>}

          {otpSent && (
            <div className="otp-verify-row">
              <input
                name="otp"
                placeholder="Enter OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
              <button
                type="button"
                className="otp-verify"
                onClick={verifyOtp}
                disabled={verifyingOtp}
              >
                {verifyingOtp ? "Verifying..." : "Verify"}
              </button>
            </div>
          )}

          {otpVerified && <div className="verified-badge">Verified ✓</div>}

          {errors.otp && <small className="error">{errors.otp}</small>}
          {errors.email && <small className="error">{errors.email}</small>}
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label className="required">Mobile Number</label>
          <input
            name="mobile_number"
            value={form.mobile_number}
            onChange={handleChange}
            maxLength={10}
            disabled={lockFields}
          />
          {errors.mobile_number && (
            <small className="error">{errors.mobile_number}</small>
          )}
        </div>

        <div className="field">
          <label className="required">Aadhaar</label>
          <input
            name="aadhaar_number"
            value={form.aadhaar_number}
            onChange={handleChange}
            maxLength={12}
            disabled={lockFields}
          />
          {errors.aadhaar_number && (
            <small className="error">{errors.aadhaar_number}</small>
          )}
        </div>

        <div className="field">
          <label className="required">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            disabled={lockFields}
          />
          {errors.date_of_birth && (
            <small className="error">{errors.date_of_birth}</small>
          )}
        </div>
      </div>
      <div className="form-row">
        <div className="field wide">
          <label className="required">Address</label>
          <textarea
            name="address_line"
            value={form.address_line}
            onChange={handleChange}
            disabled={lockFields}
          />
          {errors.address_line && (
            <small className="error">{errors.address_line}</small>
          )}
        </div>

        <div className="field small">
          <label className="required">Pincode</label>
          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            maxLength={6}
            disabled={lockFields}
          />
          {errors.pincode && <small className="error">{errors.pincode}</small>}
        </div>
      </div>
      <div className="form-row">
        <Dropdown
          label="Country"
          required
          value={form.country_id}
          options={countries}
          onChange={handleCountry}
          disabled={lockFields}
        />
        <Dropdown
          label="State"
          required
          value={form.state_id}
          options={states}
          onChange={handleState}
          disabled={lockFields}
        />
        <Dropdown
          label="District"
          required
          value={form.district_id}
          options={districts}
          onChange={handleDistrict}
          disabled={lockFields}
        />
        <Dropdown
          label="City"
          required
          value={form.city_id}
          options={cities}
          onChange={handleCity}
          disabled={lockFields}
        />
      </div>
      <div className="form-row">
        <Dropdown
          label="Locality"
          required
          value={form.locality_id}
          options={localities}
          onChange={(id) => setForm({ ...form, locality_id: id })}
          disabled={lockFields}
        />

        <div className="field">
          <label>Vehicle Available</label>
          <select
            name="vehicle_available"
            value={form.vehicle_available}
            onChange={handleChange}
            disabled={lockFields}
          >
            <option value="NO">No</option>
            <option value="YES">Yes</option>
          </select>
        </div>

        <div className="field">
          <label>Physically Fit</label>
          <select
            name="physically_fit"
            value={form.physically_fit}
            onChange={handleChange}
            disabled={lockFields}
          >
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>
        </div>
      </div>
      {role === "Employee" && (
        <>
          <div className="section-title">Employment Preferences</div>
          <div className="form-row">
            <Dropdown
              label="Interested Department"
              required
              value={form.interested_department}
              options={departments}
              onChange={handleDepartmentChange}
              disabled={lockFields}
            />
            <Dropdown
              label="Select Category"
              required
              value={form.selected_category}
              options={categories}
              onChange={(id) => setForm({ ...form, selected_category: id })}
              disabled={!form.interested_department || lockFields}
            />

            <div className="field">
              <label>Years of Experience</label>
              <input
                name="years_of_experience"
                value={form.years_of_experience}
                onChange={handleChange}
                disabled={lockFields}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field wide">
              <label>Leadership Experience</label>
              <textarea
                name="leadership_experience"
                value={form.leadership_experience}
                placeholder={`1) \n2)`} // works in most modern browsers
                onChange={handleChange}
                disabled={lockFields}
              />
            </div>
          </div>
        </>
      )}
      <div className="section-title">Education & Documents</div>
      <div className="form-row">
        <div className="field">
          <label>Highest Degree</label>
          <input
            name="highest_degree"
            value={form.highest_degree}
            onChange={handleChange}
            disabled={lockFields}
          />
        </div>

        <div className="field">
          <label>Field of Study</label>
          <input
            name="field_of_study"
            value={form.field_of_study}
            onChange={handleChange}
            disabled={lockFields}
          />
        </div>

        <div className="field">
          <label>Institute</label>
          <input
            name="institute_name"
            value={form.institute_name}
            onChange={handleChange}
            disabled={lockFields}
          />
        </div>

        <div className="field small">
          <label>Year of Passing</label>
          <input
            name="year_of_passing"
            value={form.year_of_passing}
            onChange={handleChange}
            disabled={lockFields}
          />
        </div>
      </div>
      <div className="form-row file-row">
        <div className="field">
          <label>Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileFile(e.target.files[0])}
            disabled={lockFields}
          />
          {profileFile && <small className="muted">{profileFile.name}</small>}
        </div>

        <div className="field">
          <label>Resume (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
            disabled={lockFields}
          />
          {resumeFile && <small className="muted">{resumeFile.name}</small>}
        </div>

        <div className="field">
          <label>Degree Certificate</label>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setDegreeFile(e.target.files[0])}
            disabled={lockFields}
          />
          {degreeFile && <small className="muted">{degreeFile.name}</small>}
        </div>
      </div>
      <div className="form-actions">
        <button
          type="submit"
          className="primary"
          disabled={submitting || lockFields}
          title={lockFields ? "Verify your email to continue" : undefined}
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
        <button type="button" onClick={resetForm} className="ghost">
          Reset
        </button>
      </div>
      <div className="help-text">
        ✅ We store your files securely. You will receive an email once your
        application is reviewed.
      </div>
    </form>
  );
}
