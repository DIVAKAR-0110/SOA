const sendOtpEmail = require("./mailer");

sendOtpEmail("akshuraj2k6@gmail.com", "123456")
  .then(() => console.log("Email sent successfully"))
  .catch((err) => console.error("Mailer error:", err.message));
