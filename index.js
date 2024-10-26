// File: .env
/*
EMAIL=your-gmail@gmail.com
PASSWORD=your-gmail-app-password
PORT=3001
*/

// File: server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Store OTPs in memory (resets when server restarts)
const otpStore = new Map();

// Routes
app.post('/api/send-otp', sendOTP);
app.post('/api/verify-otp', verifyOTP);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Export both functions
module.exports = { sendOTP, verifyOTP };