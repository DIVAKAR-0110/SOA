const transporter = require('./transporter');

const queryPromise = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

/**
 * Send a notification email directly to a HEAD user (by email).
 * Returns the nodemailer info object on success, or null on failure.
 */
async function sendHeadNotificationEmail(headEmail, complaintDetails = {}) {
  const {
    headName = '',
    complaintTitle = 'No title provided',
    locationName = 'Unknown',
    address = 'No address provided',
    priority = 'NORMAL',
    reportedBy = 'Guest User',
  } = complaintDetails;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('EMAIL_USER/EMAIL_PASS not configured; skipping notification.');
    return null;
  }

  if (!headEmail) {
    console.warn('No headEmail provided; skipping notification.');
    return null;
  }

  const subject = 'New Complaint Registered – Action Required';

  const text = `Hello ${headName || 'Head'},\n\nA new complaint has been registered by ${reportedBy}.\n\nTitle: ${complaintTitle}\nLocation: ${locationName}\nAddress: ${address}\nPriority: ${priority}\n\nPlease log in to the website and assign staff to this complaint.\n\nThanks.`;

  const html = `<p>Hello <strong>${headName || 'Head'}</strong>,</p>
    <p>A new complaint has been registered by <strong>${reportedBy}</strong>.</p>
    <ul>
      <li><strong>Title:</strong> ${complaintTitle}</li>
      <li><strong>Location:</strong> ${locationName}</li>
      <li><strong>Address:</strong> ${address}</li>
      <li><strong>Priority:</strong> ${priority}</li>
    </ul>
    <p>Please <strong>log in</strong> to the website and <strong>assign staff</strong> to this complaint.</p>
    <p>Thanks.</p>`;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: headEmail,
      subject,
      text,
      html,
    });

    console.log(`Email sent to HEAD (${headEmail}) for complaint '${complaintTitle}' — messageId: ${info && info.messageId}`);
    return info;
  } catch (err) {
    console.error('Failed to send HEAD notification email:', err && (err.message || err));
    return null;
  }
}

/**
 * Find HEAD for a location and send notification email (non-blocking caller-friendly helper).
 */
async function sendNewComplaintNotification(db, { locationId, complaintTitle, address, priority, dummyUser = 'Guest User' } = {}) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('EMAIL_USER/EMAIL_PASS not configured; skipping notification.');
      return null;
    }

    if (!locationId) {
      console.warn('No locationId provided; skipping notification.');
      return null;
    }

    // Find HEAD for the location
    const heads = await queryPromise(db, 'SELECT id, name, email FROM users WHERE role = ? AND location_id = ? LIMIT 1', ['HEAD', locationId]);
    if (!Array.isArray(heads) || heads.length === 0) {
      console.log(`No HEAD found for location ${locationId}; no email will be sent.`);
      return null;
    }

    const head = heads[0];

    // Get location name for email content
    const locRows = await queryPromise(db, 'SELECT name FROM locations WHERE id = ? LIMIT 1', [locationId]);
    const locationName = Array.isArray(locRows) && locRows.length ? locRows[0].name : 'Unknown';

    // Use the dedicated function to send the email
    return await sendHeadNotificationEmail(head.email, {
      headName: head.name,
      complaintTitle,
      locationName,
      address,
      priority,
      reportedBy: dummyUser,
    });
  } catch (err) {
    // Email failure should not throw or interrupt DB insert flow; log only
    console.error('Failed to send complaint notification email:', err && (err.message || err));
    return null;
  }
}

module.exports = { sendNewComplaintNotification, sendHeadNotificationEmail };