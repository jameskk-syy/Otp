// Import necessary modules
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const sendOtp = require('./api/send-otp');
const verifyOtp = require('./api/verifyOtp');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.post('/api/send-otp', sendOtp);
app.post('/api/verify-otp', verifyOtp);

// Start listening to incoming requests
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
