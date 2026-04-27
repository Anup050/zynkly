const nodemailer = require('nodemailer');

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send OTP for Gmail account verification via Nodemailer.
 * Used after Google OAuth sign-in; user must enter this OTP to verify their Gmail.
 */
const sendOtpEmail = async (to, otp) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Nodemailer: EMAIL_USER or EMAIL_PASS not set. OTP email skipped.');
    return;
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Zynkly: Verify your Gmail – OTP',
    html: `
      <p>You signed in with your Gmail. Use this one-time password to verify your account:</p>
      <p style="font-size:1.5rem;letter-spacing:0.25em;font-weight:bold;">${otp}</p>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>— Zynkly</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendOrderConfirmationEmail = async (to, orderDetails) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Nodemailer: EMAIL_USER or EMAIL_PASS not set. Order confirmation email skipped.');
    return;
  }
  const servicesList = orderDetails.services.map((s) => s.name).join(', ');
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Zynkly: Your Cleaning Request Confirmation',
    html: `
      <p>Dear ${orderDetails.customerName},</p>
      <p>Thank you for your cleaning request! Here are your order details:</p>
      <ul>
        <li>Order ID: ${orderDetails._id}</li>
        <li>Services: ${servicesList}</li>
        <li>Room Number: ${orderDetails.roomNumber}</li>
        <li>PG Name: ${orderDetails.pgName}</li>
        <li>Mobile Number: ${orderDetails.mobileNumber}</li>
        <li>Status: ${orderDetails.orderStatus}</li>
      </ul>
      <p>We will contact you shortly to confirm the details.</p>
      <p>Thank you,<br>The Zynkly Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail, sendOrderConfirmationEmail, getTransporter };
