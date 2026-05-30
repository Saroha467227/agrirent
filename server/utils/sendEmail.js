const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using your email service (e.g., Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to 'SendGrid', etc.
    auth: {
      user: process.env.SMTP_EMAIL, // Your Gmail address
      pass: process.env.SMTP_PASSWORD, // Your Gmail App Password
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'AgriRent Support'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
