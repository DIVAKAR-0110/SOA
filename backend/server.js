// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

// ==== CONFIG ====

// your existing cluster URI – add a DB name at the end
const MONGO_URI =
  "mongodb+srv://akshuraj2k6_db_user:oCTX1rixcaZchptC@cluster0.nkzfgmg.mongodb.net/ocms_db";

// configure mail (Gmail example: use app password)
const MAIL_USER = "yourgmail@gmail.com";
const MAIL_PASS = "your_app_password";

// ==== MIDDLEWARE ====

app.use(cors());
app.use(express.json());

// ==== NODEMAILER TRANSPORT ====

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

async function sendOtp(email, code) {
  const mailOptions = {
    from: `"OCMS Support" <${MAIL_USER}>`,
    to: email,
    subject: "OCMS - Email Verification OTP",
    text: `Your OCMS verification OTP is: ${code}. It is valid for 10 minutes.`,
  };
  await transporter.sendMail(mailOptions);
}

// ==== MONGOOSE SCHEMA/MODEL ====

const addressSchema = new mongoose.Schema(
  {
    line1: String,
    line2: String,
    city: String,
    district: String,
    state: String,
    country: String,
    pincode: String,
  },
  { _id: false }
);

const govIdSchema = new mongoose.Schema(
  {
    type: String, // aadhaar | pan | voter | dl
    last4: String,
    verifiedFlag: { type: Boolean, default: false },
  },
  { _id: false }
);

const preferencesSchema = new mongoose.Schema(
  {
    language: { type: String, default: "English" },
    notifySms: { type: Boolean, default: true },
    notifyEmail: { type: Boolean, default: true },
    notifyWhatsApp: { type: Boolean, default: false },
  },
  { _id: false }
);

const securitySchema = new mongoose.Schema(
  {
    questionId: String,
    answerHash: String,
  },
  { _id: false }
);

const consentSchema = new mongoose.Schema(
  {
    termsAcceptedAt: Date,
    privacyAcceptedAt: Date,
  },
  { _id: false }
);

const citizenSchema = new mongoose.Schema(
  {
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    dob: { type: Date, required: true },
    gender: String,
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    mobileVerified: { type: Boolean, default: false },
    passwordHash: { type: String, required: true },
    address: addressSchema,
    govId: govIdSchema,
    preferences: preferencesSchema,
    security: securitySchema,
    consent: consentSchema,
    lastLoginAt: Date,
  },
  { timestamps: true }
);

citizenSchema.methods.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

citizenSchema.statics.createWithPassword = async function (payload) {
  const passwordHash = await bcrypt.hash(payload.password, 10);
  const answerHash = payload.securityAnswer
    ? await bcrypt.hash(payload.securityAnswer, 10)
    : undefined;

  return this.create({
    name: { first: payload.firstName, last: payload.lastName },
    dob: payload.dob,
    gender: payload.gender,
    mobile: payload.mobile,
    email: payload.email,
    emailVerified: true,
    passwordHash,
    address: {
      line1: payload.addressLine1,
      line2: payload.addressLine2,
      city: payload.city,
      district: payload.district,
      state: payload.state,
      country: payload.country,
      pincode: payload.pincode,
    },
    govId: {
      type: payload.govIdType,
      last4: payload.govIdLast4,
    },
    preferences: {
      language: payload.language,
      notifySms: payload.notifySms,
      notifyEmail: payload.notifyEmail,
      notifyWhatsApp: payload.notifyWhatsApp,
    },
    security: {
      questionId: payload.securityQuestion,
      answerHash,
    },
    consent: {
      termsAcceptedAt: payload.termsAcceptedAt,
      privacyAcceptedAt: payload.privacyAcceptedAt,
    },
  });
};

const Citizen = mongoose.model("Citizen", citizenSchema);

// ==== SIMPLE IN-MEMORY OTP STORE (replace with Mongo/Redis in prod) ====

const PendingOtp = new Map();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ==== ROUTES ====

// health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "OCMS registration API" });
});

// prepare registration: validate, generate OTP, send email
app.post("/api/auth/register/prepare", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      mobile,
      email,
      password,
      confirmPassword,
      acceptTerms,
      acceptPrivacy,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !dob ||
      !mobile ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!acceptTerms || !acceptPrivacy) {
      return res
        .status(400)
        .json({ message: "Please accept Terms and Privacy Policy." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existing = await Citizen.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    PendingOtp.set(email, { otp, expiresAt, payload: req.body });

    await sendOtp(email, otp);

    return res.json({ message: "OTP sent to email." });
  } catch (err) {
    console.error("register/prepare error", err);
    return res.status(500).json({ message: "Server error." });
  }
});

// verify OTP and create citizen
app.post("/api/auth/register/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = PendingOtp.get(email);

    if (!record) {
      return res.status(400).json({ message: "No OTP request found." });
    }

    if (Date.now() > record.expiresAt) {
      PendingOtp.delete(email);
      return res.status(400).json({ message: "OTP expired." });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const payload = record.payload;
    payload.termsAcceptedAt = new Date();
    payload.privacyAcceptedAt = new Date();

    await Citizen.createWithPassword(payload);
    PendingOtp.delete(email);

    return res.json({ message: "Registration successful." });
  } catch (err) {
    console.error("register/verify error", err);
    return res.status(500).json({ message: "Server error." });
  }
});

// ==== DB CONNECT + SERVER START ====

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
