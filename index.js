// Import necessary modules
const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

let otpStorage = {}; // In-memory storage for OTPs

// Route to generate and send OTP via email
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the OTP associated with the email
  otpStorage[email] = otp;

  // Create a nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL, // Your email address
      pass: process.env.PASSWORD, // Your email password or app password
    },
  });

  // Define email options
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
});

// Route to verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  // Check if OTP is correct
  if (otpStorage[email] && otpStorage[email] === otp) {
    res.status(200).json({ message: 'OTP verified successfully' ,status:'success', statusCode:200});
  } else {
    res.status(400).json({ message: 'Invalid OTP',status:'failed', statusCode:404 });
  }
});

// Start listening to incoming requests
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
