const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER || "akshuraj2k6@gmail.com",
    pass: process.env.SMTP_PASS || "qpin enrp rozy uvih",
  },
});

// Verify transporter on startup so we can log obvious config errors
transporter.verify().then(() => {
  console.log("Mailer: SMTP transporter is ready");
}).catch((err) => {
  console.error("Mailer: transporter verify failed:", err.message || err);
});

const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"OCMS Support" <${process.env.SMTP_USER || "akshuraj2k6@gmail.com"}>`,
    to: toEmail,
    subject: "OCMS Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Online Complaint Management System</h2>
        <p>Your OTP for account registration is:</p>
        <h1 style="color:#1e3c72;">${otp}</h1>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr/>
        <small>OCMS – Government of India</small>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Mailer: sent OTP to ${toEmail}, id=${info.messageId}`);
    return info;
  } catch (err) {
    console.error("Mailer: sendMail failed:", err);
    throw err;
  }
};

module.exports = sendOtpEmail;
