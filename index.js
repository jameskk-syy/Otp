// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');
const sendOtp = require('./api/send-otp');
const verifyOtp = require('./api/verifyOtp');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Shared in-memory storage for OTPs
let otpStorage = {}; // This should be declared here

// Routes
app.post('/api/send-otp', (req, res) => {
  sendOtp(req, res, otpStorage).then(() => {
    console.log('OTP storage after sending:', otpStorage); // Log OTP storage after sending OTP
  });
});

app.post('/api/verify-otp', (req, res) => verifyOtp(req, res, otpStorage));

// Start listening to incoming requests
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
