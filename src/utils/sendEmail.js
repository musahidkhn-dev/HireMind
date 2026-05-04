import nodemailer from 'nodemailer';

// console.log("Initializing Email Transporter with user:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify email server connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email server connection FAILED:', error.message);
    console.error('Check if EMAIL_USER and EMAIL_PASS (App Password) are correct in .env');
  } else {
    console.log('Email server is READY to send OTPs');
  }
});

const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html: html || text,
    text: text || '',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message);
    throw error;
  }
};

export default sendEmail;
export { transporter };